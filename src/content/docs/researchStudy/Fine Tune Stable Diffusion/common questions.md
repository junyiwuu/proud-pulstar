---
title: Common Questions
---
## How to check specific things in a model
Question: I want to change the unet input layer, but how can I know what to write? 

A: 
```python
# import
from diffusers import UNet2DConditionModel

# get the part you want to check
unet = UNet2DConditionModel.from_pretrained("stabilityai/stable-diffusion-2-1-base", subfolder="unet")

unet.config
```

**Check configuration:** 
print `unet.config`

```
FrozenDict([('sample_size', 64), 
('in_channels', 4), 
('out_channels', 4), 
('center_input_sample', False), 
('flip_sin_to_cos', True), 
('freq_shift', 0), 
('down_block_types', ['CrossAttnDownBlock2D', 'CrossAttnDownBlock2D', 'CrossAttnDownBlock2D', 'DownBlock2D']), 
..., 
('_name_or_path', 'stabilityai/stable-diffusion-2-1-base')])
```
(Delete many, just an example for reference)

**Check unet architecture:**
`print unet`

```
UNet2DConditionModel(
  (conv_in): Conv2d(4, 320, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
  (time_proj): Timesteps()
  (time_embedding): TimestepEmbedding(
    (linear_1): Linear(in_features=320, out_features=1280, bias=True)
    (act): SiLU()
    
    ......
    
  (conv_out): Conv2d(320, 4, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
)
```
Here you can see all details. For example you can find `conv_in`
> almost every convolution layer has weight and bias! so you can write to `unet.conv_in.weight`




Here you can find everything that could be used. when write, for example: `self.model.unet.conv_in`
