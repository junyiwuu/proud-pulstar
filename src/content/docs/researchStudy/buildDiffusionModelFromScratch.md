---
title: Build Diffusion Models from Scratch
---

* The corruption process (blending noise to data)
* what a unet is , and how to implement an extremely minimal one from scratch
* diffusion model training
* sampling theory

Then compare our version with the diffusers DDPM implementation , exploring:
* Improvements over our mini unet
* DDPM noise schedule
* differences in training objective
* timestep conditioning
* sampling approaches


| Syntax    | Desddcriptiond |     |
| :-------- | :------------- | --- |
| Header    | Title<br>      |     |
| Paragraph | Text           |     |
|           |                |     |
|           |                |     |
|           |                |     |
|           |                |     |

## Data preperation
using MNIST
```python
dataset = torchvision.datasets.MNIST(
    root = "mnist/", train=True, download = True, transform = torchvision.transforms.ToTensor()
)


train_dataloader = DataLoader(dataset, batch_size=8, shuffle=True)
```

`transform = torchvision.transforms.ToTensor` convert a PIL image or ndarray to tensor and scale the value accordingly  [ToTensor doc](https://pytorch.org/vision/main/generated/torchvision.transforms.ToTensor.html)

## Corruption (adding noise)
use [torch.rand_like](https://pytorch.org/docs/stable/generated/torch.rand_like.html)



