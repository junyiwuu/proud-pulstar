---
title: coursework main
---
Super resolution method: Real-ESRGAN

### ROUND 1
I am using PSNR and SSIM as quality metric, however these two metrics are rely on the pixel level, basically less noise will be consider better, and have higher score. However, Real-ESRGAN will treat more blurred image much less detail -> which causing (of course) less noise -> higher score in these two metrics






## Image metrics:

* PSNR： peak-signal-to-noise-ratio 衡量图像或视频信号在经过压缩传输或其他处理后，于原始信号相比的失真程度的指标
* SSIM: structural similarity
* MS-SSIM: 在不同尺度上计算结构相似性，更好的反应人眼对不同细节层次的敏感性
* LPIPS： learned perceptual image patch similarity: pre-trained neural network提取图像的深层特征，并计算这些特征之间的距离，较好反映人眼对高层次予以和细节的感知差异
* VIF: Visual Information Fidelity 量化在视觉传输中丢失的信息量来评价图像质量，能够捕捉到细微的视觉信息变化




PSNR 关注像素误差，MSSSIM 强调结构相似性，LPIPS 从深度特征角度捕捉感知差异，而 VIF 衡量信息保真度。




在图像质量评价领域，除了亮度、对比度和结构之外，还有许多其他特征也被纳入考量，具体可以分为以下几类：

1. **边缘和梯度特征**
    
    - 利用梯度算子（如Sobel、Canny等）检测图像中的边缘信息，反映图像细节和锐度。边缘强度和分布往往与感知清晰度密切相关。
2. **纹理特征**
    
    - 采用局部二值模式（LBP）、Gabor滤波器或者灰度共生矩阵（GLCM）等方法，捕捉图像中重复性或随机性的纹理信息，进而反映局部结构的复杂性。
3. **颜色特征**
    
    - 不仅考虑灰度信息，还可以考察色彩失真与保真度。例如，色差指标（如CIEDE2000）用于衡量颜色偏差，对色彩图像质量评价非常关键。
4. **空间频率和变换域特征**
    
    - 通过离散余弦变换（DCT）、小波变换等手段分析图像的频率分布，通常高频部分的衰减或失真与模糊、压缩失真有较大关联。
5. **自然图像统计（Natural Scene Statistics, NSS）**
    
    - 许多无参考图像质量评价模型利用自然图像在统计分布上的规律（例如梯度、局部亮度、对比度的统计特性），将偏离自然统计规律的程度作为失真指标。
6. **噪声与模糊指标**
    
    - 通过噪声估计和模糊检测方法，定量描述图像中的噪声水平和模糊程度，这对判断图像失真类型及其主观质量具有重要意义。
7. **感知重要性和注意力机制**
    
    - 一些方法还会引入人眼视觉关注（显著性）区域的权重，即认为图像中某些区域对整体质量感知更为关键，从而在评价时给予更高权重。