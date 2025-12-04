---
title: notes
---





## Stable Diffusion 相关的 "basic concepts"：

**Machine Learning 方面：**

- ✅ Diffusion models 原理（forward/reverse process）
- ✅ UNet 架构
- ✅ VAE（Variational Autoencoder）
- ✅ CLIP text encoder
- ✅ Attention mechanisms
- ✅ Latent space vs pixel space
- ✅ Noise scheduling
- ✅ Classifier-free guidance

**Computer Graphics 方面可能问：**

- ✅ 图像处理基础（卷积、滤波）
- ✅ 颜色空间
- ✅ 采样和抗锯齿
- ✅ 渲染基础概念
### ✅ 与图形学相关的现代 ML（重点）：

- **Diffusion models** - 既然你做了 SD 的 task
- **Neural rendering** - NeRF, 3D Gaussian Splatting
- **GANs** - 图像生成的基础
- **VAE** - latent representations
- **Transformers/Attention** - 用于图形任务
- **CNNs** - 图像处理的基础架构
- **Loss functions** - perceptual loss, adversarial loss 等

### 可能会问的基础 ML 概念（作为背景）：

- Backpropagation, gradient descent
- Overfitting/regularization
- Batch normalization, dropout
- 常见的优化器（Adam, SGD）






## Computer Graphics 的范围：

**传统上 CG 包括三大块：**

### 1️⃣ **Rendering（渲染）**

- Ray tracing, rasterization
- Lighting, shading
- Volume rendering

### 2️⃣ **Geometry（几何）**

- Mesh processing
- 3D transformations
- Spatial data structures

### 3️⃣ **Image Processing（图像处理）** ✅

- Filtering (blur, sharpen, edge detection)
- Color spaces and transformations
- Sampling and reconstruction
- Image pyramids
- Compositing

## 对于你的岗位特别相关：

既然你做了 **Stable Diffusion** 的 task，image processing 概念**非常可能被问到**：

### 可能的问题：

- **Convolution** - 卷积的原理和应用
- **Filtering** - Gaussian blur, bilateral filter
- **Sampling** - upsampling, downsampling, anti-aliasing
- **Color spaces** - RGB, HSV, LAB
- **Frequency domain** - Fourier transform basics
- **Image quality metrics** - PSNR, SSIM
- **Compositing** - alpha blending

### 与 Stable Diffusion 相关的：

- VAE 如何 encode/decode 图像
- Latent space 的分辨率和采样
- Noise 的添加和去除
- 图像的 upscaling/downscaling

## 结论：

**Image processing 不仅包含在 CG concepts 里，而且对你的岗位很重要！**

建议重点准备：

1. 🔥 基础图像处理操作
2. 🔥 这些操作在 Stable Diffusion 中的应用
3. 🔥 如何用卷积神经网络实现这些操作

这块内容和你的 task 结合得很紧密。