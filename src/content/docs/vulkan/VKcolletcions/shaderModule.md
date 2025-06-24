---
title: Shader Module
---
# The whole process:

write GLSL---> compile it into SPIR-V --->using VkShaderModule tell Vulka: here is the compiled code, keep it

`VK_DEFINE_NON_DISPATCHABLE_HANDLE(VkShaderModule)`


----

## createShaderModule

`void createShaderModule( const std::vector<char>& code, VkShaderModule* shaderModule);`

- code : SPIR-V code
- VkShaderModule, handle, pointer


```cpp

void LvePipeline::createShaderModule(
const std::vector<char>& code, VkShaderModule* shaderModule){
	VkShaderModuleCreateInfo createInfo{};
	createInfo.sType = VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO;
	createInfo.codeSize = code.size();
	createInfo.pCode = reinterpret_cast<const uint32_t*>(code.data());
	  

	if (vkCreateShaderModule( lveDevice.device() , &createInfo, nullptr, shaderModule) != VK_SUCCESS){
		throw std::runtime_error("failed to create shader module");
		}
}

```

---

### VkShaderModule
GLSL container on GPU, VkShaderModule is a handle

---
### VkShaderModuleCreateInfo
this is Vulkan struct

```cpp

typedef struct VkShaderModuleCreateInfo {

	VkStructureType sType;
	const void* pNext;
	VkShaderModuleCreateFlags flags;
	size_t codeSize;
	const uint32_t* pCode;

} VkShaderModuleCreateInfo;

```

- sType : must be VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO
- pNexr: for extension use
- codeSize : SPIR-V code file size
- pCode : pointer point to the shader code

---
### vkCreateShaderModule

```cpp

VKAPI_ATTR VkResult VKAPI_CALL vkCreateShaderModule(

	VkDevice device,
	const VkShaderModuleCreateInfo* pCreateInfo,
	const VkAllocationCallbacks* pAllocator,
	VkShaderModule* pShaderModule);

```