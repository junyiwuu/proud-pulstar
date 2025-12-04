---
title: push Constant
---
Set up in the "Pipeline Layout"
* stage flags: who can access it, for example : VK_SHADER_STAGE_VERTEX_BIT
* offset : must be multiple of 4.
* size: must be multiple of 4.



Validation error: the size of push constant block in GLSL , is smaller than, the size of `VkPushConstantRange.size` .
Vulkan wants the later always bigger than the another one.
The reason is because we need to do alignment in the code. 
```
struct pushConstantStruct{
    glm::vec3 offset;
    alignas(16) glm::vec3 color;
};
```