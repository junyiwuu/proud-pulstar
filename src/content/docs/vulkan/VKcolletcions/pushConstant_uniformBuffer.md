---
title: Push Constant / Uniform Buffer
---
The minimum  push constant that Vulkan can guarantee is  128 bytes. So if you want to make sure your Vulkan engine can work on all device/platform, then don't exceed this number.

One mat4 is 16 floats, one float is 4 bytes, so one mat4 will use 64 bytes. 128 bytes = 2 * mat4

---

## Uniform buffer
Uniform buffer is a way to provide arbitrary read-only data to out shaders
(push constants is limited to the size, only 2 mat4 is allowed)
Disadvantages:
* reading from uniformbuffer memory can be slower
* require additional setup (buffer + descriptor sets)
