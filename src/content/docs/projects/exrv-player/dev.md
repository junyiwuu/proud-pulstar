---
title: Dev
---



是的，你要做的这个东西，本质上就是「高性能 I/O + 解码 + GPU 显示 + 缓存管理」，确实会涉及到一些 low level 优化，但不需要一开始就很「地狱级」的底层。

下面我给你一个**整体路线图**，你可以按步骤往下做。

---

## 1. 技术栈建议

为了性能和生态，推荐：

- 语言：**C++** 或 **Rust**（C++ 生态更成熟，资料更多）
    
- EXR 读写：**OpenEXR**
    
- 界面：**Qt**（跨平台）或者 ImGui（工具类 UI）
    
- GPU 渲染：**OpenGL / Vulkan / DirectX / Metal** 任一
    
- 颜色管理：**OpenColorIO**（如果你想做接近 Nuke 的色彩流程）
    
- 导出 mov：用 **FFmpeg（libavcodec）**
    

如果你问「要最高性能」，默认答案是：**C++ + OpenEXR + FFmpeg + OpenGL/DirectX**。

---

## 2. EXR 加载核心思路

目标是：一堆 EXR 序列，能像视频一样**流畅拖动 / 播放**。

### 2.1 文件读取策略

1. 使用 **内存映射（mmap / CreateFileMapping）**
    
    - 对于大 EXR 序列，可以减少内核态/用户态切换开销。
        
2. **多线程解码**：
    
    - 一个线程负责 I/O（读取 / mmap）
        
    - 若干 worker 线程负责用 OpenEXR 解码成内存图像（float 或 half）
        
3. **按需读取频道**：
    
    - 如果只看 RGB，就不要读 All channels（像 depth、AOV 等），能省很多解码时间和带宽。
        

### 2.2 图像内部格式

- 内部使用：
    
    - `half float`（16-bit float）就够了，减少内存 & 带宽
        
- 渲染时：
    
    - 直接上传为 GPU 的 **16-bit float texture**（GL_RGBA16F / R16G16B16A16_FLOAT 等）
        

---

## 3. 播放缓存机制（模拟 Nuke 的 cache）

你要实现的核心类似：

1. **LRU 帧缓存（内存缓存）**
    
    - 用一个 `std::unordered_map<frame, FrameData>` + LRU 链表
        
    - 帧结构中包含：
        
        - CPU 端已解码图像（float/half buffer）
            
        - 或 GPU 纹理句柄（如果你想一直存 GPU 端）
            
    - 设置最大缓存内存，比如 4GB 或用户可配置
        
2. **预取（prefetch）策略**
    
    - 当前播放到 frame N：
        
        - 后台线程提前加载 `N+1 ~ N+k`（k 比如 10～50）
            
    - 拖动时：
        
        - 先显示一个粗糙 preview（比如上一帧 or 最近的帧）
            
        - 后台再调整预取方向
            
3. **双缓冲 / 环形缓冲**
    
    - 一个缓冲给当前显示，另一个缓冲给下一个 frame 解码
        
    - 解码完成后 swap 指针，避免频繁分配
        

---

## 4. GPU 显示管线

1. **把解码后的 EXR → GPU 纹理**
    
    - 创建 float16/float32 纹理
        
    - `glTexImage2D` / 对应的 Vulkan/DirectX 上传接口
        
2. **在 shader 中做：**
    
    - 线性空间 → 显示色域（sRGB / Rec.709 等）
        
    - 曝光、gamma、LUT（用 OpenColorIO 可以加载 LUT / 配置）
        
3. **渲染：**
    
    - 画一个全屏 quad，把纹理贴上去
        
    - 拖动 / 播放时只要更新纹理内容和 uniform 即可
        

---

## 5. 导出低分辨率 mov 的管线

目标：把 EXR 序列转成低像素 mov 预览。

整体流程：

1. **缩小 / 降采样**
    
    - 在 GPU 做最好：
        
        - 用一个缩放 shader（bilinear/bicubic）
            
        - 输出到一个小分辨率的 framebuffer（比如 1/4 或用户指定）
            
2. **从 GPU 读回 CPU**
    
    - 用 `glReadPixels` 或 Vulkan/DirectX 的 readback buffer
        
    - 得到 8-bit 或 10-bit 的 YUV/RGB 帧
        
3. **喂给 FFmpeg 编码器**
    
    - 如果用 libavcodec：
        
        - 设置编码器（一般 h264 / hevc）
            
        - 一帧帧送进编码器，拿到压缩后的 packet，写入文件
            
4. **性能优化点**
    
    - 批量处理（比如一次性导出多帧，减少频繁打开/关闭 encoder）
        
    - 用硬件编码（NVENC / AMF / VideoToolbox 等）进一步加速（可以后面再做）
        

---

## 6. 具体实现步骤建议

如果你现在要开工，可以按这个顺序：

### 阶段 1：最小可用版本（MVP）

1. C++ 工程搭起来（CMake + OpenEXR + Qt/ImGui + OpenGL）
    
2. 实现：
    
    - 打开单张 EXR
        
    - 用 OpenEXR 解码到 CPU 内存
        
    - 上传到 GPU 纹理
        
    - 在窗口中显示出来
        

### 阶段 2：支持 EXR 序列 + 简单播放

1. 识别路径中 `name.0001.exr ~ name.0100.exr`
    
2. 加一个简单的时间轴 & 播放控制
    
3. 单线程顺序读取 + 解码 + 显示（先不优化）
    

### 阶段 3：加入多线程与缓存

1. 实现帧缓存（LRU）
    
2. 后台预取线程：
    
    - 根据当前帧号预取周围帧
        
3. UI 层：
    
    - 拖动时间轴时，只请求当前帧，后台再慢慢填缓存
        
    - 没有缓存时，用旧帧顶一下，避免 UI 卡死
        

### 阶段 4：mov 导出

1. 集成 FFmpeg（只用 libavformat + libavcodec）
    
2. 写一个命令：
    
    - 选中一个帧范围 + 输出分辨率 + fps
        
3. 按照上面的 pipeline：
    
    - GPU 缩小 → 读回 → 送入 encoder → 生成 mov
        

---

## 7. Low level 优化点（后期再做）

如果基本功能跑起来，你再考虑：

1. **SIMD 优化**（如果你自己做 tonemap / 颜色处理）
    
    - SSE/AVX/NEON 加速 per-pixel 运算
        
2. **避免频繁分配**
    
    - 预分配大块内存，重复利用 buffer
        
3. **线程绑定 & NUMA**
    
    - 把 I/O / 解码线程 pin 到某些核上（一般是后期调优）
        
4. **异步 I/O**
    
    - Windows: Overlapped I/O
        
    - Linux: `io_uring` / `aio`
        

---

简化总结：

- 是的，这确实属于 low level 方向，但第一步只要掌握：
    
    - OpenEXR 解码
        
    - 多线程加载 + LRU 缓存
        
    - GPU 纹理显示
        
    - FFmpeg 导出 mov
        
- 先做一个能看单张 EXR 的 viewer，再演进到序列播放，再加缓存，再加 mov 导出和优化。
    

如果你告诉我你打算用 C++ 还是 Rust，我可以给你更具体的库组合和项目结构示例。