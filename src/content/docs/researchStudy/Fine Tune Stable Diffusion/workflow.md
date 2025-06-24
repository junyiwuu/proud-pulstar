---
title: Major Workflow
---


## Quick commands:

**into the env**
`conda activate pbrReplicate`

**Launch tensorboard**
`tensorboard --logdir=output/train/tensorboard`


## Structure
Marigold (modified)
|--config
	|-- yaml (set variables here)
|--marigold
	|--albedo_pipeline.py
|--output (including tensorboard, metrics, evaluation)
|--src
	|--trainer
		|--marigold_trainer.py (training code)
|--training.py (training launcher)


