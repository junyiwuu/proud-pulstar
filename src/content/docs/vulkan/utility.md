---
title: vulkan utility concepts
---

## Tiling
**`VK_IMAGE_TILING_LINEAR`**  
- // 线性排布，像 C 数组一样一行一行排好
- 图像数据直接按一行行排，CPU 端容易直接访问（比如 `staging buffer` 临时传输）。
- 适合你想把图片数据直接 map 到 CPU 地址读写的场景。


    
**`VK_IMAGE_TILING_OPTIMAL`** 
* // 优化排布，按驱动/硬件效率排，顺序可能很奇怪但 GPU 用起来最快
- 图像按 GPU 最优化方式排布，CPU 很难直接 map 访问（不能保证顺序）。
- 真正 GPU 渲染/采样用的图片、纹理、附件，**基本全是 optimal**。




## Format
- **指“像素格式”，就是一张图像/纹理/缓冲的“每个像素是什么结构”**
- 举例（常见 VkFormat）：
    - `VK_FORMAT_R8G8B8A8_SRGB` → 每个像素4字节，分别是SRGB空间的R/G/B/A
    - `VK_FORMAT_D32_SFLOAT`   → 32位 float 深度
    - `VK_FORMAT_R16G16_SFLOAT` → 16位float的RG
    - 还有无数的，比如 10bit、16bit、float、int、uint 等
        
- **你用什么 format，决定了你能不能用这个图像做纹理/深度缓冲/attachment，以及采样和存储的方式。**



## usage（在这里是 VkFormatFeatureFlags）

- **指“你想让这个 format 支持什么用法”**  
    （比如要能采样，要能作为渲染目标 attachment，要能做存储等）
    
- 在 `findSupportedFormat` 里你要查的是 format 的特性（feature），比如：
    - `VK_FORMAT_FEATURE_DEPTH_STENCIL_ATTACHMENT_BIT` // 支持做深度模板 attachment
    - `VK_FORMAT_FEATURE_SAMPLED_IMAGE_BIT`         // 支持被采样（纹理用）  
    - `VK_FORMAT_FEATURE_COLOR_ATTACHMENT_BIT`        // 支持做颜色 attachment
        
- **这些 feature flags 决定了你选的格式能否完成你的需求**，比如做深度图像、颜色目标、还是采样纹理。
- 



## **`VkFormatProperties`** struct 

- `linearTilingFeatures`: Use cases that are supported with linear tiling    
- `optimalTilingFeatures`: Use cases that are supported with optimal tiling
- `bufferFeatures`: Use cases that are supported for buffers



----

## Vulkan pipeline stage

| 阶段常量                                          | 含义                    | 常见用途          |
| :-------------------------------------------- | :-------------------- | :------------ |
| VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT             | 管线最前面（啥都没发生）          | 初始屏障、image准备  |
| VK_PIPELINE_STAGE_DRAW_INDIRECT_BIT           | 间接绘制命令                | 间接绘制          |
| VK_PIPELINE_STAGE_VERTEX_INPUT_BIT            | 顶点输入阶段                | 顶点buffer同步    |
| VK_PIPELINE_STAGE_VERTEX_SHADER_BIT           | 顶点着色器                 | uniform同步     |
| VK_PIPELINE_STAGE_FRAGMENT_SHADER_BIT         | 片元（像素）着色器             | 采样/贴图同步       |
| VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT    | 片元早期测试（深度/模板测试）       | 深度/模板buffer同步 |
| VK_PIPELINE_STAGE_LATE_FRAGMENT_TESTS_BIT     | 片元晚期测试                |               |
| VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT | 颜色附件写入（framebuffer输出） | 常见屏障点         |
| VK_PIPELINE_STAGE_TRANSFER_BIT                | 内存数据传输                | 拷贝、staging    |
| VK_PIPELINE_STAGE_COMPUTE_SHADER_BIT          | 计算着色器（GPU通用计算）        |               |
| VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT          | 管线最后面（啥都做完了）          | 结束屏障、present前 |