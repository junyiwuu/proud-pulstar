---
title: Buffers
---
## Index Buffer
a piece of information that tell the GPU how to combine vertices to make up triangles

(images from the [vulkan tutorial](https://www.youtube.com/watch?v=qxuvQVtehII&list=PL8327DO66nu9qYVKLDmdLW_84-yE4auCR&index=19))
vertex buffer : {v0, v1, v2, v3, v4, v5 ...}
Index buffer: {0, 1, 2, 2, 1, 3, 0 , 4, 5 ...}
* for example,  in the index buffer, 0, 1, 2 belongs to triangle1, and point to v0 v1 v2.
* so the order is based on the triangle, and the number indicate to the vertex ID
![Imgur](https://i.imgur.com/1UMr65x.jpg)

![Imgur](https://i.imgur.com/hrHxigS.jpg)




### How to implement in code
#### Prepare

**Two struct**, one is Vertex struct, for vertex buffer, one is for Builder struct, contains both vertices and indices (all public)
```cpp
	struct Vertex{
	glm::vec3 position;
	glm::vec3 color;
	static std::vector<VkVertexInputBindingDescription> getBindDescriptions();
	static std::vector<VkVertexInputAttributeDescription> getAttributeDescriptions();
};

struct Builder {
	std::vector<Vertex> vertices{};
	std::vector<uint32_t> indices{}; 
};
```
about [Descriptions](./descriptors)

**initialize** ,  add builder into the constructor
```cpp
LveModel(LveDevice &device, const LveModel::Builder &builder ) ;
~LveModel()
```


**adding private member** 
```cpp
void createVertexBuffers(const std::vector<Vertex> &vertices);
void createIndexBuffers(const std::vector<uint32_t> &indices);
LveDevice &lveDevice;

//vertex
VkBuffer vertexBuffer;
VkDeviceMemory vertexBufferMemory;
uint32_t vertexCount;

//index
bool hasIndexBuffer = false; 
VkBuffer indexBuffer;
VkDeviceMemory indexBufferMemory;
uint32_t indexCount;
```


---
in the constructor, we need to trigger creating buffers
```cpp
LveModel::LveModel ( LveDevice&device, const LveModel::Builder &builder ) : lveDevice(device){
    createVertexBuffers(builder.vertices);
    createIndexBuffers(builder.indices);
}
```

---
#### Create buffers

```cpp
void LveModel::createVertexBuffers(const std::vector<Vertex> &vertices){
    vertexCount = static_cast<uint32_t>(vertices.size());  //map input data to uint32_t type
    assert(vertexCount >= 3 && "vertex count must be at least 3");
    VkDeviceSize bufferSize = sizeof(vertices[0]) * vertexCount;
    lveDevice.createBuffer(
        bufferSize, VK_BUFFER_USAGE_VERTEX_BUFFER_BIT,
        VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT,
        vertexBuffer, vertexBufferMemory
    );

    void *data;
    vkMapMemory(lveDevice.device(), vertexBufferMemory, 0, bufferSize, 0, &data);
    memcpy(data, vertices.data(), static_cast<size_t>(bufferSize));
    vkUnmapMemory(lveDevice.device(), vertexBufferMemory);
}
```

1. Vertex count, which is vertices array size
2. check valid : vertices must be at least 3
3. for Memory
	1. (VkDeviceSize) buffer size = one vertice size * vertices count
	2. lveDevice.createBuffer()  [fine note here](../helplers/lveDevice_createBuffer)
4. `vkMapMemory`  
	* maps GPU Memory into CPU memory
	* `void* data` a pointer that CPU can write to  (in CPU), where you want to map to 

 

---
**Initial Data Setup** (CPU):
    - CPU prepares vertex data, textures, etc.
    - CPU maps GPU memory with `vkMapMemory`
    - CPU writes this data to mapped memory
    - CPU unmaps the memory with `vkUnmapMemory`
1. **GPU Processing** (GPU):
    - GPU reads the data you uploaded during rendering operations
    - GPU executes shaders, performs transformations, rasterization, etc.
    - GPU writes results (like rendered frames) to framebuffers in GPU memory
2. **Presentation** (GPU → Display):
    - The rendered image in the framebuffer is presented to the screen
    - This happens through the Vulkan presentation engine (`vkQueuePresentKHR`)
    - The image goes directly from GPU memory to the display

The CPU doesn't handle the final presentation to the screen. The GPU renders the image and sends it directly to the display hardware. The CPU's role is:

- Setting up resources
- Recording command buffers
- Submitting work to the GPU
- Synchronizing operations


Host : the code in CPU
Device: GPU

Most efficient for device access : 
> `VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT` bit specifies that memory allocated with this type is the most efficient for device access. This property will be set if and only if the memory type belongs to a heap with the `VK_MEMORY_HEAP_DEVICE_LOCAL_BIT` set.

This method, the memory can be fast access by GPU, but CPU cannot direct do something on it. This usually mean VRAM
1. We need to copy the data from host to a temporary buffer that is visible to host
2. copy the data to the device local memory (VRAM)by using vkCommandCopyBuffer function
3. once copied, destroyed the temporary buffer / staging buffer  --> by VkUnmapMemory()) (for data on the host)) and VkDestroyBuffer() (for staging buffer)

**Understand these flag:**
`VK_BUFFER_USAGE_TRANSFER_SRC_BIT` : the buffer create here will be used as the source location for a memory transfer operation
`K_MEMORY_PROPERTY_HOST_VISIBLE_BIT` : visible to host
`VK_MEMORY_PROPERTY_HOST_COHERENT_BIT`: whenever we update memory on the host side , automatically flush that data to the device side
[VkMemoryPropertyFlagBits information](https://registry.khronos.org/vulkan/specs/latest/man/html/VkMemoryPropertyFlagBits.html)


`VK_BUFFER_USAGE_TRANSFER_DST_BIT` : Buffer can be used as the destination of a transfer command
[VkBufferUsageFlagBits information](https://registry.khronos.org/vulkan/specs/latest/man/html/VkBufferUsageFlagBits.html)

### in draw function

check if index buffer available
```cpp
void LveModel::draw(VkCommandBuffer commandBuffer){
    if (hasIndexBuffer){
        vkCmdDrawIndexed(commandBuffer, indexCount, 1, 0, 0, 0);
    }else{
        vkCmdDraw(commandBuffer, vertexCount, 1, 0, 0);
    }
}
```


### make index buffer available

```cpp
void LveModel::bind(VkCommandBuffer commandBuffer){
    VkBuffer buffers[] = {vertexBuffer};
    VkDeviceSize offsets[] = {0};
    vkCmdBindVertexBuffers(commandBuffer, 0 , 1, buffers, offsets);

    if(hasIndexBuffer){
        vkCmdBindIndexBuffer(commandBuffer, indexBuffer, 0, VK_INDEX_TYPE_UINT32);
    }
}
```




---
