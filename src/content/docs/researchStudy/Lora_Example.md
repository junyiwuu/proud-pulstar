---
title: lora example
---


```
pip install git+https://github.com/huggingface/diffusers

pip install accelerate wand

pip install -r https://raw.githubusercontent.com/huggingface/diffusers/main/examples/text_to_image/requirements.txt

accelerate config default

# accelerate configuration saved at $HOME/.cache/huggingface/accelerate/default_config.yaml
```

The first command is to install the `diffusers` library from GitHub, which will be the development version. This is required because you will use the training script from GitHub, hence you should use the matching version.


The last command above confirmed you have installed the `accelerate` library and detect what GPU you have on your computer. You have downloaded and installed many libraries. You can try to run the Python statements below to confirm that all are installed correctly and that you have no import error:

```
import wandb

import torch

from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler, AutoPipelineForText2Image

from huggingface_hub import model_info
```


**Donwload the lora script**
`wget -q https://raw.githubusercontent.com/huggingface/diffusers/main/examples/text_to_image/train_text_to_image_lora.py`



```bash
#!/bin/bash

export HF_HOME="/mnt/D/2025/research/lora_example"

export MODEL_NAME="runwayml/stable-diffusion-v1-5"
export OUTPUT_DIR="./finetune_lora/pokemon"
export HUB_MODEL_ID="pokemon-lora"
export DATASET_NAME="svjack/pokemon-blip-captions-en-zh"
 
mkdir -p $OUTPUT_DIR
 
accelerate launch --mixed_precision="bf16"  train_text_to_image_lora.py \
  --pretrained_model_name_or_path=$MODEL_NAME \
  --dataset_name=$DATASET_NAME \
  --dataloader_num_workers=8 \
  --resolution=256 \
  --center_crop \
  --random_flip \
  --train_batch_size=1 \
  --gradient_accumulation_steps=2 \
  --max_train_steps=500 \
  --learning_rate=1e-04 \
  --max_grad_norm=1 \
  --lr_scheduler="cosine" \
  --lr_warmup_steps=0 \
  --output_dir=${OUTPUT_DIR} \
  --checkpointing_steps=500 \
  --caption_column="en_text" \
  --validation_prompt="A pokemon with blue eyes." \
  --seed=1337
```

* `accelerate launch --mixed_precision="bf16"` : reduces VRAM usage by using 16-bit precision instead of 32-bit
* 
* 