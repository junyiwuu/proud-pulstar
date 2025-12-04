---
title: temp1
---

 
aaa
## What is XR
extended reality.


VR
virtual reality

AR
argumented reality: virtual stuff added into the real world, not person inside the virtual world. overlay, not replacing

MR 
mixed reality.  between vr and real world. has occlusion and integration. occlusion lets virtual objects to be obscured by real objects.
occlusion allows the virtual env to be integrated with the real world, rather than the virtual world like vr
Digital objects can aware of the physical environment. You can interact wit both real and virtual objects simultaneously.




Morpheus technology, handle huge number of concurrent users and complex interactions

Different: epic games: engine powerd. developer using it to build
Msquared: internet like infrastructure that lets all metaverse worlds connect and scale. Focus on the backend.



---
## POSIX
比如对于thread来说，C++和POSIX有自己的thread方法
**POSIX** style
```
#include <pthread.h>

void* work(void*) {
    printf("hi\n");
    return NULL;
}
int main() {
    pthread_t t;
    pthread_create(&t, NULL, work, NULL);
    pthread_join(t, NULL);
}
```
**C++** style

```
#include <thread>
#include <iostream>

void work() {
    std::cout << "hi\n";
}

int main() {
    std::thread t(work);
    t.join();
}
```

| 场景                    | 选谁               |
| --------------------- | ---------------- |
| 写普通后台服务               | `std::thread`    |
| 写 Vulkan 引擎（和 OS 打交道） | POSIX 可能更香       |
| 写游戏引擎调度系统             | 混用 / 定制线程池       |
| 写 HTTP server、数据库引擎   | POSIX often used |
| Linux kernel 周边       | POSIX            |

---

---
## Register

**What is register:**
寄存器(register) 就是 CPU 里面超高速的小格子，用来放马上要算的东西。
算 a+b 时，a 和 b 会先放进寄存器，然后 CPU 在寄存器里算。

| 寄存器类型               | 干嘛的              |
| ------------------- | ---------------- |
| 通用寄存器 (RAX, RBX...) | 放计算用的数（你说的 a+b）  |
| 指令寄存器 RIP           | 存程序执行到哪一行        |
| 栈指针 RSP             | 指向当前栈位置          |
| 基址寄存器 RBP           | 帮助管理函数栈帧         |
| 参数寄存器 RDI, RSI...   | 函数参数从这里传递        |
| 返回寄存器 RAX           | 函数返回值从这里回        |
| 标志寄存器 FLAGS         | 存储比较结果，比如 > < == |
一个通用寄存器 = 64 bit = 8 bytes

| 概念        | 相当于             |
| --------- | --------------- |
| 寄存器       | 厨师手上的刀/调料（立刻要用） |
| CPU Cache | 桌子上放着的调料架（备用）   |
| RAM 内存    | 厨房储物柜（所有材料）     |
| 硬盘        | 仓库（大的、慢的）       |

**例子：执行 c = a + b**
CPU 做的事情大概是：

从内存把 a 拿进寄存器 R1
从内存把 b 拿进寄存器 R2
做 R1 + R2 → 放进寄存器 R3
把 R3 写回内存位置 c

代码看起来简单 ,底层却是：内存 ↔ 寄存器 ↔ ALU（算术单元）

---

## Thread
**What is program**:
A program is a sequence of instructions written in a programming language.
**What is process:**
A process is an instance of a program that is being executed. (e.g. tabs in chrome).
**What is thread:**
A thread is a unit of execution within a process (e.g. Apache Server).


---
## Cache
**Concept:** 
cpu always first check if the needed data is already in the cache.
if not exist, cache miss -> the required data will be copied from RAM to cache (sequence of the data)
if exist -> cache hit

**Locality of Reference:**
- **Temporal Locality**
	- recent accessed data is likely to be accessed again in the near future.
- **Spatial Locality**
	- Data that is physically close in memory tends to be accessed around the same time. (likely access the nearby memory shortly after) (also load the adjacent data)

**Cache Memory structure**
- **Instruction cache**
	- Small hardware component that accelerates the fetching and execution of CPU commands
- **Data cache**
	- Used to speed up data access
(N-Way set associative cache)
(Fully associative cache: Increased power consumption and larger chip area)
(Directed-mapped cache)

Cache replacement algorithm

---

## Heap / Stack
two areas in the RAM
Stack : an area of memory that has a predefined size, usually around 2MB, 
Heap: also might have predefined size, but can grow and change as the application goes on.


**Stack** literally just stack data on top of each other, so thats the reason why the allocation is fast.

**Heap** is not contiguous, every time when calling `new` or `malloc`, the instruction go through the memory, and finding any area that can fit the data. (return the pointer of that memory, also record some other infos such as the size of the allocation etc)
- if you asking for more memory for that location, the application need to ask the operation system for some memory (can be expensive)

**Compare**: Allocation on heap is expensive, allocation on stack is just one CPU instruction


| 区域        | 使用方式             | 对 cache 的影响                |
| --------- | ---------------- | -------------------------- |
| **Stack** | 局部变量、函数调用        | 高局部性，顺序访问，多数情况 cache 友好    |
| **Heap**  | malloc/new 分配的对象 | 可能很分散，指针链表、树更容易 cache miss |
数组放在 stack 上，连续存储，CPU 一次抓一串，**cache hit 高**。  
链表在 heap 上，一个 node 跳一个地址，**容易 cache miss**。
Stack: 小的，生命周期确定，函数调用完就扔
heap: 生命周期复杂的（不是单纯的函数作用域那么简单的），需要自己申请释放，灵活管理资源池

```
//heap:
struct vector3{
float x, y, z;
};

int main(){
	//stack
	int value = 5;
	int array[5];
	vector3 vector;
	
	//heap
	int* hvalue = new int;
	*hvalue = 5;
	int* harray = new int[5];
	vector3* hvector = new vector3();
}
```


when to use heap:
- when you cant use stack
- when you need the lifetime to be longer than the scope of your function.
- specifically need more data, for example loading texture like 15MB (CPU load in  heap, then upload to GPU vram)
- 
what happen when calling `new`:
- go through all memory
- find the proper size free memory
- allocate


If you pre-allocate the size of memory on the heap, before you ran the program, then you allocate the data from the pre-allocated, then similar to stack . 

stack 优势在于：
- 绝对简单
- 绝对连续
- 硬件友好
- 系统保证无碎片
    
heap 就算你 reserve，也不会 magically 具备这些硬件特性。

---



> implement a thread-safe queue  
> fix a race condition  
> write a basic class w/ move semantics  
> explain cache locality / why data-oriented design matters  
> talk through how you'd architect a real-time update loop

At most, you might get a concept like:

> How does the GPU pipeline differ from CPU execution?

or

> How would you profile and optimize a stuttering render frame?

Brush up on:

- Smart pointers / move semantics
    
- RAII
    
- Data structures & algorithms (medium-tier)
    
- Basic concurrency (mutex, lock, threads)
    
- Networking basics (latency, sync, tick rate)
    
- Memory + performance tuning strategies
    

If you know _conceptually_ what a ray-sphere test looks like, cool — but don’t waste energy grinding BRDFs and BVH traversal unless they already told you it's a rendering-engine role.




For a grad SWE role like this — even one with graphics vibes — the technical portion usually looks like:

**1. LeetCode-style problem solving**
- Arrays, strings, hash maps
- BFS/DFS basics
- Simple DP sometimes
- Reasonable difficulty (easy → medium)
- Focus on clarity & thought process, not trick puzzles
    

**2. C++ fundamentals**

- Memory (stack vs heap, RAII, smart pointers)
    
- References vs pointers
    
- Copy vs move semantics
    
- Object lifetime
    
- Maybe very simple class design
    

**3. Concurrency basics**  
Not HPC-research level — but things like:
- What is a mutex?
    
- What is a race condition?
    
- What is deadlock?
    
- Why thread safety matters in real-time systems
    
- Maybe implement a thread-safe queue or explain how to
    

**4. Performance awareness**  
Real-time virtual worlds = latency matters.

Questions like:

- How do you avoid memory fragmentation?
- Why does cache locality matter?
    
- How would you profile bottlenecks?
    

Think high-level reasoning, not implement-a-lock-free-queue-from-scratch.



|Priority|Topic|Reason|
|---|---|---|
|⭐️⭐️⭐️⭐️⭐️|LeetCode easy/medium|Core SWE filter|
|⭐️⭐️⭐️⭐️|Modern C++ basics|Your selling point|
|⭐️⭐️⭐️⭐️|Memory & performance|Real-time systems fit|
|⭐️⭐️⭐️|Concurrency basics|Virtual worlds, networking|
|⭐️⭐️|High-level networking|Show curiosity about distributed systems|
|⭐️|Vulkan/graphics context|Only to add flavor, not main event|


Ah, yeah — “high performance” in software engineering isn’t just “oh cool I know threads!” 😄  
Multithreading and multiprocessing are _part_ of the story, but they’re just tools in the toolbox.

### ✅ What “high performance” _actually_ means

A high-performance engineer understands how to build systems that:

- **Use CPU, memory, I/O efficiently**
    
- **Scale gracefully** as load grows
    
- Handle **latency + throughput trade-offs**
    
- **Profile, measure, and optimize** bottlenecks
    
- Choose the **right algorithms & data structures**
    
- Understand **concurrency models** (not just “threads good”)
    
- Consider **caching, batching, vectorization, streaming**
    
- Work with **low-latency networking** or **high-throughput pipelines**
    
- Optimize **database queries, indexes, storage patterns**
    
- Think about **system architecture** (event-driven? async I/O? queueing?)
    
- Prioritize **observability + instrumentation** (metrics, tracing)
    

High performance could show up in areas like:

- High-freq trading systems (microseconds matter)
    
- Big data pipelines (GB/TB per minute)
    
- Real-time gaming engines
    
- ML model inference serving at scale
    
- Database/OS/kernel level work
    
- Even efficient frontend rendering & WASM work!
    

Threads are just _one chapter in a whole book_.

---

### ✅ If someone claims “I build high-performance systems” — you can test them by asking:

**Concepts**

- “How do you identify performance bottlenecks in a system?”
    
- “Explain the difference between concurrency and parallelism.”
    
- “When are threads _bad_?”
    
- “What’s the difference between latency and throughput?”
    
- “Memory vs CPU-bound workloads — how do you optimize each?”
    

**Tools**

- “What profilers or benchmarking tools have you used?”
    
- “How do you measure performance in prod? What metrics matter?”
    

**Trade-offs**

- “When would you choose async I/O over multithreading?”
    
- “Tell me about a time you made something _slower_ first to make it _scale better_.”
    

**System-thinking questions**

- “How would you design a high-throughput event processing system?”
    
- “How do you ensure performance stays good over time as traffic grows?”
    

---

### 💡 Bonus: code-level signals

A real performance-minded engineer talks about:

- O(N) vs O(N log N) thinking
    
- Cache locality, SIMD, vectorization
    
- Memory fragmentation, garbage collection behavior
    
- Lock-free data structures
    
- DB index strategy / query plans
    
- Batching / rate limiting / circuit breaking / prefetching
    
- Avoiding premature optimization (measure first!)
    

---

### 🎯 TL;DR

> High performance is about **designing, measuring, and optimizing systems for efficiency and scale**, not just “using threads.”

---

If you want, I can also:

🔍 give you a mock interview question set  
🚀 walk through a hands-on performance tuning example  
📚 point you to resources to master high-perf engineering

Just say the word 👀


## ⚙️ _“How do I build a high-performance C++ toy project?”_

Love this question. The secret is: **start tiny and learn by profiling + optimizing.**  
High-performance thinking is more about _how_ you build than _what_ you build.

Here’s a great baby-steps roadmap:

### ✅ Step 1: Choose a tiny real-time project

Good starters:

- Particle system (100k particles moving)
    
- Boids (flocking simulation)
    
- Simple physics sim (balls bouncing in 2D)
    
- Job system / thread pool mini-engine
    
- Small multiplayer demo (even just moving dots synced over network!)
    

These are _bite-size but performance-sensitive_.

Pick one and commit to “small but polished,” not big + abandoned.

### ✅ Step 2: Build baseline version

Write the simplest thing that works, even if slow.

### ✅ Step 3: Profile it

Use tools like:

- `perf` (Linux)
    
- Visual Studio profiler
    
- Tracy (super nice for game-style profiling)
    
- Renderdoc if it's graphical
    

Goal: **find actual bottlenecks, don’t guess.**

### ✅ Step 4: Optimize with purpose

Focus on learning:

- cache-friendly data layout (SoA vs AoS)
    
- avoiding unnecessary allocations
    
- minimizing locks / using lock-free structures where reasonable
    
- memory pools / arenas (basic version!!)
    
- threading work across cores
    
- using modern C++ (move semantics, RAII, smart pointers correctly)
    

Even improving FPS from 30 → 200 in a toy sim teaches so much.

### ✅ Step 5: Document what you learned

Recruiters love “I measured → I optimized → here’s the result.”

Even something like:

> Built a particle sim in C++.  
> Started at ~2 million updates/sec.  
> After profiling + data-oriented restructuring: 18 million updates/sec.

Looks like 🔥 on a CV.

### ⭐ Bonus idea:

If you sprinkle Vulkan later, you can turn your sim into a visual demo — but **start CPU-side first** to learn performance fundamentals.


- Basic networking
- Database basics
- Operating systems concepts

- Spatial data structures (octrees, quadtrees)
- Basic networking concepts
- Graph algorithms (since their metaverse involves connected worlds)
- Arrays, strings, linked lists
- Trees, BST, graphs
- Hash tables, heaps, stacks, queues
- Sorting, searching algorithms
- Time/space complexity


task synchronization


Process
An instance of a program that is being executed
if any error or memory leak in one process won't hurt execution of another process

Thread:
If one thread has memory leak,  then it can potentially affect the entire process



no shared clock
 no shared memory
 concurrency
 h
overlaying network, 

same computer same colick
no shared memory


distruted computing
building and establishing compyting models for distributed system: cloud c omputing

c


## Types of distributed system
scale: cluster computing and grid computing
cluster: management is centralized
homegeneous
high performance minimum  downtime

gri\d: management is decentralized
getrerogeneous and geographically disperrsed


Architecture model:
- layered model
- object-based model
- data-centered model
- event-based model

advantages of distributed system
- relaibility
- scalability
- fault tolerance
- increase performance

cons:
- very hard to detect failure
- redundancy
- inconsistency
- performance bottlenecks



pitfall: 
- the network is reliable and secure
- topology doesnt change
- zero latency
- 
- 











