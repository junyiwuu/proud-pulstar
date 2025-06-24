---
title: Validation Layers
---
## Collections


| command           | Description                                                          |
| :---------------- | :------------------------------------------------------------------- |
| `VKAPI_ATTR`      | controls calling conventions for C++11 and GCC/Clang-style compilers |
| `VKAPI_CALL`      | control calling conventions for MSVC-style compilers                 |
| `pfnUserCallBack` | pfn means: pointer to function                                       |
|                   |                                                                      |

## vkCreateDebugUtilsMessengerEXT
vkCreateDebugUtilsMessengerEXT is not a core function. It is a extension of VK_EXT_debug_utils

> **what is extension**
> 	*  for example, core functions: vlCreateInstance, can be used as long as inside vulkan
> 	* `vkDestroyDebugUtilsMessengerEXT` only can be used when certain extension enabled
> 	* In this case, we need to use `vkGetInstanceProcAddr` to get the pointer function



## callback

```cpp
VKAPI_ATTR VkBool32 VKAPI_CALL helloTriangleApplication::debugCallback(
    VkDebugUtilsMessageSeverityFlagBitsEXT messageSeverity,
    VkDebugUtilsMessageTypeFlagsEXT messageType,
    const VkDebugUtilsMessengerCallbackDataEXT* pCallbackData,
    void* pUserData ){
        std::cerr << "validation layer:" << pCallbackData->pMessage << std::endl;
        return VK_FALSE;

}
```

* `VkDebugUtilsMessengerCallbackDataEXT* pCallbackData`: including the pointer to the message. Refer to `VkDebugUtilsMessengerCallbackDataEXT` struct containing the details of the message itself
* `void* pUserData`: user defined pointer


* messageSeverity: what kind of severity message you want to receive -->
`createInfo.messageSeverity = VK_DEBUG_UTILS_MESSAGE_SEVERITY_VERBOSE_BIT_EXT | VK_DEBUG_UTILS_MESSAGE_SEVERITY_WARNING_BIT_EXT | VK_DEBUG_UTILS_MESSAGE_SEVERITY_ERROR_BIT_EXT;`
accept everything but INFO
==only 4 severity== :
1. ``VK_DEBUG_UTILS_MESSAGE_SEVERITY_VERBOSE_BIT_EXT``
2. ``VK_DEBUG_UTILS_MESSAGE_SEVERITY_INFO_BIT_EXT``
3. ``VK_DEBUG_UTILS_MESSAGE_SEVERITY_WARNING_BIT_EXT``
4. ``VK_DEBUG_UTILS_MESSAGE_SEVERITY_ERROR_BIT_EXT``


==only 3 message types==: 
1. ``VK_DEBUG_UTILS_MESSAGE_TYPE_GENERAL_BIT_EXT`` 
2. ``VK_DEBUG_UTILS_MESSAGE_TYPE_VALIDATION_BIT_EXT``
3. ``VK_DEBUG_UTILS_MESSAGE_TYPE_PERFORMANCE_BIT_EXT``



## Validation Layer logic

给你的车安装一个智能监控系统
**1. 选择监控设备(验证层)**

想象你要给车安装监控系统，首先要选择安装哪些设备。在Vulkan中，你要这样做：

```cpp
// 指定想要使用的验证层
const std::vector<const char*> validationLayers = {
    "VK_LAYER_KHRONOS_validation"
};

// 检查这些验证层是否可用
bool checkValidationLayerSupport() {
    // 获取所有可用的验证层
    uint32_t layerCount;
    vkEnumerateInstanceLayerProperties(&layerCount, nullptr);
    std::vector<VkLayerProperties> availableLayers(layerCount);
    vkEnumerateInstanceLayerProperties(&layerCount, availableLayers.data());
    
    // 检查我们需要的层是否在可用列表中
    // (类似于检查商店里是否有你想要的监控设备)
    for (const char* layerName : validationLayers) {
        bool layerFound = false;
        for (const auto& layerProperties : availableLayers) {
            if (strcmp(layerName, layerProperties.layerName) == 0) {
                layerFound = true;
                break;
            }
        }
        if (!layerFound) return false;
    }
    return true;
}
```

**2. 创建Vulkan实例时安装监控系统**

就像车子制造时就要考虑安装监控系统一样，创建Vulkan实例时需要启用验证层：

```cpp
VkInstanceCreateInfo createInfo{};
// ...其他设置...

// 如果启用验证层
if (enableValidationLayers) {
    createInfo.enabledLayerCount = static_cast<uint32_t>(validationLayers.size());
    createInfo.ppEnabledLayerNames = validationLayers.data();
} else {
    createInfo.enabledLayerCount = 0;
}

// 创建Vulkan实例
vkCreateInstance(&createInfo, nullptr, &instance);
```

**3. 设置监控报警方式(调试消息回调)**

不仅要安装监控系统，还要决定如何接收警报通知。在Vulkan中，你设置一个回调函数来接收警报：

```cpp
// 首先定义回调函数(这是接收警报的手机)
static VKAPI_ATTR VkBool32 VKAPI_CALL debugCallback(
    VkDebugUtilsMessageSeverityFlagBitsEXT messageSeverity,
    VkDebugUtilsMessageTypeFlagsEXT messageType,
    const VkDebugUtilsMessengerCallbackDataEXT* pCallbackData,
    void* pUserData) {
    
    std::cerr << "验证层: " << pCallbackData->pMessage << std::endl;
    return VK_FALSE; // 返回VK_FALSE表示"收到警报，但不中断操作"
}

// 然后配置这个警报系统
VkDebugUtilsMessengerCreateInfoEXT createInfo{};
createInfo.sType = VK_STRUCTURE_TYPE_DEBUG_UTILS_MESSENGER_CREATE_INFO_EXT;
// 设置哪些级别的问题需要报警(紧急、一般或只是提醒)
createInfo.messageSeverity = 
    VK_DEBUG_UTILS_MESSAGE_SEVERITY_WARNING_BIT_EXT | 
    VK_DEBUG_UTILS_MESSAGE_SEVERITY_ERROR_BIT_EXT;
// 设置报告什么类型的问题(一般问题、验证错误、性能问题)
createInfo.messageType = 
    VK_DEBUG_UTILS_MESSAGE_TYPE_GENERAL_BIT_EXT |
    VK_DEBUG_UTILS_MESSAGE_TYPE_VALIDATION_BIT_EXT |
    VK_DEBUG_UTILS_MESSAGE_TYPE_PERFORMANCE_BIT_EXT;
// 指定接收警报的回调函数
createInfo.pfnUserCallback = debugCallback;
// 可以传递额外信息给回调函数
createInfo.pUserData = nullptr;
```

 **4. 安装警报系统(创建调试信使)**

现在要实际连接警报系统到监控设备：

```cpp
// 因为调试功能是扩展功能，需要找到扩展函数的地址
// 这就像找专业安装人员的联系方式
auto func = (PFN_vkCreateDebugUtilsMessengerEXT)vkGetInstanceProcAddr(
    instance, "vkCreateDebugUtilsMessengerEXT");
    
if (func != nullptr) {
    // 找到安装人员后，让他来安装警报系统
    func(instance, &createInfo, nullptr, &debugMessenger);
}
```

**5. 在程序结束时拆除系统**

在程序结束时，需要按正确顺序拆除这套监控系统：

```cpp
// 同样需要找到对应的拆除函数
auto func = (PFN_vkDestroyDebugUtilsMessengerEXT)vkGetInstanceProcAddr(
    instance, "vkDestroyDebugUtilsMessengerEXT");
    
if (func != nullptr) {
    // 拆除警报系统
    func(instance, debugMessenger, nullptr);
}

// 最后销毁Vulkan实例
vkDestroyInstance(instance, nullptr);
```

这整个过程就像给你的车安装并配置一个智能监控系统，它能在你的驾驶有问题时立即提醒你，而不是等到车子完全坏掉。在Vulkan中，验证层在开发阶段帮你发现API使用错误，而不是等到程序崩溃才发现问题。