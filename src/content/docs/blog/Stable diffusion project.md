---
title: stable diffusion project
---




Since the original authors did not release training code and their implementation is built on top of the Marigold project, I re-implemented the training and inference pipeline as follows:
- `src/trainer/marigold_trainer.py`: Training pipeline based on the Marigold project (which originally outputs depth).
- `albedo_pipeline.py`: Adapted from [paper author's code](https://github.com/snowflakewang/PBR_Boost_3DGen/blob/main/albedo_mesh_gen/MonoAlbedo/albedo_pipeline.py), modified to fit my dataset and training setup.
- `src/util/dataset.py`: Dataloader for my preprocessed Megascan dataset.
- `albedo_infer.py`: Inference script that put everything together.
- `train.yaml`



到底要干什么呢。
回顾一遍整个project结构

技能提升：
1. 熟悉这类python project的结构
2. 有快速弄清楚一个project逻辑的能力
3. 将weight传到huggingface
4. 做笔记，为的是清楚帮助自己快速的理清思路，这样以后重新启用的时候如何快速弄清
	1. 重新grab领域知识的能力
		1. 知识链条的复盘，找到对应的笔记
	2. 重新grab项目的能力
		1. 项目结构拆解，什么在哪里
		2. 制作/改动的逻辑


project_root/
├── Megascan_Processing
│   ├── HDRI
│   ├── src_assets
│   └── train_dataset
│       ├── Albedo
│       └── Beauty
│       └── filename_list
│    ├── batch_process.py
│    └── blender_script.py
├── MonoSD
│   ├── infer_images
│   └── Marigold
│       ├── ckpt
│       └── config
│       └── marigold
│           ├── albedo_infer.py
│           ├──albedo_pipeline.py
│           ├── output / train
│           └── src
│               └── trainer
│                  └── marigold_trainer.py
│               └── util
│                  ├── ...
│                  ├── dataset.py
│                  └── ...
│           └── training.py
└── README.md




project_root/
├── Megascan_Processing
│   ├── HDRI  (hdri for blender rendering)
│   ├── src_assets (input asset ready for blender render)
│   └── train_dataset 
│       ├── Albedo (output from blender, only albedo)
│       └── Beauty (output from blender, only beauty)
│       └── filename_list (pair up albedo and beauty)
│    ├── batch_process.py (batch process blender render)
│    └── blender_script.py (setup for blender rendering)
├── MonoSD (training and inference code)
│   ├── infer_images (inference output)
│   └── Marigold
│       ├── ckpt 
│       └── config (training config)
│       └── marigold 
│           ├── albedo_infer.py
│           ├──albedo_pipeline.py (connect )
│           ├── output / train  (output, including weights, tensorboard, visualization)
│           └── src (training code folder)
│               └── trainer
│                   └── marigold_trainer.py (main logic)
│               └── util
│                  ├── ...
│                  ├── dataset.py
│                  └── ...
│           └── training.py
└── README.md




先看outliner
从大了往小的说，想从大格局，做的事情以及立刻指向对应的代码




我这里是training -> 输出weight -> 一个pipeline读入用户数据并且run prediction -> inference （1,2,3,4 序号的说）

1. **training**: 







--- 
Notes:

**Output:**  
- 具体怎么输出在render pass function里面，注意当用了OCIO的时候colorspace可能对不上
- evaluation / validation可能花很长时间，所以可以减少evaluation的数据集，这个定义在training.py中，val作为单独的数据集，选哪些由filename_lst_val文件决定
- 开启multi_res_noise是(可能)必须的，因为没有开的话，就连overfit也不是稳定的，会出现有时候亮有时候暗。但是加了之后，就会大大减小这个问题
- 如果infer的图很糊，要注意再albedo_pipeline.py中的processing_res的大小是不是太低

