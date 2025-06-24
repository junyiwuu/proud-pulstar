---
title: Pipeline
description: pipeline configuration
---


struct PipelineConfigInfo {};

//pipeline configuration

  
  

>LvePipeline

>|
>|PUBLIC:
>|--constructor (device, vert and frag files, config info)
>|--destroucctor
>|--protection from copy
>|--pipeline config ingo (static)(default pipeline fig info)
>|
>|PRIVATE:
>|--read file (spv into buffer)
>|--createGraphicPipeline
>|--createShaderModule (create shading module)
>|
>|
>|MEMBERS:
>|lve device
>|VkPipeline (graphic pipeline)
>|VkShaderModule (vert and frag)

---

### VK_SUCCESS

enum type, VK_SUCCESS =0

if (vkCreateShaderModule( lveDevice.device() , &createInfo, nullptr, shaderModule) != VK_SUCCESS) **----->** if creating not success

  

-----
## Protection
`LvePipeline(const LvePipeline& ) = delete;`
删除拷贝构造函数：当我们要基于一个已有的对象创建一个新对象时，毁掉用这个函数


LvePipeline pipeline1(...); // 正常构造
LvePipeline pipeline2 = pipeline1; // 这里会调用拷贝构造函数

- const : during the copy, no change original object
- LvePipeline& : uisng referece, so no copy

  
**Purpose**: DONT ALLOW anyone copy this an existed pipeline object. each pipeline object will have different memory address (two individual houses)
```cpp
ClassName(const ClassName& ) = delete
```

---
### VkRect2D  
  <span style="color: grey;">Structure specifying a two-dimensional subregion</span>
where can be draw when rendering (frag a render area)

---
### VkPipelineLayout

- This layout represents the interface layout between the graphic pipeline and shader resources.

- it describe how descriptors (like textures, uniform buffer etc) are organized and bound to the pipeline.

- is a handle, pointer or reference to GPU resources\

pipelineLayout = nullptr;

---
### VkRenderPass:
Allow you have multiple subpass. define render pass. VkRenderPass represents a rendering process definition. it describe how different phases(called subpasses) interact with frame buffers, including how color, depth, are handled

  
---
**Subpass:**
subpass means a render stage, for example one subpass is writing to color buffer, one is using depth buffer.


---

### PipelineConfigInfo
struct PipelineConfigInfo {

VkPipelineInputAssemblyStateCreateInfo inputAssemblyInfo;

};

  

PipelineConfigInfo LvePipeline::defaultPipelineConfigInfo(uint32_t width, uint32_t height){

PipelineConfigInfo configInfo{};
//inputAssemblyInfo is VkPipelineInputAssemblyStateCreateInfo

configInfo.inputAssemblyInfo.sType

  

configInfo : data tyoe is PipelineConfigInfo

configInfo{} : initialize -->execute `VkPipelineInputAssemblyStateCreateInfo inputAssemblyInfo;` so create a inputAssemblyInfo

  

configInfo(PipelineConfigInfo DATATYPE) is a folder, in this folder including inputAssemblyInfo also including other data type like B, C, D ...... , then we want to set configInfo.inputAssemblyInfo.sType

  
  

> `configInfo.inputAssemblyInfo.topology = VK_PRIMITIVE_TOPOLOGY_TRIANGLE_LIST;`

Tell the vulkan we want it triangle, not a line(for example)

- By default using **Triangle List**: every 3 vertices are grouped as a triangle
- ==Another option is **Triangle Strip**: for every vertices, use the previous two vertices and form a traingle , for example: v1, v2, (v3, v4, v5 ) v6, v7. Then next time become v1, v2, v3, (v4, v5, v6), v7.
- other option: [VkPrimitiveTopology](https://registry.khronos.org/vulkan/specs/latest/man/html/VkPrimitiveTopology.html)

  


**primitiveRestartEnable:**

primtive restart allows you break a series of connected primitive (eg. a strip of triangles) using a special "restart index".

- Enable: no triangle strip
- Disable: triangle strip


####  VkPolygonMode:
VK_POLYGON_MODE_FILL = 0,
VK_POLYGON_MODE_LINE = 1,
VK_POLYGON_MODE_POINT = 2,

