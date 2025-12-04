---
title: Profiling
---




## Perf
launch: `perf record ./xxx`
check: `perf report`

check details:
launch : `perf record -g ./xxx`
check: `perf report`


> **Profiler = 检查程序性能的仪器**  
> 看哪里慢、CPU在干啥、时间花哪儿了。

Rocky Linux 下常用的 profiler：
- `gprof`（入门）
- `perf`（专业）
- `valgrind`（检测内存，顺带能做性能）
- `callgrind + kcachegrind`（图形化火焰图）
- `nsight / renderdoc`（图形/GPU方向，这以后你一定会玩）
    

**gprof 使用示例**
编译时加 profiling flag：

```bash
g++ main.cpp utils.cpp -pg -o app
```

运行：

```bash
./app
```

生成 `gmon.out` 文件  
现在分析：

```bash
gprof app gmon.out > profile.txt
cat profile.txt
```

你会看到类似：

```
% time  self  children called name
50.00   0.00  0.00      1       addMainFunction
50.00   0.00  0.00      1       addFunction
```


**怎么看“线程状态”？**

**`htop`**
安装：

```bash
sudo dnf install htop
htop
```

按 `H` → 显示线程  
你能看到 CPU、线程数量、占用率

**更底层：`top -H`**

```bash
top -H -p <PID>
```

能看到每个线程的状态 (`R` running, `S` sleeping...)

*(更极客：perf / gdb)*



**Valgrind（检测内存泄漏 / 越界）**

运行你的程序：
```bash
valgrind ./app
```
如果有泄漏/错用，它会告诉你。

图形化可视化：`massif + ms_print`
这以后你写大型工具/引擎会疯狂用。

格式化代码:
- C++ 官方推荐：**clang-format**
    
安装：

```bash
sudo dnf install clang-format
```

格式化一个文件：

```bash
clang-format -i main.cpp
```

在 VSCode 里按一下 Save 或快捷键，代码就**自动变漂亮**。

| 词        | 人话            |
| -------- | ------------- |
| Profiler | 看性能瓶颈         |
| 线程状态     | 看 thread 运行情况 |
| 内存检查     | 看内存泄漏和滥用      |
| 格式化代码    | 自动整理代码风格      |
| 运行测试     | 自动检查功能是不是正常   |
