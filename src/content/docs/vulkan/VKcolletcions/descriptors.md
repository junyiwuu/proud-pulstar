---
title: Descriptors
---


## 
[VkVertexInputBindingDescription](https://registry.khronos.org/vulkan/specs/latest/man/html/VkVertexInputBindingDescription.html)  :
* structure specifying vertex input binding description. 
* Each vertex input binding is specified by the `VkVertexInputBindingDescription` structure
```c++
typedef struct VkVertexInputBindingDescription {
    uint32_t             binding;
    uint32_t             stride;
    VkVertexInputRate    inputRate;
} VkVertexInputBindingDescription;
```


[VkVertexInputAttributeDescription](https://registry.khronos.org/vulkan/specs/latest/man/html/VkVertexInputAttributeDescription.html): 
* structure specifying vertex input attribute description
* Each vertex input attribute is specified by the `VkVertexInputAttributeDescription` structure
```c++
typedef struct VkVertexInputAttributeDescription {
    uint32_t    location;
    uint32_t    binding;
    VkFormat    format;
    uint32_t    offset;
} VkVertexInputAttributeDescription;
```
* How to interpret each attribute (like position, color)

## How to use
```cpp
std::vector<VkVertexInputBindingDescription> LveModel::Vertex::getBindDescriptions(){
	std::vector<VkVertexInputBindingDescription> bindingDescriptions(1);
	bindingDescriptions[0].binding = 0;
	bindingDescriptions[0].stride = sizeof(Vertex);
	bindingDescriptions[0].inputRate = VK_VERTEX_INPUT_RATE_VERTEX;
	return bindingDescriptions;
}

std::vector<VkVertexInputAttributeDescription> LveModel::Vertex::getAttributeDescriptions(){
	std::vector<VkVertexInputAttributeDescription> attributeDescriptions(2);
	attributeDescriptions[0].binding = 0;
	attributeDescriptions[0].location = 0;
	attributeDescriptions[0].format = VK_FORMAT_R32G32B32_SFLOAT;
	attributeDescriptions[0].offset = offsetof(Vertex, position);
	  
	
	attributeDescriptions[1].binding = 0;
	attributeDescriptions[1].location = 1;
	attributeDescriptions[1].format = VK_FORMAT_R32G32B32_SFLOAT;
	attributeDescriptions[1].offset = offsetof(Vertex, color); 
	//Calculate the byte offset of color member in the vertex struct
	return attributeDescriptions;
};
```
for the attribute description, it matches vertex shader (Location matches) (check [GLSL Notes](../GLSL/GLSL))
```GLSL
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 color;  
```
* `binding` refers to which vertex buffer this attribute should read from , currently we only have one vertex buffer, and all vertex data stored here
