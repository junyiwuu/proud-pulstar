---
title: Prepare
---
## Install validation layer
1. Find what does this called in dnf:  `dnf search validation | grep vulkan`
2. Then use the found name: `sudo dnf install vulkan-validation-layers`




## Compile and run the project
1. `rm -rf build` remove build folder if needed
2.  `mkdir build`
3. `cd build`
4. `cmake ..`
5. `make`

or if want to run no-debug mode / release mode:
4. `cmake -DCMAKE_BUILD_TYPE=Release ..`
5. `make`



## Instance
Retrieve a list of supported extensions before creating an instance: `vkEnumerateInstanceExtensionProperties`


extensions included glfw-extensions

- glfwExtensionCount = GLFW 告诉你“我工作必须要用的扩展” 
- extensionCount = Vulkan 支持的全部扩展（你可以选择你需要 enable 的那几个）

1. 先用 `vkEnumerateInstanceExtensionProperties` 查询 Vulkan 支持哪些 extension。
2. 再用 `glfwGetRequiredInstanceExtensions` 拿到 GLFW 必须用的 extension。
3. 检查一下 Vulkan 支持的 extension 里，是否有 GLFW 需要的那些。
4. 把这俩合起来 enable。

---
## Extension
vulkan的extension就分两种
* instance
* device
所以比如`glfwGetRequiredInstanceExtensions`会写清楚是instance的


---
## message callback
```cpp
        static VKAPI_ATTR VkBool32 VKAPI_CALL debugCallback(  
            VkDebugUtilsMessageSeverityFlagBitsEXT messageSeverity,
            VkDebugUtilsMessageTypeFlagsEXT messageType,
            const VkDebugUtilsMessengerCallbackDataEXT* pCallbackData,
            void* pUserData  )
            {
                std::cerr<< "Validation layer: " << pCallbackData->pMessage << std::endl;  
                return VK_FALSE;
            }
```
如果你的回调函数返回 `VK_TRUE`，Vulkan 会直接让当前 API 调用**失败**，并返回 `VK_ERROR_VALIDATION_FAILED_EXT`。这种用法**只在 validation layer 测试自己代码时才会用到**，平时开发时不该这么做。

也就是说：
- 平时我们只想收到报错/警告，继续跑程序，所以回调函数应该永远返回 `VK_FALSE`。
- 如果你是 Khronos/LunarG 维护 validation layer 的开发者，想自己测试 layer 的异常分支，就可以通过返回 `VK_TRUE` 人为终止 Vulkan 调用，测试 layer 反应是否正确。这是他们测试 validation layer 逻辑时用的，不是给普通开发者用的。


---
## Device
The device object will be implicit destroyed when the VkInstance is desttroyed, so we dont need to do anything new in the cleanup function


### `VkPhysicalDeviceProperties`
- 代表“设备属性”
- 描述**这个物理设备的固有属性**，比如设备名称、厂商、设备ID、设备类型、最大纹理大小、API版本号、各种物理限制（比如能支持的最大 image dimension 等）。
- 就是“硬件是啥，天生的，改不了的特性”。

### `VkPhysicalDeviceFeatures`
- 代表“设备特性”
- 描述**设备支持哪些功能**，比如 geometry shader 支持不支持、tessellation shader 支持不支持、wide lines 支持不支持等。
- 就是“能不能用某个 feature”，比如你要用 geometry shader，就得检查这个 feature 是否是 VK_TRUE。

`VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU`: 标记设备类型的枚举值。vulkan会把physical device分成几种类型，可以通过`VkPhysicalDeviceProperties.deviceType`来获得--比如可以通过枚举值来判断是否是独立显卡


---

## Queue family
You can check what queue family that the device supported, and use it. You cannot customized it.

Device queues are implicitly cleaned up when the device is destroyed, so we don’t need to do anything in `cleanup`.


- **queue family**：是一个“队列组”，描述了这个组里的所有 queue 具备什么能力（比如能不能干 graphics）。    
- **device queue**（`VkQueue`）：是你从 queue family 里**分出来的具体某一条 queue**，用来提交命令的实际对象。



- **每个 queue family** 都有一组能力，比如：    
    - 能不能执行图形命令（graphics）——通过 `VK_QUEUE_GRAPHICS_BIT` 标志来判断。
    - 能不能执行计算命令（compute）——通过 `VK_QUEUE_COMPUTE_BIT`。
    - 能不能执行传输命令（transfer）——通过 `VK_QUEUE_TRANSFER_BIT`。must have `VK_QUEUE_GRAPHICS_BIT` flag.

某些 queue family 可能既能 graphics 又能 present，有些只能 graphics，不能 present，有些甚至两个都不能。
### Present Family
Queue family for present operation

- 具体来说，就是这个 family 里的队列**可以把渲染好的图片显示到窗口 surface 上**（比如通过 `vkQueuePresentKHR`）。
- 是否支持 present，要用 `vkGetPhysicalDeviceSurfaceSupportKHR` 查询：
`vkGetPhysicalDeviceSurfaceSupportKHR(device, queueFamilyIndex, surface, &presentSupport);`

如果 `presentSupport == VK_TRUE`，就说明这个 family 能 present 到指定 surface。



---

## Logical Device


一个 **physical device（物理设备）** 可以有**多个 logical device（逻辑设备）**。  
但**一个 logical device 只能属于一个 physical device**。

- 你可以针对同一个物理 GPU 创建多个 logical device，每个 logical device 可以有自己独立的队列、feature、扩展启用方式。
- 实际项目**很少这么做**，一般一个 physical device 只用一个 logical device 就够了。但 Vulkan API 并不禁止你创建多个。



**为什么要多个 logical device？**
- 理论上如果你有**不同的应用/线程、或不同的功能需求、需要隔离资源/权限**，可以为同一个 physical device 创建不同的 logical device。
- 但实际上会消耗更多驱动和硬件资源，也更复杂。


* **先找到queue family -> 给每条queue设定priority -> 创建logical device**


---

## Window Surface
To establish the connection between Vulkan and the window system to present results to the screen, we need to use the WSI(window system integration) extensions.

`VK_KHR_surface`  --> `VkSurfaceKHR`
The window surface needs to be created right after the instance creation, because it can actually influence the physical device selection.


Window surface is where Vulkan draw into your window

- You need to create a `VkSurfaceKHR` (the "window surface") so Vulkan knows:
    - “Here is the connection to this specific window.”
    - “I want to present my images here.”

The surface is a bridge:
- **Your code** (Vulkan) → **Surface** → **Window on screen**

Creation order: 
vulkan instance -> window surface -> physical Device -> logical device -> swapchain

Destroy order:
swapchain -> logical device -> window surface -> vulkan instance
(Don't need to explicitly "destroy" the physical device)



---
## Swapchain


Using a swapchain requires enabling the `VK_KHR_swapchain` extension first.


There are basically three kinds of properties we need to check:
- Basic surface capabilities (min/max number of images in swap chain, min/max width and height of images)
- Surface formats (pixel format, color space)
- Available presentation modes


1.  **capabilities:** 
	- 描述当前 surface（窗口）能支持的 swapchain 能力。 
	- 例如：
        - 支持的最小/最大 swapchain image 数量（最少几张，最多几张）  
	    - 支持的分辨率范围（minImageExtent/maxImageExtent）
        - 支持的 transform、合成方式等
    - swap extent -> `VkExtent2D` ： `.width` and `.height`
2. **formats**
	- 所有当前 device+surface 组合支持的像素格式和颜色空间。
	- 比如支持 `VK_FORMAT_B8G8R8A8_SRGB`，或者 `VK_FORMAT_R8G8B8A8_UNORM` 等。
	-  我的swapchian里的每一张image都要用这种格式存储。选定的format决定了swapchain渲染出来的图像数据是什么格式。
3. **presentModes**
	 - 所有支持的 present mode（呈现模式）。
	- 比如
	    - FIFO（垂直同步，必有）
	    - Mailbox（适合无撕裂高速渲染）
	    - Immediate（直接显示，不同步）



- Surface format (color depth)
- Presentation mode (conditions for "swapping" images to the screen)
- Swap extent (resolution of images in swap chain)


`VkSurfaceFormatKHR`
entry contains a `format` and a `colorSpace` member

The `format` member specifies the color channels and types. 
For example, 
* `VK_FORMAT_B8G8R8A8_SRGB` means that we store the B, G, R and alpha channels in that order with an 8 bit unsigned integer for a total of 32 bits per pixel. 
* `colorSpace` member indicates if the sRGB color space is supported or not using the `VK_COLOR_SPACE_SRGB_NONLINEAR_KHR` flag. 



### Present Mode

- `VK_PRESENT_MODE_IMMEDIATE_KHR`: Images submitted by your application are transferred to the screen right away, which may result in tearing.最低延迟，最快，但会tearing
    
- `VK_PRESENT_MODE_FIFO_KHR`: The swap chain is a queue where the display takes an image from the front of the queue when the display is refreshed and the program inserts rendered images at the back of the queue. If the queue is full then the program has to wait. This is most similar to vertical sync as found in modern games. The moment that the display is refreshed is known as "vertical blank".
	- 渲染好的图片先进队列，显示器每次刷新从队首取一张
	- 如果队列满了，必须等下一帧显示才放进去
	- 和传统 V-Sync 最像
	- 优点：不会撕裂 。 缺点：有时有延迟
    
- `VK_PRESENT_MODE_FIFO_RELAXED_KHR`: This mode only differs from the previous one if the application is late and the queue was empty at the last vertical blank. Instead of waiting for the next vertical blank, the image is transferred right away when it finally arrives. This may result in visible tearing.
	- 和 FIFO 差不多，但如果你渲染慢了，队列空了，刚渲完就立即显示 
	- 这样低帧率时可能也会撕裂
    
- `VK_PRESENT_MODE_MAILBOX_KHR`: This is another variation of the second mode. Instead of blocking the application when the queue is full, the images that are already queued are simply replaced with the newer ones. This mode can be used to render frames as fast as possible while still avoiding tearing, resulting in fewer latency issues than standard vertical sync. This is commonly known as "triple buffering", although the existence of three buffers alone does not necessarily mean that the framerate is unlocked.
	- 队列永远不会满，新图片会替换掉旧图片，只显示最新一张
	- 渲染快可以极限 FPS，不撕裂
	- 优点：高性能+不撕裂，几乎等于“解锁帧率+V-Sync” 。 缺点：有时 GPU 比较占用内存

- FIFO —— 兼容最好，任何驱动都支持（默认值）
- MAILBOX —— 高端游戏推荐，流畅不卡帧
- IMMEDIATE —— 适合你想追极限输入延迟，不怕撕裂

**Only the `VK_PRESENT_MODE_FIFO_KHR` mode is guaranteed to be available**


---
## Image View
例如一个swapchain里面有三张image -> 三缓冲。image只是内存里的“像素块”你需要用image view才能以某种格式和方式去用。
* Image view不是图片本身，定义了“怎么理解和采样这张image”
* 每张image都要有自己的imageView
* `swapChainImageViews` 是存 imageView 的 vector，要resize成`swapChainImages`相同大小
* for 循环里，每一张 image 都单独创建一个 imageView（通过 VkImageViewCreateInfo）。


---

## Graphic pipeline overview

* **_input assembler_** collects the raw vertex data from the buffers you specify and may also use an index buffer to repeat certain elements without having to duplicate the vertex data itself.

* **_vertex shader_** is run for every vertex and generally applies transformations to turn vertex positions from model space to screen space. It also passes per-vertex data down the pipeline.

*  **_tessellation shaders_** allow you to subdivide geometry based on certain rules to increase the mesh quality. This is often used to make surfaces like brick walls and staircases look less flat when they are nearby.

*  **_geometry shader_** is run on every primitive (triangle, line, point) and can discard it or output more primitives than came in. This is similar to the tessellation shader, but much more flexible. However, it is not used much in today’s applications because the performance is not that good on most graphics cards except for Intel’s integrated GPUs.

* **_rasterization_** stage discretizes the primitives into _fragments_. These are the pixel elements that they fill on the framebuffer. Any fragments that fall outside the screen are discarded and the attributes outputted by the vertex shader are interpolated across the fragments, as shown in the figure. Usually the fragments that are behind other primitive fragments are also discarded here because of depth testing.

* **_fragment shader_** is invoked for every fragment that survives and determines which framebuffer(s) the fragments are written to and with which color and depth values. It can do this using the interpolated data from the vertex shader, which can include things like texture coordinates and normals for lighting.

* **_color blending_** stage applies operations to mix different fragments that map to the same pixel in the framebuffer. Fragments can simply overwrite each other, add up or be mixed based upon transparency.


---

## Vertex input
- **Bindings**: spacing between data and whether the data is per-vertex or per-instance (see [instancing](https://en.wikipedia.org/wiki/Geometry_instancing))
- **Attribute descriptions**: type of the attributes passed to the vertex shader, which binding to load them from and at which offset

---
## Color blending:
Two ways to do it:
- Mix the old and new value to produce a final color
- Combine the old and new value using a bitwise operation

---
## Attachment

> **attachment 就是 GPU 在一次渲染过程中“渲染目标”或者“存储画面结果”的那块内存区域。**

更口语一点说：
- 就是一块要画东西、保存数据的“画布”或“缓冲区”。
- 它可以是**颜色缓冲区**（color attachment）、**深度缓冲区**（depth attachment）、**模板缓冲区**（stencil attachment）等。

1. **Color attachment**  
    存储最终的颜色数据（比如你要显示到屏幕上的那张图片）
2. **Depth attachment**  
    存储深度（z-buffer），用于深度测试，防止“后面的物体把前面的遮掉”
3. **Stencil attachment**  
    存储模板测试数据（不常用）


- 在 Vulkan 里，你在**render pass**里描述 attachment 的属性（格式、load/store 操作、采样数等）。
- 在**framebuffer**里，attachment 实际对应了一张图片（比如 swapchain 的一张图像）

- `loadOp`：渲染前 attachment 里的内容怎么处理？（清零？保留？无所谓？）
- `storeOp`：渲染后 attachment 里的内容怎么处理？（保存？丢弃？）


#### LoadOP
1. **VK_ATTACHMENT_LOAD_OP_LOAD**
       - **保留**当前 attachment 的内容（即保留上一帧的像素/深度等）
    - 适合做“增量渲染”，比如你想分几次把一张大图画完
        
2. **VK_ATTACHMENT_LOAD_OP_CLEAR**
    - **清空**当前 attachment 的内容（用你指定的 clear color/depth 覆盖全部像素）
    - 最常见的用法：**每一帧一开始都把 framebuffer 清空成全黑/透明/固定颜色**
    - 通常就是“开新画布”，不管旧东西
        
3. **VK_ATTACHMENT_LOAD_OP_DONT_CARE**
    - **无视**当前内容（GPU 实现可以乱填，也许保留，也许随便写垃圾数据）
    - 你保证这张 attachment 在本帧每个像素都会被重新写一遍，否则就会有脏数据
    - 用于优化，跳过不必要的“清空”或“保留”


#### StoreOp

- `VK_ATTACHMENT_STORE_OP_STORE`: Rendered contents will be stored in memory and can be read later
- `VK_ATTACHMENT_STORE_OP_DONT_CARE`: Contents of the framebuffer will be undefined after the rendering operation


---

**FrameBuffer** : 一组 attachment 对应的实际图像资源（VkImageView）
“渲染目标”的具体内容，是 GPU 最终画到的地方。


**Attachment**:  指Framebuffer 里的每一张“画布”（color, depth, stencil 等）。
- 在 Vulkan 的 RenderPass 里，用 `VkAttachmentDescription` 结构体描述每个 attachment 的类型、格式、load/store 操作、layout 等。

**RenderPass**: 
- 可以理解为“一次大的绘画任务”，规定了要用哪些 attachment（画布），怎么用它们。
- RenderPass 规定了所有 attachment 的描述、哪些 subpass 怎么用这些 attachment，以及 subpass 之间如何传递 attachment 的内容（比如前一个 pass 的输出，作为下一个 pass 的输入）。

**Subpass**: 
- RenderPass 里的“步骤”或“小流水线”。
- 每个 Subpass 负责某一部分渲染，可以只用到部分 attachment。
- 多个 subpass 串在一起，可以高效做多步渲染（比如延迟渲染/后处理等）
- 在一个 RenderPass 里，subpass 按顺序执行，可以减少内存切换，提高性能。

**Attachment Reference:**
- Subpass 里会“引用”某些 attachment（告诉 Vulkan：我这个 subpass 用哪个画布）。
- 用 `VkAttachmentReference` 结构体，指定引用第几个 attachment 以及它需要的 layout。

**Layout:**
- 描述 attachment 当前的“状态”或“用途”，比如：
    - 要不要被写入（渲染/输出/清空） - 要不要被读取（采样/显示/拷贝）
- layout 需要在 RenderPass 里指定
    - 渲染前 attachment 是什么 layout（initialLayout）
    - 渲染后要变成什么 layout（finalLayout）
- 比如渲染阶段用 `COLOR_ATTACHMENT_OPTIMAL`，最后准备显示用 `PRESENT_SRC_KHR`。


**举例总结**
假如你要渲染一个画面（比如画一个三角形）：
1. **你先有一组图片（Framebuffer），包含颜色图和深度图。**
2. **定义 attachment**：比如 0 号 attachment 是 color，1 号 attachment 是 depth。 
3. **定义 RenderPass**：描述这些 attachment 该怎么被用。
4. **定义一个 Subpass**：比如这个 subpass 会输出到 color attachment。
5. **Subpass 用 attachment reference**：指定 color attachment（用作 output），需要什么 layout。
6. **layout**：
    - 初始 layout：没关系，反正要清掉
    - subpass 用：COLOR_ATTACHMENT_OPTIMAL
    - 渲染完后（final）：PRESENT_SRC_KHR（让它可以显示到屏幕）






---

## Fence & Semaphore

### Semaphore
* signal/wait都是提交给GPU的，让一组任务必须等另一组任务做完，只在GPU内部流转，主机不会因为semaphore而“卡住”。
* 

### Fence
* 主要用于CPU（host）和GPU（device）之间的同步。
* CPU端（host）可以主动“等” fence signal（比如`vkWaitForFences`），这样CPU会“卡住”，等GPU那边的任务真的做完。



**Fence可以让CPU“等GPU”，是CPU和GPU的同步；semaphore只让GPU各个操作“等来等去”，CPU管不着。**





---

## Memory Type

常见组合：
每个 memory type 都有不同的**属性**（flags），主要是下面这几种: 

| 属性名                                       | 含义                            |
| ----------------------------------------- | ----------------------------- |
| `VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT`     | **本地显存**（最快，GPU直接用，CPU一般访问不到） |
| `VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT`     | **CPU可见**（CPU能直接映射访问）         |
| `VK_MEMORY_PROPERTY_HOST_COHERENT_BIT`    | **内存操作一致**（不用手动flush/unmap）   |
| `VK_MEMORY_PROPERTY_HOST_CACHED_BIT`      | **CPU端有缓存**（读更快）              |
| `VK_MEMORY_PROPERTY_LAZILY_ALLOCATED_BIT` | **惰性分配**（tile-based GPU用，稀有）  |
通常每种memory type会组合上面几个flags。


---

## Alignment


- Scalars have to be aligned by N (= 4 bytes given 32 bit floats).
- A `vec2` must be aligned by 2N (= 8 bytes)
- A `vec3` or `vec4` must be aligned by 4N (= 16 bytes)
- A nested structure must be aligned by the base alignment of its members rounded up to a multiple of 16.
- A `mat4` matrix must have the same alignment as a `vec4`.

[the specification](https://www.khronos.org/registry/vulkan/specs/1.3-extensions/html/chap15.html#interfaces-resources-layout).

Method 1:

```cpp
struct UniformBufferObject{
    glm::vec2 foo;      //8 bytes
    alignas(16) glm::mat4 model;    // 64 bytes
    glm::mat4 view;     // 64 bytes
    glm::mat4 proj;     // 64 bytes
};
```

Method 2:
(doesn't work in nested structure situation)
#define GLM_FORCE_DEFAULT_ALIGNED_GENTYPES;


---


|模块|职责|
|---|---|
|**Instance**|创建并管理 `VkInstance`、调试 Messenger、查询全局层与扩展|
|**Device**|选物理设备、创建 `VkDevice`、获取图形队列和呈现队列、管理全局同步原语（像 Fence/Semaphore）|
|**Surface**|创建并管理 `VkSurfaceKHR`|
|**SwapChain**|根据能力信息创建 `VkSwapchainKHR`、管理 swapchain images & imageViews|
|**CommandPool**|创建并管理 `VkCommandPool`，负责分配和重置 command buffers|
|**CommandBuffer**|对单条或多条 `VkCommandBuffer` 的封装，用于录制命令（可能分 Primary/Secondary）|
|**Descriptor**|创建并管理 Descriptor Set Layout、Pool、Sets|
|**Pipeline**|创建 Graphics/Compute Pipeline，管理 Shader Modules、Pipeline Layout|
|**FrameGraph**|（高级）管理帧级渲染流程，自动处理资源依赖、Pass调度|



| 资源类型                          | Vulkan Descriptor Type                      | 用途举例              |
| ----------------------------- | ------------------------------------------- | ----------------- |
| **Uniform Buffer**            | `VK_DESCRIPTOR_TYPE_UNIFORM_BUFFER`         | 相机矩阵、变换矩阵、光照参数    |
| **Storage Buffer**            | `VK_DESCRIPTOR_TYPE_STORAGE_BUFFER`         | 大型动态数据（粒子系统、骨骼动画） |
| **Combined Image Sampler**    | `VK_DESCRIPTOR_TYPE_COMBINED_IMAGE_SAMPLER` | 贴图采样（漫反射纹理、法线贴图）  |
| **Storage Image**             | `VK_DESCRIPTOR_TYPE_STORAGE_IMAGE`          | 可写入的图像（计算着色器写入）   |
| **Input Attachment**          | `VK_DESCRIPTOR_TYPE_INPUT_ATTACHMENT`       | Subpass 间共享渲染结果   |
| **Inline Uniform Block** / 动态 | `VK_DESCRIPTOR_TYPE_INLINE_UNIFORM_BLOCK` 等 | 小块快速更新 Uniform    |





|      特性      |              直接成员 `Window window;`               |                    智能指针成员 `std::unique_ptr<Window> window;`                     |
| :----------: | :----------------------------------------------: | :-----------------------------------------------------------------------------: |
|   **存储位置**   |     跟着父对象走──父对象在栈上，它就在栈上；父对象在堆上，它就在堆上；静态区同理      |                     `window` （指针本身）跟父对象走；`Window` 对象本体永远在堆上                     |
|   **构造时机**   |       父对象一构造就必须调用 `Window` 构造函数（初始化列表里就得写）       |               可以延迟到运行时的任意时刻用 `make_unique`／`new` 创建，也可以在不需要时保持空指针               |
|   **异常安全**   |       如果 `Window` 构造抛异常，父对象就构造失败，整个对象没法继续        | 你可以在 `init()` 里做 `window = make_unique<…>()`，捕获异常后父对象本身还算正常构造，只是 `window` 仍为空指针 |
|  **头文件依赖**   | 头文件里得完整 `#include "window.h"`，因为要知道 `Window` 的大小 |               头文件里只需 `class Window;` 前向声明，以减少编译依赖；实现里再 `#include`               |
| **可选性 & 重置** |       永远有一个有效的 `Window` 实例，不能 “清空” 或 “重建”        |           可以随时 `window.reset()` 释放、也可以 `window = make_unique<…>()` 重建           |


在 Vulkan 里，这两者其实是两个独立的概念，你要分清它们的用途：

1. **`swapchainImages.size()`**  
    代表 GPU 上可用作呈现目标的后备帧（back‐buffer）总数。你用它来创建 swapchain image views、然后在提交给呈现器的时候把渲染结果 “贴” 到哪个具体的 image 上。
    
2. **`MAX_FRAMES_IN_FLIGHT`**  
    代表你同时允许有多少帧“在飞”——也就是 GPU 最多会同时处理多少次提交（command buffer +信号量 + fence）。它控制的是并行度，以平衡 CPU 准备命令和 GPU 执行命令之间的关系。
    

---

### 要为谁准备 attachmentInfo 或 command buffer?

- **Command buffer、同步对象（semaphore/fence）等资源**  
    通常是按照 `MAX_FRAMES_IN_FLIGHT` 来分配。  
    也就是说，如果你设置同时最多允许 2 帧在飞，CPU 就只需要两个 command buffer set／两个 fence／两个 semaphore 套件，因为你不可能同时提交第 3 次。
    
- **Swapchain image views（和你在录制时要“指向”的 attachmentInfo）**  
    则是按照 `swapchainImages.size()` 来分配，因为每个 swapchain image 都要有一个 image view。
    

---

### 在动态渲染（`vkCmdBeginRendering`）的正确用法

1. **资源分配**
    
    ```cpp
    // 同步 & CB 数量，按并行度分
    commandBuffers_.resize(MAX_FRAMES_IN_FLIGHT);
    imageAvailableSemaphores_.resize(MAX_FRAMES_IN_FLIGHT);
    renderFinishedSemaphores_.resize(MAX_FRAMES_IN_FLIGHT);
    inFlightFences_.resize(MAX_FRAMES_IN_FLIGHT);
    
    // Image views 数量，按 swapchain 大小分
    swapChainImageViews_.resize(swapchainImages.size());
    for (size_t i = 0; i < swapchainImages.size(); i++) {
        // 创建 image views...
    }
    ```
    
2. **录制 & 提交（每一帧）**  
    在每一帧渲染循环里，你会先用 fence/semphore 等拿到一个 “当前帧索引”——`currentFrame`，范围是 `[0, MAX_FRAMES_IN_FLIGHT)`。  
    然后通过 `vkAcquireNextImageKHR` 拿到一个 swapchain image 索引——`imageIndex`，范围是 `[0, swapchainImages.size())`。
    
    ```cpp
    // 1) 等 fence，2) 获取 imageIndex，3) reset fence...
    vkAcquireNextImageKHR(..., &imageIndex);
    // 4) 录制 cmd buffer[currentFrame]
    commandBuffers_[currentFrame].begin(...);
    
      // 构造动态 attachmentInfo，指向 swapChainImageViews_[imageIndex]
      vk::RenderingAttachmentInfo colorAttachment =
          vk::RenderingAttachmentInfo{}
            .setImageView(swapChainImageViews_[imageIndex])
            /* … 其他设置 … */;
    
      vk::RenderingInfo beginInfo
        .setColorAttachmentCount(1)
        .setPColorAttachments(&colorAttachment)
        /* … depth, layers … */;
    
      commandBuffers_[currentFrame].beginRendering(beginInfo);
        // draw calls…
      commandBuffers_[currentFrame].endRendering();
    commandBuffers_[currentFrame].end();
    
    // 5) 提交 commandBuffers_[currentFrame]，用 imageAvailableSemaphores_[currentFrame]／renderFinishedSemaphores_[currentFrame]
    vkQueueSubmit(...);
    ```
    
    - 这里你永远只有 `MAX_FRAMES_IN_FLIGHT` 套 commandBuffers／sync objects，
        
    - 但是每次录制时会传入不同的 `swapChainImageViews_[imageIndex]`。
        

---

### 总结

- **“CB、fence、semaphore 数量”** ⇒ 按 **MAX_FRAMES_IN_FLIGHT**。
    
- **“每个 swapchain image 的 image view（和如果你想预先存好 attachmentInfo 数组）”** ⇒ 按 **swapchainImages.size()**。
    

它们协同工作：一个控制并行度，一个控制你最终要渲染到哪几块帧缓冲上。只要在录制第 N 帧的时候，用正确的 `currentFrame` （CB 组）和 `imageIndex` （指向对应的 swapchain image view）就万事 OK 了。