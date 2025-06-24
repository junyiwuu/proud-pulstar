---
title: lveDevice.createBuffer
---
```cpp
void LveDevice::createBuffer( 
	VkDeviceSize size,
    VkBufferUsageFlags usage,
    VkMemoryPropertyFlags properties,
    VkBuffer &buffer,
    VkDeviceMemory &bufferMemory){

      VkBufferCreateInfo bufferInfo{};
      bufferInfo.sType = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO;
      bufferInfo.size = size;
      bufferInfo.usage = usage;
      bufferInfo.sharingMode = VK_SHARING_MODE_EXCLUSIVE;

		//check if success
      if(vkCreateBuffer(device_, &bufferInfo, nullptr, &buffer) != VK_SUCCESS){
        throw std::runtime_error("failed to create vertex buffer!");
      }

      VkMemoryRequirements memRequirements;
      vkGetBufferMemoryRequirements(device_, buffer, &memRequirements);

      VkMemoryAllocateInfo allocInfo{};
      allocInfo.sType = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO;
      allocInfo.allocationSize = memRequirements.size;
      allocInfo.memoryTypeIndex = findMemoryType(memRequirements.memoryTypeBits, properties);

      if(vkAllocateMemory(device_, &allocInfo, nullptr, &bufferMemory) != VK_SUCCESS){
        throw std::runtime_error("failed to allocate vertex buffer memory!");
      }

      vkBindBufferMemory(device_, buffer, bufferMemory, 0);
    }
```
**Purpose**: create a buffer area and allocate memory for it
* bufferInfo : define properties of the buffer


---
```cpp
      VkMemoryRequirements memRequirements;
      vkGetBufferMemoryRequirements(device_, buffer, &memRequirements);
```

* `VkMemoryRequirements` this is a STRUCTURE, just initialize , an empty structure, do nothing by itself
```c++
typedef struct VkMemoryRequirements {
    VkDeviceSize    size;
    VkDeviceSize    alignment;
    uint32_t        memoryTypeBits;
} VkMemoryRequirements;
```

* `vkGetBufferMemoryRequirements` this is a METHOD, actually do something
```c++
void vkGetBufferMemoryRequirements(
    VkDevice                                    device,
    VkBuffer                                    buffer,
    VkMemoryRequirements*                       pMemoryRequirements);
```
* it returns the memory requirements for specified vulkan object
* retrieve information about what memory requirements a buffer has
* it doesn't return anything, it filled the previous empty structure (VkMemoryRequirements)



![Imgur](https://i.imgur.com/hWhawoY.jpg)
