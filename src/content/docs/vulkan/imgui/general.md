---
title: general
---


`ImGuiIO` 是 Dear ImGui 核心用来“输入/输出”管理的一个全局状态结构体，你可以把它想象成 ImGui 内部的大脑——它负责：

1. **配置（Config）**
     - `io.ConfigFlags`：打开/关闭各种特性（键盘导航、Docking、Multi-Viewport 等）。
     - `io.ConfigWindowsMoveFromTitleBarOnly`、`io.ConfigWindowsResizeFromEdges` 等其他开关。
        
2. **显示参数**
    - `io.DisplaySize`：告诉 ImGui 你的窗口或画布有多大（单位：像素）。
    - `io.DisplayFramebufferScale`：当使用 HiDPI（DP IS）时，用来缩放 UI。
        
3. **输入状态（Input）**
    - `io.DeltaTime`：两帧之间的时间差（秒），用来让动画、重复按键等按帧率无关。
    - `io.MousePos`、`io.MouseDown[5]`：当前鼠标位置和按键状态。
    - `io.KeysDown[512]`、`io.KeyCtrl`、`io.KeyShift`、`io.KeyAlt`：键盘状态。
    - `io.MouseWheel`、`io.MouseWheelH`：滚轮输入。
        
4. **输出/反馈（Output）**
    - `io.WantCaptureMouse`、`io.WantCaptureKeyboard`：告诉你是否应该把鼠标/键盘事件消费给 ImGui，还是让后续的游戏/应用处理。
    - `io.MouseDrawCursor`：如果 ImGui 想自己画鼠标指针（而不是系统指针），就会设置这个标志，你需要在渲染里配合关闭系统光标。
        

---

### 为什么要写 `ImGuiIO& io = ImGui::GetIO();`

- **单例模式**：ImGui 全局只有一个 `ImGuiIO` 实例，`GetIO()` 返回对它的引用，所有配置和输入都通过这一个结构体读写。
    
- **使用示例**：
    
    ```cpp
    ImGuiIO& io = ImGui::GetIO();
    io.DisplaySize = ImVec2(windowWidth, windowHeight);
    io.DeltaTime   = frameTime;  
    io.ConfigFlags |= ImGuiConfigFlags_DockingEnable; 
    // 然后把鼠标、键盘事件写入 io.MousePos / io.KeysDown[] 等
    ```
    
- **每帧都要更新**：在调用 `ImGui::NewFrame()` 之前，把当前帧的所有输入（鼠标位置、按键状态、时间差等）写入 `io`，ImGui 才能正确地处理交互和布局。
    

