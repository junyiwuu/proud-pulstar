---
title: Read -- Deep Image Prior
---


Deep convolutional networks <--> DIP
DIP: 
* the structure of a generator network is sufficient to capture a great deal of low-level image statistics $prior$ to any learning.
* a randomly initialized neural network can be used as a handcrafted prior
* can be used to invert deep neural representations to diagnose them



### Inpainting

a binary mask : $m\in\{0,1\}^{H\times W}$    
* $m_{i, j}=0$ means this is a missing pixel.
* $m_{i, j}=1$ means on position ${i, j}$ pixel is observed.


$\odot$: Hadamard product 
$E(x; x_0)$ : the pixel difference between visible pixels


Convolutional Sparse coding (CSC):
represent a signal (such as image or an audio waveform) as 
a sum of convolutions between
* a small set of learned filters (the "dictionary") and 
* corresponding sparse activation maps


- **Filters** $\{d_k\}$—the small weight matrices that define what patterns to look for, and
    
- **Activation maps** $\{z_k\}$—where and how strongly each filter occurs in the image.

- The reconstruction $\sum_k d_k * z_k$    adds up each filter’s contribution across the image.