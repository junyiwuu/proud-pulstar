---
title: Image processing
---

upsampling equation
downsampling equation

> [!info]


- **Up-sampling**
> Conv2D
> `size = [(size + 2 * padding - kernel) / stride] + 1`

- **Down-sampling**
> ConvTranspose2D
> `size = (size - 1) * stride  - 2 * padding + kernel + output_padding`
> (output_padding \< stride)
> Example: input(2x2), kernel(3x3), stride(2)
	- `(2-1)*2 -2*1 + 3 + 1 = 4`  -> so after convTranspose, output `4x4`


## Convolution layer
How does image do convolution?


## Color space



## Gamma
