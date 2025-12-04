---
title:
---
## Load MNIST dataset



```
transform = transforms.Compose(
    [transforms.ToTensor(),
     transforms.Resize((16, 16)),
     transforms.Normalize((0.5, ), (0.5,)),
     ])


trainset = torchvision.datasets.MNIST(
    root='./data', train=True, download=True, transform=transform
)
dataloader = torch.utils.data.DataLoader(
    trainset, batch_size=128, shuffle=True, num_workers=0,
)

valset = torchvision.datasets.MNIST(
    root='./data', train=False, download=True, transform=transform
)
```

- Normalize (mean, std), if only one channel, then fill in one number. For color image: `transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))`
- 



## Residual convolutional block

