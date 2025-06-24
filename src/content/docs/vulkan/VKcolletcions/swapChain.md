---
title: Swap Chain
---

**Present Mode**
VK_PRESENT_MODE_IMMEDIATE_KHR : the request applied immediately
VK_PRESENT_MODE_MAILBOX_KHR (if no time, use this) the presentation engine waits for the next vertical blanking period to update the current image.
```cpp
VkPresentModeKHR LveSwapChain::chooseSwapPresentMode(
	const std::vector<VkPresentModeKHR> &availablePresentModes) {
	for (const auto &availablePresentMode : availablePresentModes) {
	if (availablePresentMode == VK_PRESENT_MODE_IMMEDIATE_KHR) {
	std::cout << "Present mode: Mailbox" << std::endl;
	return availablePresentMode;
	}
}
```
[VkPresentModeKHR](https://registry.khronos.org/vulkan/specs/latest/man/html/VkPresentModeKHR.html)


