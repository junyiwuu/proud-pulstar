---
title: Super Resolution methods
---
## Ready to use libraries
### ISR
`pip install ISR`
seems like dependecy issue, lack of maintainence

### PyTorch Image Models
`pip install timm`



### **Real-ESRGAN**:
[link](https://github.com/xinntao/Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN)
    - Has pre-trained models
    - Python package available: `pip install realesrgan`
- **BasicSR**: [https://github.com/XPixelGroup/BasicSR](https://github.com/XPixelGroup/BasicSR)
    - Comprehensive toolbox with multiple models (ESRGAN, EDSR, etc.)
    - `pip install basicsr`


## OpenCV : DnnSuperRes
use cv library
```python

import cv2
from cv2 import dnn_superres

# Create the SR object
sr = dnn_superres.DnnSuperResImpl_create()

# Download model file from: https://github.com/opencv/opencv_contrib/tree/master/modules/dnn_superres/models
path = "EDSR_x4.pb"  # You need to download this
sr.readModel(path)
sr.setModel("edsr", 4)

# Read image
image = cv2.imread("input.jpg")

# Upscale
result = sr.upsample(image)

# Save
cv2.imwrite("output.jpg", result)
```



`pip install --upgrade opencv-python opencv-contrib-python`


import cv2
from cv2.dnn_superres import DnnSuperResImpl


---
## 扩展阅读
是的，**Real-ESRGAN** 在处理严重像素化（pixelation）图像时可能会遇到一些问题，主要原因如下：

### **1. 训练数据的限制**

- **Real-ESRGAN** 主要是用来处理**低质量但仍保留部分细节**的图像，例如压缩噪声（JPEG artifacts）或轻微模糊的图片。
- 但如果原图已经**极度像素化**（比如分辨率极低或最近邻插值缩小后放大），那么它无法有效地恢复细节，因为神经网络没有从数据集中学到如何恢复这种极端情况。

### **2. ESRGAN 的工作原理**

- 它通过**学习训练数据的高低分辨率映射关系**来生成超分辨率图像。
- 如果输入的低分辨率图像**缺乏基本的细节（如大块颜色区域，没有纹理信息）**，模型无法合理推测细节，只能生成模糊的或带有伪影（artifacts）的结果。

### **3. 过度平滑或伪影**

- 由于 ESRGAN 采用**对抗生成网络（GAN）**，它更倾向于生成**看起来自然但不一定准确**的图像。
- 对于像素化严重的图片，它可能会**强行填充一些伪造的细节**，导致结果看起来**不真实或模糊**。

---

## **如何改进 Real-ESRGAN 在像素化图像上的表现？**

### **1. 先进行去像素化（Depixelation）**

- 你可以先尝试使用 **神经网络去像素化模型**，然后再用 **Real-ESRGAN** 进行超分辨率：
    - **GFPGAN**（用于人脸修复）
    - **CodeFormer**（更鲁棒的人脸修复）
    - **Pixelation GAN**（特化于去除像素化）
    - **Anime4K**（适用于动漫图像）

**示例（Real-ESRGAN + CodeFormer）：**

```bash
python inference_codeformer.py --input_path input.png --output_path output_codeformer.png --w 0.7
python inference_realesrgan.py -i output_codeformer.png -o final_output.png -n RealESRGAN_x4plus
```

---

### **2. 用 **diffusion models** 生成细节**

- **Stable Diffusion** + **ControlNet**（Canny / Line Art）可以帮助**补全丢失的细节**，然后再进行超分辨率。

**流程：**

1. **用 Stable Diffusion 进行图像重绘（inpainting）**
2. **再用 Real-ESRGAN 进行超分辨率**

---

### **3. 使用更适合像素化图像的超分辨率模型**

- **Waifu2x**（适用于动漫和像素化图片）
- **Pixelated Face Restoration**（特化于像素化面部修复）

---

### **总结**

如果 Real-ESRGAN 处理像素化图像效果不佳，你可以：

1. **先去像素化**（使用 GFPGAN、CodeFormer、Diffusion Models）。
2. **尝试更适合的超分辨率模型**（Waifu2x、Pixelated Face Restoration）。
3. **配合 Inpainting / ControlNet** 恢复细节后再超分辨率。

如果你的输入图像是**严重像素化**，建议先用 **CodeFormer** 或 **Diffusion-based 方法**补充细节，再交给 Real-ESRGAN 进行最终放大。