---
title: Graphics
---


## Rasterization
**Explain:**
Rasterization is a process that converts vector graphics or 3D graphics to 2D images. It is the fixed function in modern graphic API.
Rasterization start from objects, tell what triangles will be draw
Geometry -> pixels



## Rendering Equation

Can you give an explanation of how the [Rendering Equation](https://en.wikipedia.org/wiki/Rendering_equation) works?:
The rendering equation is the fundamental mathematical formula that describes how light behaves in a scene. It is the theoretical foundation for physically based rendering:


### BRDF


## anti-aliasing


### Multisampling
```
vec3 pixel_color(0, 0, 0);
for (int s = 0; s < samples_per_pixel; s++) {
    auto u = (i + random_double()) / (image_width - 1);
    auto v = (j + random_double()) / (image_height - 1);
    ray r = cam.get_ray(u, v);
    pixel_color += ray_color(r, world);
}
write_color(pixel_color, samples_per_pixel);
```
- random_double(): random sample (jitter) around pixel point
- Multiple light ray (samples_per_pixel)
- Adding up pixel color
- Get the average over number of samples (write_color)
This is called Monte Carlo Supersampling(MCAA)


### MSAA
rasterization only optimization
sampling edges only, not shading each sample like MCAA
Handled automatically by GPU hardware
The GPU checks multiple sample points inside each pixel to detect if the triangle edge passes through that pixel


- MSAA
- MLAA
- FXAA
- TXAA

What anti-aliasing techniques do you know about?(some possible techniques are MSAA, MLAA, FXAA and TXAA)



## Back-face culling

1. Vertex through vertex shader-> into screen space
2. GPU read vertex via Index Buffer
3. check if these three points is counterclockwise or clockwise
> **How to check winding order:** 
> vertice 0-> vertice 1 -> vertice 2
	$\vec{a} = V_1 - V_0$
	$\vec{b} = V_2 - V_0$
	cross product $\vec{a}$ and $\vec{b}$, 
> - if the result > 0 -> counterclockwise -> Front face
> - if the result < 0 -> clockwise -> Back face



GPU calculate winding order, if three points are counterclockwise, show it.  if it clockwise, hide it.


Do cross product, 

## UV Mapping
Every vertex stores a UV coordinate, in (u, v) space. Then during rasterization, the GPU will interpolate those UV across the triangle, so every pixel(fragment shader) knows exactly which (u, v) to sample from the texture.



## Graphic pipeline
HIGH
- Describe to me the entire [graphics pipeline?](https://en.wikipedia.org/wiki/Graphics_pipeline)(your answer will probably be pretty long. You will explain about the vertex shader and the fragment shader, about perspective correct interpolation, about the z-buffer, about double buffering the framebuffer, about alpha blending, about transformation matrices, about homogeneous coordinates, about reflection models in the fragment shader and so on.)

![vulkan graphic pipeline](https://vulkan-tutorial.com/images/vulkan_simplified_pipeline.svg)
![vulkan graphic pipeline details](https://docs.vulkan.org/spec/latest/_images/pipelinemesh.svg)


Full version: 
```
Input Assembler 
→ Vertex Shader → [Tessellation Control Shader → Tessellation Primitive Generator → Tessellation Evaluation Shader] 
→ [Geometry Shader] 
→ Rasterization → Fragment Shader → Color Blending/Post Processing
```

> **Geometry shader**
> The geometry shader operates on a group of vertices and their associated data assembled from a single input primitive, and emits zero or more output primitives and the group of vertices and their associated data required for each output primitive.
> (not popular now, since slow and expensive)

>**Input Assembler:**
>Read from vertex buffer. The input assembler stage takes raw vertex data (like positions, normals, uv etc) and groups them into primitives such as points, lines, or triangles, according to the specified topology.
>For example in Vulkan:
>		```
		VkPipelineInputAssemblyStateCreateInfo inputAssembly = {
    .sType = VK_STRUCTURE_TYPE_PIPELINE_INPUT_ASSEMBLY_STATE_CREATE_INFO,
    .topology = VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST,
    .primitiveRestartEnable = VK_FALSE,};```
> `VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST` means three points to one triangle, `VK_PRIMITIVE_TOPOLOGY_LINE_STRIP` means get lines
> 
> --`VkVertexInputBindingDescription` & `VkVertexInputAttributeDescription`
> These two tell Input Assembler, how vertex in memory stride, offset, 每个 vertex attribute 是什么类型、存在哪里（比如位置、法线、UV）.这些信息由：`VkPipelineVertexInputStateCreateInfo` 结构指定，input asslember会按照这个结构把数据从GPU memory 读出来


### Z-buffer
After rasterization, before write into color buffer, do depth test.
(rasterization find geometry that will be used, into fragment, after that, need to do fragment test -> z-buffer depth test, stencil test, alpha test etc)

### z-prepass 
Why is it useful? When would it not be useful?
 **Explain:**
Before offcially render the scene, first render the scene and only write in depth information, no lighting or color information.

**Why:**
If we first render everything and then do z-depth, the part that will not be seen are wasted.

**Process:**
**First pass:** Vertex shader -> rasterization -> simple fragment shader(do nothing) -> write in depth buffer
**Second pass:** Vertex shader-> rasterization -> depth -> only do fragment on the parts that passed depth test -> write into color buffer.

## Deferred Renderer / Forward Renderer

**What is forward render:**
Traditional rendering. When draw pixels, calculate the corresponding lighting. So for every objects, calculate all lighting. Then use depth to decide what show on the screen.

**What is deferred render:** 
Split the rendering into two phases.
1. Geometry pass
	Don't do lighting, write basic pixel information (position, normal, reflectance ratio, color, etc) into G-buffer. (also use depth here, only write in the most front info)
2. Lighting pass
	Use all information stored in G-buffer, every pixel know their corresponding info, then do lighting calculation in fragment shader ( so not relative to the number of objects )

| 特性            | Forward Rendering | Deferred Rendering       |
| ------------- | ----------------- | ------------------------ |
| 多光源性能         | 开销大，线性增长          | 高效，支持大量光源                |
| shader复杂度     | 随光源数目变复杂          | 简化，光照统一处理                |
| 半透明支持         | 好支持               | 差，因为不容易混合多个半透明对象         |
| MSAA 支持       | 支持直接 MSAA         | 复杂，需要额外处理                |
| 后期处理（Post FX） | 难整合               | 易集成各种屏幕空间效果，如 SSAO、bloom |
| 内存开销          | 相对小               | 大，需要多个 G-Buffer          |




---
## Shadow
### Soft shadow
how to do it ?


---
## Monte Carlo




---
## Euler angle
whats the issue


## Quanternion
what is quanternion



## Geometry intersection


## Moire pattern
It is because the texture has high-frequency detail, like stripes, fabric patterns, grids etc, but the screen resolution or sampling is too low to properly represent it.
It shows because of aliasing
**Solution**
### mipmapping
Precompute the downscale versions (half size, quarter size)
When object is far away, GPU uses low-resolution mip level instead of full-res texture
- cheap, built into GPU hardware, default solution to almost all 3D engines

### Anisotropic filtering
Mipmapping handles distance well, but fails when texture is viewed at steep angle (like floor). Far away looks blur, not what we want.
- It estimates the pixel coverage in texture UV space  
    → forms an elliptical sampling region
- Then it samples multiple mipmap levels along the long axis
- Finally, it combines those samples to produce a sharp but alias-free result

“Anisotropic filtering analyzes how the texture is distorted in screen space —  
if it’s stretched more in one direction, it samples more densely along that direction,  
instead of using a uniform square sample like bilinear filtering.”


### Prefiltering
Filter the texture before sampling, rather than at runtime. Used heavily in GGX environment map, IBL




## Anisotropic
Anisotropic filtering sharpens textures based on view direction
Anisotropic = direction-sensitive


---



## General questions



**What are the most common elements of a rendering engine?**
Scene & entity system, camera system, material&shader system, geometry system, resource management, render queue, frame graph/render pass system, post processing



**How does GPU work**
A GPU is designed for massive parallel computation, instead of a few powerful cores like a CPU, it has thousands of lightweight cores that execute many tasks at once (called SIMT, single instruction, multiple threads)

|Step|What GPU does|
|---|---|
|1️⃣ Receive a large batch of work|e.g. all pixels, all vertices, all AI tensors|
|2️⃣ Launch **many threads** in parallel|grouped into **warps** (NVIDIA: 32 threads)|
|3️⃣ All threads in a warp run the **same instruction**|extremely efficient for uniform work|
|4️⃣ If one thread stalls (e.g., memory fetch)|GPU instantly switches to another warp → hides latency|
|5️⃣ Uses **specialized hardware**|texture sampling, rasterization, matrix math, etc.|


**Write a checkerboard**
```
vec2 uv = gl_FragCoord.xy / iResolution.xy *2.0 - 1.0;
uv.x *= iResolution.x / iResolution.y ;

// Scale how many tiles (e.g., 8x8)
float tiles = 2.0;
vec2 grid = floor(uv * tiles);

// Checkerboard pattern: even = white, odd = black
float checker = mod(grid.x + grid.y, 2.0);

vec3 color = checker == 0.0 ? vec3(1.0) : vec3(0.0); // white or black

gl_FragColor = vec4(color, 1.0);
```

 **What happens when you sample a texture in a shader?**

|Step|What Happens|
|---|---|
|**1. GPU takes your UV**|A coordinate like `(0.3, 0.7)` in normalized texture space|
|**2. Converts UV → texel space**|`(u * width, v * height)` to find which texels to read|
|**3. Selects mipmap level (LOD)**|Based on screen size / distance / derivative of UV|
|**4. Fetches _multiple_ texels**|E.g. 4 texels for bilinear, more for anisotropic filtering|
|**5. Applies filtering**|Bilinear / trilinear / anisotropic interpolation|
|**6. Returns final filtered color to shader**|A smooth blended color (not a single raw pixel!)|









