---
title: Deep learning
---



## Dropout
This is a common regularization method, to prevent the model overfitting.
**How:** in every forward pass training, randomly zero out some outputs.

> Example:
 ```python
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(100, 50)
        self.dropout = nn.Dropout(p=0.5)  # 丢弃率 0.5
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)   # 在训练时随机丢弃一半神经元
        x = self.fc2(x)
        return x
```






---

## Embeddings
### Positional Encoding

### One hot
Very basic embedding like representation, for example if you have 10k words, then the vector will be 10k long, and each word represent one unique vector. Huge dimension, sparse and no trainable



## GAN
What is GAN:


## RNN


---



## CNN
What is CNN, explain it:
**Why?**
CNN can capture the local spatial features,  reducing parameters (if feed in pixels one by one), more generalize(if pixel shift one pixel, the normal one might not able to recognize it )



---

## VAE
What is VAE:
VAE(variation autoencoder) is a generative model, it can generate the image that similar to the feed in data.

### Latent space
**Explain**




## Efficient Net




## ResNet
Residual Block
```
Input → Conv → Conv → + Input → Output
         (F(x))      (x + F(x))
```



---



## Activation function

**What does zero-centered mean**
It means the output can be both positive and negative, roughly centered around .
If the activation function is not zero-centered, it can cause gradient updates to always go in one direction, which slows learning. (This is why sigmoid is bad, always output 0-1, always positive, gradient suck)
Zero-centered activation help with faster and smoother gradient updates, because they avoid biasing all gradients in the same direction.
### Sigmoid
![pic](https://docs.pytorch.org/docs/stable/_images/Sigmoid.png)
S shape, \[0, 1]

cons: center is not zero, gradient disappear,



### Tanh
![pic](https://docs.pytorch.org/docs/stable/_images/Tanh.png)
zero center
### ReLU
![pic](https://docs.pytorch.org/docs/stable/_images/ReLU.png)
Most popular, just max(0, x), simple and fast

cons: when x<0, the gradient is 0, the neurons not activate anymore

### LeakyReLU
![pic](https://docs.pytorch.org/docs/stable/_images/LeakyReLU.png)

When x < 0 , still keep some gradient

cons: need to manually adjust slope value

### GELU
![pic](https://docs.pytorch.org/docs/stable/_images/GELU.png)

Transformer's default.


### Swish / SiLU
![pic](https://docs.pytorch.org/docs/stable/_images/SiLU.png)Swish and GELU are smooth activation that softly suppress negative values instead of killing them.


## Metric
**PSNR**
Calculate MSE on pixel level

**SSIM** **(MS-SSIM)**
*Multi-scale structural similarity index measure*
Measuring similarities in luminance, contrast and structure. (Structural similarities), better correlating with human visual perception than simple pixel-level comparison

**VIF**
*Visual Information Fidelity*
How much visual information from the original image is preserved in the distorted image


**LPIPS**
*Learned Perceptual Image Patch Similarity*
 Use pre-trained deep network (like VGG, AlexNet)
 Pass both images through a pre-trained CNN, extract features from multiple layers, compute distances between feature representation, weight and combine these distances










