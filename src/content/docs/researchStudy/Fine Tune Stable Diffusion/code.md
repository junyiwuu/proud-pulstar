---
title: code details
description: code reference for Technical Report
---

## \_replace_unet_conv_in
```python
def _replace_unet_conv_in(self):
	# make a copy of current weight and bias, avoid modify the original 
	_weight = self.model.unet.conv_in.weight.clone()  # [320, 4, 3, 3]
	_bias = self.model.unet.conv_in.bias.clone()  # [320]

	# duplicate the channels, from [320, 4, 3, 3] -> [320, 8, 3, 3]
	_weight = _weight.repeat((1, 2, 1, 1)) 
	
	# half the activation magnitude
	_weight *= 0.5

	# in the unet architecture: Conv2d(4, 320, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
	# here 320 is out_channels, we want to have the same out_channels without hard-copy
	_n_convin_out_channel = self.model.unet.conv_in.out_channels
	
	_new_conv_in = Conv2d(
		8, _n_convin_out_channel, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
		
	# assign weight and bias to the new conv_in
	_new_conv_in.weight = Parameter(_weight)
	_new_conv_in.bias = Parameter(_bias)

	# replace the new_con_in in the unet
	self.model.unet.conv_in = _new_conv_in
	
	logging.info("Unet conv_in layer is replaced")
	# replace config
	self.model.unet.config["in_channels"] = 8
	logging.info("Unet config is updated")
	return
```




## \_get_next_seed

```python
def _get_next_seed(self):
	if 0 == len(self.global_seed_sequence):
		self.global_seed_sequence = generate_seed_sequence(
			initial_seed=self.seed,
			length=self.max_iter * self.gradient_accumulation_steps,
		)
		logging.info(
			f"Global seed sequence is generated, length={len(self.global_seed_sequence)}"
		)
	return self.global_seed_sequence.pop()￼
```


## generate_seed_sequence
```python
def generate_seed_sequence(
    initial_seed: int, length: int,

	# hexadecimal format
    min_val=-0x8000_0000_0000_0000,
    max_val=0xFFFF_FFFF_FFFF_FFFF,
):

    if initial_seed is None:
        logging.warning("initial_seed is None, reproducibility is not guaranteed")

	# set the random seed for later 
    random.seed(initial_seed)
    seed_sequence = []

    for _ in range(length):
        seed = random.randint(min_val, max_val)
        seed_sequence.append(seed)
    return seed_sequence
```



## training loop


```python

def train(self, t_end=None):
	logging.info("Start training")

	device = self.device
	self.model.to(device)

	if self.in_evaluation:
		logging.info(
			"Last evaluation was not finished, will do evaluation before continue training."
		)
		self.validate()

	self.train_metrics.reset()
	accumulated_step = 0

	for epoch in range(self.epoch, self.max_epoch + 1):
		self.epoch = epoch
		logging.debug(f"epoch: {self.epoch}")

		# Skip previous batches when resume
		for batch in skip_first_batches(self.train_loader, self.n_batch_in_epoch):
			# set the mpde; as training mode
			# eval mode: unet.eval()
			self.model.unet.train()
			# globally consistent random generators 
			if self.seed is not None:
				local_seed = self._get_next_seed()
				rand_num_generator = torch.Generator(device=device)
				rand_num_generator.manual_seed(local_seed)
			else:
				rand_num_generator = None



		# >>> With gradient accumulation >>>
			# Get data
```
```
			beauty = batch["beauty_norm"].to(device)
			albedo_gt_for_latent = batch[self.gt_type].to(device) # train.yaml: gt_type: albedo_norm
			
```
^getdata


```

			# ----------------- valid mask -----------------
			if self.gt_mask_type is not None:
				valid_mask_for_latent = batch[self.gt_mask_type].to(device)
				invalid_mask = ~valid_mask_for_latent
				valid_mask_down = ~torch.max_pool2d(
					invalid_mask.float(), 8, 8
				).bool()
				valid_mask_down = valid_mask_down.repeat((1, 4, 1, 1))
				# print("ABOUT MASK:" ,valid_mask_down.sum(), valid_mask_down.numel())
				# print("mask ratio", valid_mask_down.float().mean().item())
			else:
				raise NotImplementedError
			# ----------------------------------------------
```
^validmask



```python
			# check 
			batch_size = beauty.shape[0]

			with torch.no_grad():
				# Encode image
				beauty_latent = self.model._encode_rgb(beauty)  # [B, 4, h, w]. 
				# Encode GT depth
				gt_albedo_latent = self.model._encode_rgb(
					albedo_gt_for_latent
				)  # [B, 4, h, w]

			# Sample a random timestep for each image
			timesteps = torch.randint(
				0,
				self.scheduler_timesteps,
				(batch_size,),
				device=device,
				generator=rand_num_generator,
			).long()  # [B]

			# Sample noise
			#####################################
			#        multi_res noise area       #
			#####################################
			if self.apply_multi_res_noise:
				strength = self.mr_noise_strength
				if self.annealed_mr_noise:
					# calculate strength depending on t
					strength = strength * (timesteps / self.scheduler_timesteps)
				noise = multi_res_noise_like(
					gt_albedo_latent,
					strength=strength,
					downscale_strategy=self.mr_noise_downscale_strategy,
					generator=rand_num_generator,
					device=device,
				)
			else:
				noise = torch.randn(
					gt_albedo_latent.shape,
					device=device,
					generator=rand_num_generator,
				)  # [B, 4, h, w]

			# Add noise to the latents (diffusion forward process)
			noisy_latents = self.training_noise_scheduler.add_noise(
				gt_albedo_latent, noise, timesteps
			)  # [B, 4, h, w]


			#####################################
			#            Text embedding         #
			#####################################
			text_embed = self.empty_text_embed.to(device).repeat(
				(batch_size, 1, 1)
			)  # [B, 77, 1024]

			# Concat rgb and depth latents
			cat_latents = torch.cat(
				# [beauty_latent, noisy_latents], dim=1
				[noisy_latents, beauty_latent], dim=1
			)  # [B, 8, h, w]
			cat_latents = cat_latents.float()

			#####################################
			#     predict the noise residual     #
			#####################################
			model_pred = self.model.unet(
				cat_latents, timesteps, text_embed
			).sample  # [B, 4, h, w]
			if torch.isnan(model_pred).any():
				logging.warning("model_pred contains NaN.")

			# Get the target for loss depending on the prediction type
			if "sample" == self.prediction_type:
				target = gt_albedo_latent
			elif "epsilon" == self.prediction_type:
				target = noise
			elif "v_prediction" == self.prediction_type:
				target = self.training_noise_scheduler.get_velocity(
					gt_albedo_latent, noise, timesteps
				)  # [B, 4, h, w]
			else:
				raise ValueError(f"Unknown prediction type {self.prediction_type}")

			
			#####################################
			#              loss                 #
			#####################################
			# Masked latent loss
			if self.gt_mask_type is not None:
				latent_loss = self.loss(
					model_pred[valid_mask_down].float(),
					target[valid_mask_down].float(),
				)
			else:
				latent_loss = self.loss(model_pred.float(), target.float())

			loss = latent_loss.mean()

			self.train_metrics.update("loss", loss.item())

			loss = loss / self.gradient_accumulation_steps
			loss.backward()
			# ------------------------------------------------------
			accumulated_step += 1

			self.n_batch_in_epoch += 1
			# Practical batch end

			# Perform optimization step
			if accumulated_step >= self.gradient_accumulation_steps:
				self.optimizer.step()
				self.lr_scheduler.step()
				self.optimizer.zero_grad()
				accumulated_step = 0

				self.effective_iter += 1

				# Log to tensorboard
				accumulated_loss = self.train_metrics.result()["loss"]
				tb_logger.log_dic(
					{
						f"train/{k}": v
						for k, v in self.train_metrics.result().items()
					},
					global_step=self.effective_iter,
				)
				tb_logger.writer.add_scalar(
					"lr",
					self.lr_scheduler.get_last_lr()[0],
					global_step=self.effective_iter,
				)
				tb_logger.writer.add_scalar(
					"n_batch_in_epoch",
					self.n_batch_in_epoch,
					global_step=self.effective_iter,
				)
				logging.info(
					f"iter {self.effective_iter:5d} (epoch {epoch:2d}): loss={accumulated_loss:.5f}"
				)
				self.train_metrics.reset()

				# Per-step callback
				self._train_step_callback()

				# End of training
				# if at least iter 1, and effective bigger than max iter allowed,
				# finish the training
				if self.max_iter > 0 and self.effective_iter >= self.max_iter:
					self.save_checkpoint(
						ckpt_name=self._get_backup_ckpt_name(),
						save_train_state=False,
					)
					logging.info("Training ended.")
					return
				# Time's up
				elif t_end is not None and datetime.now() >= t_end:
					self.save_checkpoint(ckpt_name="latest", save_train_state=True)
					logging.info("Time is up, training paused.")
					return

				torch.cuda.empty_cache()
				# <<< Effective batch end <<<

		# Epoch end
		self.n_batch_in_epoch = 0
```


## \_train_step_callback
```python
def _train_step_callback(self):
	"""Executed after every iteration"""
	# Save backup (with a larger interval, without training states)
	if self.backup_period > 0 and 0 == self.effective_iter % self.backup_period:
		self.save_checkpoint(
			ckpt_name=self._get_backup_ckpt_name(), save_train_state=False
		)

	_is_latest_saved = False
	# Validation
	if self.val_period > 0 and 0 == self.effective_iter % self.val_period:
		self.in_evaluation = True  # flag to do evaluation in resume run if validation is not finished
		self.save_checkpoint(ckpt_name="latest", save_train_state=True)
		_is_latest_saved = True
		self.validate()
		self.in_evaluation = False
		self.save_checkpoint(ckpt_name="latest", save_train_state=True)

	# Save training checkpoint (can be resumed)
	if (
		self.save_period > 0
		and 0 == self.effective_iter % self.save_period
		and not _is_latest_saved
	):
		self.save_checkpoint(ckpt_name="latest", save_train_state=True)

	# Visualization
	if self.vis_period > 0 and 0 == self.effective_iter % self.vis_period:
		self.visualize()
```

^6c41d6




## validate
```
def validate(self):
	for i, val_loader in enumerate(self.val_loaders):
		val_dataset_name = val_loader.dataset.disp_name
		val_metric_dic = self.validate_single_dataset(
			data_loader=val_loader, metric_tracker=self.val_metrics
		)
		logging.info(
			f"Iter {self.effective_iter}. Validation metrics on `{val_dataset_name}`: {val_metric_dic}"
		)
		tb_logger.log_dic(
			{f"val/{val_dataset_name}/{k}": v for k, v in val_metric_dic.items()},
			global_step=self.effective_iter,
		)
		# save to file
		eval_text = eval_dic_to_text(
			val_metrics=val_metric_dic,
			dataset_name=val_dataset_name,
			sample_list_path=val_loader.dataset.filename_ls_path,
		)
		_save_to = os.path.join(
			self.out_dir_eval,
			f"eval-{val_dataset_name}-iter{self.effective_iter:06d}.txt",
		)
		with open(_save_to, "w+") as f:
			f.write(eval_text)

		# Update main eval metric
		if 0 == i:
			main_eval_metric = val_metric_dic[self.main_val_metric]
			if (
				"minimize" == self.main_val_metric_goal
				and main_eval_metric < self.best_metric
				or "maximize" == self.main_val_metric_goal
				and main_eval_metric > self.best_metric
			):
				self.best_metric = main_eval_metric
				logging.info(
					f"Best metric: {self.main_val_metric} = {self.best_metric} at iteration {self.effective_iter}"
				)
				# Save a checkpoint
				self.save_checkpoint(
					ckpt_name=self._get_backup_ckpt_name(), save_train_state=False
				)


```



### validate_single_dataset
```python
@torch.no_grad()
def validate_single_dataset(
	self,
	data_loader: DataLoader, metric_tracker: MetricTracker,
	save_to_dir: str = None,
):
	self.model.to(self.device)
	metric_tracker.reset()

	# Generate seed sequence for consistent evaluation
	val_init_seed = self.cfg.validation.init_seed
	val_seed_ls = generate_seed_sequence(val_init_seed, len(data_loader))

	for i, batch in enumerate(
		tqdm(data_loader, desc=f"evaluating on {data_loader.dataset.disp_name}"),
		start=1,
	):
		assert 1 == data_loader.batch_size
		# Read input image
		beauty_norm = batch["beauty_norm"]  # [B, 3, H, W]
		# albedo input
		albedo_raw_ts = batch["albedo_norm"]
		albedo_raw = albedo_raw_ts.numpy()
		albedo_raw_ts = albedo_raw_ts.to(self.device)

		# valid_mask_ts = batch["valid_mask_raw"].squeeze()
		# valid_mask = valid_mask_ts.numpy()
		# valid_mask_ts = valid_mask_ts.to(self.device)
		valid_mask_ts = batch['valid_mask_raw'].to(self.device)

		# Random number generator
		seed = val_seed_ls.pop()
		if seed is None:
			generator = None
		else:
			generator = torch.Generator(device=self.device)
			generator.manual_seed(seed)

		# Predict albedo (PREDICTION PART)
		pipe_out: MaterialOutput = self.model(
			beauty_norm,
			denoising_steps=self.cfg.validation.denoising_steps,
			ensemble_size=self.cfg.validation.ensemble_size,
			processing_res=self.cfg.validation.processing_res,
			match_input_res=self.cfg.validation.match_input_res,
			generator=generator,
			batch_size=1,  # use batch size 1 to increase reproducibility
			color_map=None,
			show_progress_bar=False,
			resample_method=self.cfg.validation.resample_method,
		)

		albedo_pred: np.ndarray = pipe_out.albedo_np

		# Clip to dataset min max
		albedo_pred = np.clip(
			albedo_pred,
			###### not using original min_depth and max_depth
			a_min = -1.0,
			a_max = 1.0,
		)

		# clip to d > 0 for evaluation. This is for depth
		# albedo_pred = np.clip(albedo_pred, a_min=1e-6, a_max=None)

		# Evaluate
		sample_metric = []
		##### change , fix the dimension
		# albedo_pred_ts = (torch.from_numpy(albedo_pred).to(self.device))
		# 之前pipeline输出的图是numpy，。所以这里需要再转回tensor
		albedo_pred_ts = (torch.from_numpy(albedo_pred) # (H, W, 3)
						  .permute(2,0,1) # -> (3, H , W)
						  .unsqueeze(0) # -> (1, 3, H, W)
						  .to(self.device))
		valid_mask_ts = valid_mask_ts.expand_as(albedo_pred_ts)
		for met_func in self.metric_funcs:
			_metric_name = met_func.__name__
			_metric = met_func(albedo_pred_ts, albedo_raw_ts, valid_mask_ts).item()
			sample_metric.append(_metric.__str__())
			metric_tracker.update(_metric_name, _metric)

		# Save as 16-bit uint png
		if save_to_dir is not None:
			img_name = batch["rgb_relative_path"][0].replace("/", "_")
			png_save_path = os.path.join(save_to_dir, f"{img_name}.png")
			# albedo_to_save = (pipe_out.albedo_np * 65535.0).astype(np.uint16)
			albedo_to_save = (pipe_out.albedo_np * 127.5 + 127.5).clip(0, 255).astype(np.uint8)
			Image.fromarray(albedo_to_save).save(png_save_path, mode="I;16")

	return metric_tracker.result()

```## visualize


```

^03be56

def visualize(self):
	for val_loader in self.vis_loaders:
		vis_dataset_name = val_loader.dataset.disp_name
		vis_out_dir = os.path.join(
			self.out_dir_vis, self._get_backup_ckpt_name(), vis_dataset_name
		)
		os.makedirs(vis_out_dir, exist_ok=True)
		_ = self.validate_single_dataset(
			data_loader=val_loader,
			metric_tracker=self.val_metrics,
			save_to_dir=vis_out_dir,
		)

```



## training.py

```

from diffusers import UNet2DConditionModel, AutoencoderKL, DDIMScheduler
from transformers import CLIPTextModel, CLIPTokenizer

import argparse
import logging
import os
import shutil
from datetime import datetime, timedelta
from typing import List

import torch
from omegaconf import OmegaConf
from torch.utils.data import ConcatDataset, DataLoader
from tqdm import tqdm

from marigold.albedo_pipeline import MaterialPipeline
from src.trainer.marigold_trainer import MarigoldTrainer
from src.util.dataset import BeautyAlbedoDataset

# from src.dataset import BaseDepthDataset, DatasetMode, get_dataset
# from src.dataset.mixed_sampler import MixedBatchSampler
from src.trainer import get_trainer_cls
from src.util.config_util import (
    find_value_in_omegaconf,
    recursive_load_config,
)
from src.util.depth_transform import (
    DepthNormalizerBase,
    get_depth_normalizer,
)
from src.util.logging_util import (
    config_logging,
    init_wandb,
    load_wandb_job_id,
    log_slurm_job_id,
    save_wandb_job_id,
    tb_logger,
)
from src.util.slurm_util import get_local_scratch_dir, is_on_slurm



if "__main__" == __name__:
    t_start = datetime.now()
    print(f"start at {t_start}")

    # -------------------- Arguments --------------------
    parser = argparse.ArgumentParser(description="Train your cute model!")
    parser.add_argument(
        "--config",
        type=str,
        default="config/train.yaml",
        help="Path to config file.",
    )
    parser.add_argument(
        "--resume_run",
        action="store",
        default=None,
        help="Path of checkpoint to be resumed. If given, will ignore --config, and checkpoint in the config",
    )
    parser.add_argument(
        "--output_dir", type=str, default=None, help="directory to save checkpoints"
    )
    parser.add_argument("--no_cuda", action="store_true", help="Do not use cuda.")
    parser.add_argument(
        "--exit_after",
        type=int,
        default=-1,
        help="Save checkpoint and exit after X minutes.",
    )
    parser.add_argument("--no_wandb", action="store_true", help="run without wandb")
    parser.add_argument(
        "--do_not_copy_data",
        action="store_true",
        help="On Slurm cluster, do not copy data to local scratch",
    )
    parser.add_argument(
        "--base_data_dir", type=str, default=None, help="directory of training data"
    )
    parser.add_argument(
        "--base_ckpt_dir",
        type=str,
        default= r"/home/j/projects/library/",
        help="directory of pretrained checkpoint",
    )
    parser.add_argument(
        "--add_datetime_prefix",
        action="store_true",
        help="Add datetime to the output folder name",
    )

    args = parser.parse_args()
    resume_run = args.resume_run
    output_dir = args.output_dir

    base_ckpt_dir = (
        args.base_ckpt_dir
        if args.base_ckpt_dir is not None
        else os.environ["BASE_CKPT_DIR"]
    )

    # -------------------- Initialization --------------------
    # Resume previous run
    if resume_run is not None:
        print(f"Resume run: {resume_run}")
        out_dir_run = os.path.dirname(os.path.dirname(resume_run))
        job_name = os.path.basename(out_dir_run)
        # Resume config file
        cfg = OmegaConf.load(os.path.join(out_dir_run, "config.yaml"))
    else:
        # Run from start
        cfg = recursive_load_config(args.config)
        # Full job name
        pure_job_name = os.path.basename(args.config).split(".")[0]
        # Add time prefix
        if args.add_datetime_prefix:
            job_name = f"{t_start.strftime('%y_%m_%d-%H_%M_%S')}-{pure_job_name}"
        else:
            job_name = pure_job_name

        # Output dir
        if output_dir is not None:
            out_dir_run = os.path.join(output_dir, job_name)
        else:
            out_dir_run = os.path.join("./output", job_name)
        os.makedirs(out_dir_run, exist_ok=False)

    cfg_data = cfg.dataset

    # Other directories
    out_dir_ckpt = os.path.join(out_dir_run, "checkpoint")
    if not os.path.exists(out_dir_ckpt):
        os.makedirs(out_dir_ckpt)
    out_dir_tb = os.path.join(out_dir_run, "tensorboard")
    if not os.path.exists(out_dir_tb):
        os.makedirs(out_dir_tb)
    out_dir_eval = os.path.join(out_dir_run, "evaluation")
    if not os.path.exists(out_dir_eval):
        os.makedirs(out_dir_eval)
    out_dir_vis = os.path.join(out_dir_run, "visualization")
    if not os.path.exists(out_dir_vis):
        os.makedirs(out_dir_vis)

    # -------------------- Logging settings --------------------
    config_logging(cfg.logging, out_dir=out_dir_run)
    logging.debug(f"config: {cfg}")

    # Initialize wandb
    if not args.no_wandb:
        if resume_run is not None:
            wandb_id = load_wandb_job_id(out_dir_run)
            wandb_cfg_dic = {
                "id": wandb_id,
                "resume": "must",
                **cfg.wandb,
            }
        else:
            wandb_cfg_dic = {
                "config": dict(cfg),
                "name": job_name,
                "mode": "online",
                **cfg.wandb,
            }
        wandb_cfg_dic.update({"dir": out_dir_run})
        wandb_run = init_wandb(enable=False)
        save_wandb_job_id(wandb_run, out_dir_run)
    else:
        init_wandb(enable=False)

    # Tensorboard (should be initialized after wandb)
    tb_logger.set_dir(out_dir_tb)

    log_slurm_job_id(step=0)

```
```
    # -------------------- Device --------------------
    cuda_avail = torch.cuda.is_available() and not args.no_cuda
    device = torch.device("cuda" if cuda_avail else "cpu")
    logging.info(f"device = {device}")
```

^da8c7d

```

    # -------------------- Snapshot of code and config --------------------
    if resume_run is None:
        _output_path = os.path.join(out_dir_run, "config.yaml")
        with open(_output_path, "w+") as f:
            OmegaConf.save(config=cfg, f=f)
        logging.info(f"Config saved to {_output_path}")
        # Copy and tar code on the first run
        _temp_code_dir = os.path.join(out_dir_run, "code_tar")
        _code_snapshot_path = os.path.join(out_dir_run, "code_snapshot.tar")
        os.system(
            f"rsync --relative -arhvz --quiet --filter=':- .gitignore' --exclude '.git' . '{_temp_code_dir}'"
        )
        os.system(f"tar -cf {_code_snapshot_path} {_temp_code_dir}")
        os.system(f"rm -rf {_temp_code_dir}")
        logging.info(f"Code snapshot saved to: {_code_snapshot_path}")



```
```
    # --------------- Gradient accumulation / eff batch size -----------------
    eff_bs = cfg.dataloader.effective_batch_size
    accumulation_steps = eff_bs / cfg.dataloader.max_train_batch_size
    assert int(accumulation_steps) == accumulation_steps
    accumulation_steps = int(accumulation_steps)

    logging.info(
        f"Effective batch size: {eff_bs}, accumulation steps: {accumulation_steps}"
    )
```

^b70a62


```
    # -------------------- Data --------------------
    loader_seed = cfg.dataloader.seed
    if loader_seed is None:
        loader_generator = None
    else:
        loader_generator = torch.Generator().manual_seed(loader_seed)

    # Training dataset
    depth_transform: DepthNormalizerBase = get_depth_normalizer(
        cfg_normalizer=cfg.depth_normalization
    )

```
```
    # --------- load dataset ---------

    dataset_dir = r'../../Megascan_Processing/train_dataset/'
    filename_ls_path = r'../../Megascan_Processing/train_dataset/filename_list'
    train_dataset = BeautyAlbedoDataset(dataset_dir=dataset_dir, filename_ls_path=filename_ls_path)
    train_dataloader = DataLoader(
        train_dataset, batch_size = cfg.dataloader.max_train_batch_size,
        shuffle=True, num_workers=cfg.dataloader.num_workers, generator=loader_generator)
    
    val_dataloader = DataLoader(
        train_dataset, batch_size= 1, shuffle=False, num_workers=cfg.dataloader.num_workers
    )
    # batch_size=cfg.dataloader.effective_batch_size, 
```

^d2fd95


```

    # -------------------- Model --------------------


    unet         = UNet2DConditionModel.from_pretrained("stabilityai/stable-diffusion-2-1-base", subfolder="unet")
    vae_albedo   = AutoencoderKL.from_pretrained("stabilityai/stable-diffusion-2-1-base", subfolder="vae")
    vae_beauty   = AutoencoderKL.from_pretrained("stabilityai/stable-diffusion-2-1-base", subfolder="vae")
    scheduler    = DDIMScheduler.from_pretrained("stabilityai/stable-diffusion-2-1-base", subfolder="scheduler")
    text_encoder = CLIPTextModel.from_pretrained("laion/CLIP-ViT-H-14-laion2B-s32B-b79K")
    tokenizer    = CLIPTokenizer.from_pretrained("openai/clip-vit-large-patch14")

    model = MaterialPipeline(
        unet=unet,
        vae_albedo=vae_albedo,
        vae_beauty=vae_beauty,
        scheduler=scheduler,
        text_encoder=text_encoder,
        tokenizer=tokenizer,
    )
```

^438ba0

```


    # -------------------- Trainer --------------------
    # Exit time
    if args.exit_after > 0:
        t_end = t_start + timedelta(minutes=args.exit_after)
        logging.info(f"Will exit at {t_end}")
    else:
        t_end = None

    trainer_cls = get_trainer_cls(cfg.trainer.name)
    logging.debug(f"Trainer: {trainer_cls}")
    trainer = trainer_cls(
        cfg=cfg,
        model=model,
        train_dataloader=train_dataloader,
        device=device,
        base_ckpt_dir=base_ckpt_dir,
        out_dir_ckpt=out_dir_ckpt,
        out_dir_eval=out_dir_eval,
        out_dir_vis=out_dir_vis,
        accumulation_steps=accumulation_steps,
        val_dataloaders=[val_dataloader],
        vis_dataloaders=[val_dataloader],
    )




    # -----------------load Checkpoint if stop-------------------
    if resume_run is not None:
        trainer.load_checkpoint(
            resume_run, load_trainer_state=True, resume_lr_scheduler=True
        )

    # -------------------- Training & Evaluation Loop --------------------
    try:
        trainer.train(t_end=t_end)
    except Exception as e:
        logging.exception(e)
```