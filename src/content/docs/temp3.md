---
title: temp3
---



## personal project:
Be ready to discuss your projects with pride and depth

> Tell me about a project you built — what did you do, why, what challenges, what would you change?
So don’t just say “I built a game.”  
Say “I solved X problem by doing Y, learned Z.”

## Leetcode:
- Practice coding problems (HackerRank / LeetCode)
 Strings, arrays, graphs, concurrency basics maybe




## Job knowledge

**Distributed system**
- - latency / bandwidth  tick rate, and synchronization mean  
- What is a distributed system?
- - Brush up on basic distributed systems ideas:
       - client–server vs peer-to-peer
    - real-time networking basics
- Know a bit about Unreal or multiplayer architectures (even high-level)
 What is latency and why does it matter in multiplayer worlds?
 - Client-server vs peer-to-peer basics
- What issues arise in real-time networked games?  
    (Lag, race conditions, synchronization, packet loss)
> Imagine thousands of players in one world — what are some engineering challenges?

- How does networking in games work? (high level)
- API design / building services
- Scalability basics
    ✅ **Real-world engineering questions**


**Developing**
- ~~unit testing~~
- ~~Version control (Git)~~
- ~~CI/CD,~~ ~~IDE mastery, automation~~
- Debugging scenarios
- Building backend services / APIs
- If C++: memory, performance, basics of threads
- game engine integrations (Unreal etc.)
 Learn basics of ECS (Entity Component System) if not already  
✅ Networking or systems thinking (lightweight)  



**C++**
- C++ fundamentals
- Memory/performance/low-level thinking
- Expect questions like:
- Memory management (stack vs heap)
- Smart pointers
- Move semantics
- Multithreading basics (mutex, race conditions)
- Data-oriented design / cache locality
- Low-latency programming patterns
- Review modern C++ concurrency  

**Graphic**
- Graphics/real-time pipeline awareness
> How would you optimise a real-time simulation loop?
- Check if you can bridge graphics + systems
    - They’ll want to see if you understand _why_ virtual worlds need scalable architecture even if you haven’t built it yet
You mentioned Vulkan, so they may ask:
- What is the role of Vulkan in rendering?
- What’s the difference between GPU & CPU workloads?
- Why is Vulkan good for high-performance rendering?
- How would you debug a performance bottleneck?
And _maybe_ game engine pipeline concepts:
- Frame pacing
- Draw calls
- Synchronization primitives in graphics
> Why do scalable servers matter even if you're focused on graphics?
> > How can rendering workloads affect networking latency in a virtual world?

> If the rendering side stalls or overloads the GPU/CPU, it can delay simulation and network updates, causing inconsistent player experience. Smooth graphics must complement real-time state syncing.
- A graphics/performance problem you solved
✅ Project discussion + why Vulkan is useful  







## General question:

> What excites you about virtual worlds?  
> What metaverse tech inspires you?
> - Think through why you want to work in immersive tech
> What do you know about what we do here at msquared


I am excited about this position is because it hits my interests area, I am very interested in graphic area, especially real-time rendering, online-experience and software development. Building virtual world combines these areas.


#### Introduce

Junyi -> start career as CG Generalist -> previously worked in Goodbye Kansas studios -> participated in films, tv series, cinematic game trailer -> whole CG build pipeline -> after years working -> vfx doesn't really match what I want to do -> more interested in tech -> back to uni -> interested in MSquared -> graphic related area, target high efficient large scale system -> love open metaverse idea, lead to web3 -> impact our social life

#### Why you choose not doing visual effects anymore:
There are two main reasons.  
First, through my years in VFX, I realized I’m naturally drawn to the technical side rather than the artistic one. I’ve always been curious about how things work behind the scenes — for example, I often explored how our procedural assets were built instead of just using the exposed parameters. That curiosity made me want to understand and build things myself.

Second, I wanted a career path where I could apply that technical curiosity more directly. The VFX industry is amazing in creativity, but it’s often structured as project-based service work. I’m looking for a more sustainable, product-focused environment where I can contribute to building technology that lasts and evolves.

So, moving toward a more technical role feels like a natural progression for me, not a departure.

I appreciate vfx -> but I realized I am naturally more drawn to technical side -> interested in things under the hood instead of pixels -> so career path more technical directed -> vfx is project based, and I am looking for a more product focused 

#### Talk about your project

**Why do this**

real-time vulkan render engine -> personal project, not school -> reason is want to build a software , practice one programming language, also curious about low-level computing, graphic programming -> vulkan manage resource manually 






This project is a real-time rendering engine I developed using Vulkan.  
There are two major reasons I started it is because I’m really interested in graphics programming and wanted to understand how rendering systems actually work under the hood.  
I also want to improve my software development skills — I learned how to structure a scalable, modular systems.

The engine has three main parts: an interactive system for the camera and UI, a precomputation system that generates lighting data, and a rendering system that handles all the drawing logic.  
I implemented physically based rendering with image-based lighting, and I also wrote a small framework around Vulkan to manage all the boilerplate code more easily.

It’s a long-term project for me, I treat it as a base engine where I can experiment and learn new rendering techniques or research ideas.  
Through this, I’ve learned a lot about low-level programming, debug and problem solving, and also how to design maintainable software.


I learned both technical and non-technical skills.  
Technically, I gained a deep understanding of how modern graphics APIs and real-time rendering work.  
On the software side, I improved a lot in writing clean, modular code and managing complexity.  
But most importantly, I learned how to keep pushing through steep learning curves — Vulkan was very challenging at first, but I really enjoyed figuring things out step by step.



**What is the biggest challenge you met**
- When I started developing my Vulkan rendering engine, I realized that most tutorials only explain how to use the API, not how to design a proper software architecture. A a result, my early versions has no clear module difference, and making the maintenance and expanding very difficult
- I researched open-source vulkan project s on the Reddit and Github, I investigated their module structure, trying to understand why they are designed in this way, how does data flow work. And after rebuild the whole architecture several times, I gradually figure out what I want tna dachieved a modular design that allow further extensions
- What I learned from this experience was not just about architecture itself, but how to analyze others’ complex code — to see what problems they were trying to solve and how they approached them. That helped me clarify my own design goals and figure out a better way to organize my code.


**For debug IBL**
**Challenge:** While implementing image-based lighting, I noticed strange dotted artifacts in reflections. The problem could come from many sources: shader code, surface normals, or incorrect mipmap levels.
**Action:** I compared my output with online examples, rewrote key shader parts with detailed comments, and enabled features incrementally to isolate the issue. I also visualized each mipmap level of the environment map to inspect where the artifact first appeared.
**Result / Learning:** Eventually, I found the problem was caused by a corrupted mipmap layer. This taught me that visualizing intermediate results, even if it increases storage cost, is essential for efficient debugging in graphics programming.






#### What do you know about what we do here at msquared

From what I understand, MSquared focuses on building the infrastructure for the open metaverse. So that creators are more flexible, they can build and own their worlds, not limited by any single company's platform.

MSquared has different product targeting on different use case. 
Your Morpheus platform targeting on agencies and brands, major feature is support thousands concurrent users in the high-end virtual events, which is very impressive. 

Your web world is targeting on the average users, creators, developers, the web world can be launched in the browser without worry about the os platform,  everyone can access it without login. Msquared is building an metaverse ecosystem, so you build the interoperability protocoal, Metaverse Markup language, this gave developers big freemdom  so developers can upload their own asset in the world, and define their own animation that presented in the web world.


I know the parent company, improbable has long history for providing the Massive Multiplayer online service. Previously you developed SpatialOS, and been used for supporting several games, like Mavericks, Worlds Adrift.. 


Imporbable provide the basic operation layer, msquared doing the ecosystem, build API which connect to the improbable's core technology


> This release brings one of MSquared’s key capabilities - real-time social presence - into the hands of developers. While Morpheus supports thousands of concurrent users in high-end virtual events, Web Worlds now gives creators a way to support hundreds of users in a browser, with no plugins, no installs, and full creative control.


agencies and brands, so they can easily create virtual world that they can used for hosting their events. For example, a virtual world for a car company that everyone can experience their car in the virtual world.
From the users (players) side, the service allows huge amount of online players join in the same virtual world, have interactions with minimum latency.
From client/agency side, they can bring the customised virtual world that fully align their needs in short time.
The company is not same as metaverse that unreal has, or roblox, it is not a online vr chatroom


Previous: spatialOS
Improbable support. Problem is too expensive





Msquared provide the network for the metaverse project The Otherside


#### Why you are interested in join Msquared

I am interested in MSqaured because the company is tacking some of the hardest technical problem of virtual workd. think what MSquared developing is the correct direction of metaverse and has huge potential. I have been following Improbable work for some time, previously improbable building the framework which based on Unity engine, but then experienced things like unity change the agreement and the released game cannot achieve stable cash flow, so they failed and improbable pivot the direction from game to social.

I believe this open metaverse ecosystem will shape how we interact socially, and will be the next phase of internet. I am curious about the technologies that make large-scale, real-time experiences possible — distributed systems, networking, and the infrastructure that connects users. I want to participate in building the system, understand how they scale, and learn how they’re built in practice, how to optimize and how to make things efficient.

I want to contribute to the engineering behind these experiences, learn how these systems operate at scale, and develop the skills needed to build efficient, reliable real-time platforms. This feels like a rare opportunity to learn from people who are genuinely pushing the boundaries of what’s possible.

What excites me about MSquared is that it feels much closer to that vision than many other so-called “metaverse” projects. MSquared is building an open, distributed ecosystem where creators truly own their worlds and users can interact across connected spaces — not just another closed platform or chat room.




My background in graphics programming (Vulkan and rendering pipelines) helps me understand performance constraints on the client side, and I’m eager to grow into someone who can also design and optimize the systems that make these massive shared worlds run smoothly. I believe this combination fits well with MSquared’s mission to make immersive, connected experiences accessible to everyone.

I know this distributed system virtual world is very heavy gpu consuming, and be expensive, I am very interested in optimize this task,

I think msquared is slowly reaching it. You have morpheus platform that allow massive multiplayer online come true, Also you have web world and Metaverse markup language that allow users fully customized their own world, from a long term, this will be part of every one social life, I am very interested in this technology. I want to know what kind of difficuties that developer met, 

Your web world is targeting on "creating  your individual world" concept

You have this metaverse markup language is also very cool, it allows user to create anything they want, can put in the customized objects, or create customized components, with this "just a browser", it can be used in many places.


I have the graphic background, I know how does world in the computer been build, but I am getting more and more interested in a more practical question, how virtual world been build and been made it access to many concurrent users. I think making the graphic available to many people and everyone can join together is the next phase of internet, instead of 
From my learning journey in the graphic, I am also developed interests in the high performance system.



Have you done distributed system project, if so , what did you do


**What you can bring to Msquared:**

1. softskill, deteminate
I am a determinant and persistent person, and I have strong self-motivation. First I was interested in AI because I see it impact the vfx industry, so I learn everything from math, because I want to fully understand how does these diffusion network work.
I have always wondering how does rendering engine really work, because it involves how GPU work, how does Vulkan API work, It is a steep learning curve, but I made it, and I have something to show.

2. Study ability
More, I think I have strong study ability, I know how to learn, these are experience from my long time self-learning. First, I am not passive learner. During my first master degree in vfx, because we don't have math lesson, and I was having some feeling that I will need to learn advance math, I spent my summer holiday on learning math, even I didn't have very obvious target back to that time. 
I have my own notebook system, I record the issue that I met and the concept that I am not clear in my notebook system

3. experience, familiar with graphic:

I think after developing my render engine, I am naturally care about the efficiency of the software, I have the awareness of the efficiecy of the software.
Since I have visual effects artist experience and graphic programming experience, I understand what users want, what is computational heavy in the scene, and what are the optimization methods could be. I know that the job probably not optimize the scene directly, because I saw you have job post hiring render engineer, and this probably would be their focus, but I believe understand these could help to build the infrastructure

I know that in the job description, you mentioned about unreal integration, I haven't learn the unreal engine yet, but I learn 3D software very fast, because in the vfx job, since I was a generalist, I need to use whatever that can achieve the result. all 3D software are not too far from each other and following the similar ideology, the major difference would be their goal, so it is not difficult for me to understand them.

for example when I do the concord project, we have a close up scene that need to see the ground crack, we cant use tecture for that since it is too close to the camera, so I have to use zbrush, which is a professional sculpting software, to do it, also high resolution geometry have different workflow compare to the average asset, since it can be too heavy on memory, there are some optimizaiton workflow that I have to follow. I achieve the goal in one week, I use online tutorial as the quick warmup, understanding the major tool and workflow. 



My understanding of graphic is helpful for building the system, rendering could be a heavy thing for many devices, find a way to optimize them is very crucial, my background in visual effects allow me to understand the limitation of rendering, since our asset usually is high details compare to game, I know the line

I always have awareness of how heavy is the scene with just a look, I beleive that could be useful when developing the distributed system.



> This release brings one of MSquared’s key capabilities - real-time social presence - into the hands of developers. While Morpheus supports thousands of concurrent users in high-end virtual events, Web Worlds now gives creators a way to support hundreds of users in a browser, with no plugins, no installs, and full creative control.
> https://msquared.io/blog/introducing-crowd-support-in-web-worlds





#### Question:

I am wondering roughly how many graduates you are looking to bring on this position.
Also roughly how many people in MSquared, what department you have, what is the company structure.

I am curious about the company's broader vision, do you think MSquared mainly focus on the brands or agency client, or have a plan in the near future to advertie or introduce web world  to more average developers and users?


what does the career path for someone in this role look like in MSquared?
 

From your experience, what kind of qualities or habits do the most successful people on your team usually have — what makes them stand out beyond just doing what’s expected?











What is Agile:
1. breaking down tasks
	> the project break down a list of tasks, such as design user interface, develop product details page
2. Sprints
	> normarly around 2-4 weeks,  each team choose to do certain task. Each team has their own team meeting, figure our how to achieve the task
3.  Daily stand-up meetings
	> no more than 15 minutes, each team member talked about what they have done yesterday, what they are going to do today, what issue they met etc.
4. Review and Retrospective
	> review meeting, each team discuss what they done good during the sprint, what can be adjusted and improve
5.  The next sprint
	> choose the next task and sprint






























   






6. **实现细节 (How)**
    
    - 你解决了哪些关键技术问题？
        
        - Vulkan setup & synchronization（Command buffers, Semaphores, Fences）
            
        - Descriptor sets & uniform buffer design
            
        - Memory allocation & staging buffer
            
        - Pipeline caching and layout design
            
        - Multithreading or render graph system（如果有）
            
7. **难点与挑战 (Problem-solving)**
    
    - 哪些地方最难？你是怎么debug或者优化的？
        
    - 举一两个你“卡了很久然后解决了”的技术点。
        
8. **成果 / 展示 / 性能 / 可扩展性 (Results)**
    
    - 实现了哪些效果？
        
    - 渲染性能怎么样？
        
    - 有没有 modularity、可扩展性、跨平台性？
        
9. **反思与未来改进 (What’s next)**
    
    - 你学到了什么？
        
    - 如果再做一次，会怎么改进？
        
    - 下一步计划是什么？（比如加上 deferred rendering / PBR / compute pipeline / RT）
        


你可以尝试逐个回答、整理思路：

1. 你为什么决定自己做一个 Vulkan engine？
    
2. 你的引擎整体架构是怎样的？模块划分？
    
3. 你的渲染循环（frame loop）是什么样的？
    
4. Vulkan 的初始化步骤有哪些？哪些最容易出错？
    
5. 你是怎么处理 GPU memory allocation 的？用了 VMA 吗？
    
6. 你的 descriptor set 是怎么组织的？动态 uniform buffer 怎么管理？
    
7. 你是怎么调试 Vulkan 的？
    
8. 你有没有实现某种渲染技术（forward / deferred / PBR / shadow mapping）？
    
9. 性能方面你做过什么优化？
    
10. 你最大的技术难点是什么？是怎么解决的？
    
11. 如果你要在这个引擎上实现 ray tracing 或 compute shader，会怎么设计接口？
    
12. 你觉得 Vulkan 相比 OpenGL 最难的部分是什么？你是怎么克服的？
    

---


Distributed system:
- computer operate concurrently
- computer fail independently
- computers do not share a global clock




latency when synchronization


Distributed system data flow: 
Object storage -> RabbitMQ -> consumer -> databse\ -> API server
首先用户上传文件，存储到object storage
 发消息给rabbitMQ是队列
 consumer拿到消息执行任务
 处理结果写入数据库
 api服务器提供接口给前段读取结果

|组件|作用|类比|
|---|---|---|
|**Object Storage（对象存储）**|存放大文件（图片、视频、文档等）。比如 AWS S3、阿里 OSS、MinIO。|云硬盘/网盘|
|**RabbitMQ（消息队列）**|临时保存“任务消息”，让后台慢慢处理。防止瞬时高并发压垮服务。|任务待办箱|
|**Consumer（消费者）**|后台进程，持续监听队列，有消息就拿出来处理。|机器人工人|
|**Database（数据库）**|存储结构化结果（比如任务状态、识别结果等）。|仓库/登记表|
|**API Server（接口服务器）**|提供统一的接口给前端或其他系统调用。|窗口/接待员|
假设没有这些组件，你就会：
- 用户一上传文件 → 后端立刻处理 → 数据库立刻写结果；
- 如果上传量太大，后端立刻“爆掉”。
    

而通过这种分层结构：
- **对象存储** 先保存文件；
- **消息队列** 缓冲任务；
- **消费者** 异步处理；
- **数据库 + API** 再慢慢暴露结果；  
    → 系统既抗压，又能水平扩展。


假设用户上传视频并希望获取转码结果：
1. **API Server** 收到上传请求，把视频存进 **Object Storage**；
2. 它往 **RabbitMQ** 里发一条消息（“请处理这个视频”）；
3. **Consumer**（后台进程）看到消息，就去下载文件处理；
4. 处理完把结果写进 **Database**；
5. 用户再次访问 **API Server** → 查询数据库 → 拿到结果。

What does scalable mean:
When the load increases, as long as we add more resources( machines, cpu or instances), the overall system performance can scale linearly or nearly linearly.


也就是说：
- 用户多了 → 你不需要重写代码；
- 只要多加几台机器，系统就能撑住。

e

|类型|解释|典型例子|
|---|---|---|
|**垂直扩展（Vertical Scaling / Scale Up）**|升级单机配置（更快 CPU、更大内存）|买更强的服务器|
|**水平扩展（Horizontal Scaling / Scale Out）**|增加机器数量（分布式部署）|增加节点、实例、容器|
















The major reason I do this project is because of I am interested in graphic programming and understand how to build a software. , first I can understand how to bring the data to the screen, second I can learn software development and low level programming. These are two main reason that I do the project.

My actual goal is make it as a long term project, the bottom logic of a vulkan render engine is I can show something on the screen, so it can be diverted into many idea later.
if I interested in some new research algorithm, I can implement it in my engine to use it. If I want to make it 
I feel building it can learn actual skills that can benefit me in the long term, so I choose to do the project.


The major modules are interactive system, rendering system and precompute system. Also there are Vulkan boilerplate like device, swapchain etc.

Interactive system responsible the lifecycle of ImGUI UI and interactive camera, we register the callback of GLFW window about mouse position, click, actions, to compute the corresponding projection and view matrix, so to  correctly updating the camera position.

The precompute system is responsible for pre-generate the data and textures for prefiltered environment map, irradiance map and BRDT LUT and save them on the disk. our input environment map will be compute here, automatically generate mipmaps and been used for computing diffuse and reflection in the fragment shader. The generation happen when the software launches, so during the runtime it just read the data, not generate it.

The rendering system is responsible for the major drawing logic. Here I upload the model and texture, and created the corresponding GPU resources, setup all vulkan needs, such as graphic pipeline, binding descriptors, 


I developed this Vulkan real time rendering engine, because I want to go deep understand the modern graphic api, and how does real-time rendering working, how to write PBR, how to construct a software.
I achieve the physically based rendering, driven by the metallic roughness workflow. Then I use Image-based lighting, I precompute the irradiance map and pre-filtered environment map via compute pipeline, for diffuse and specular shading.

Understanding Vulkan API is a steep learning curve. But it also rewarding, I have a strong aware of the low level manipulation, for example if I want to loading the texture, I need to load the data into CPU, then change the image layout, change the flag to make sure the GPU side can "see" it, then load them into GPU.

I have learnt more via this project, 
Also since Vulkan API require a lot boilerplate, so I have to write a lot of classes to wrap them, and I feel I have practice a lot of OOP programing through this






- **Architecture**
    - How is your engine structured? Do you have:
        - a **render graph**, or a sequence of hardcoded passes?
        - a **resource manager** for buffers, images, descriptor sets?
        - an ECS or scene graph? What data structures?
    - How do you handle **synchronization**: pipeline barriers, image layout transitions, CPU–GPU sync?
        
- **Memory & performance**
    - How do you manage GPU memory? Are you using `VMA` or hand-rolled allocators?
    - How many draw calls can you push at 60 FPS on your target GPU?
    - Did you profile GPU vs CPU? With what tools?
        
- **Correctness & maintainability**
    
    - Any **unit tests**? Regression tests (e.g. golden images)?
        
    - How do you structure your **CMake/build**?
        
    - Are there **debug layers** enabled? Validation error-free?
        
- **C++ level**
    - Which **C++ standard** (17/20)?
    - How do you handle ownership (RAII, smart pointers)?
    - Any use of templates, ranges, constexpr, etc.?


    
- Big gaps for a typical SWE/tech interview:
    
    - Almost **no mention of algorithms / data structures / complexity**.
        
    - No mention of **testing, CI/CD, code quality practices, design patterns**.
        
    - Your work experience bullets are **artist-focused**, not **engineering-focused**.
        
    - Some **typos and template garbage** that will annoy picky reviewers.
        

If I were screening you for a graphics/ML/engineer role, I’d still be interested, but I’d have a lot of questions.
 
---

 
2. **Modules list**  
    Currently:
    
    > Computer Programming, Computer Architecture and Networks, Database Systems, Software Engineering, Data Analytics, Security and Authentication. Auditing: Algorithms and Data Structure, Machine Learning.
    
    For a tech interview, I’d immediately ask:
    
    - Why are **Algorithms and Data Structures** only _audited_? Can you confidently solve:
        
        - time/space complexity questions,
        - common DS (trees, graphs, heaps, tries),
        - standard problems (two-pointer, DP, BFS/DFS, Dijkstra, etc.)?
    - What **projects** did you do in these courses? No mention. That’s a missed opportunity.
        Answer: these are auditing courses, I didn't do any project for these courses, but I practices leetcode (?)
    
    
- The snowstorm simulation sounds cool, but:
    - What tools / languages? Houdini-only? Any custom VEX/Python?
    - Any performance constraints, e.g. simulated N particles in T seconds?
    - Did you write any custom solvers or only used node-based setups?
---


This is the strongest part of your CV. This is where I, as a hiring manager, actually get interested — or completely lose interest — depending on how “real” these are.

### J-Renderer: Interactive Vulkan Engine

> Vulkan rendering engine from scratch in C++ … PBR, IBL, HDR skybox, ImGui, Arcball camera, dynamic rendering, MSAA, tangent-space normal mapping.

Strong content, but still too “feature-listy” and not “engineering-y”.

Brutal questions I’d ask you:

**Git**
What is PR



6. **Architecture**
What is the architecture of the project



- How is your engine structured? Do you have:
        - a **render graph**, or a sequence of hardcoded passes?
        - a **resource manager** for buffers, images, descriptor sets?
        - an ECS or scene graph? What data structures?
            
    - How do you handle **synchronization**: pipeline barriers, image layout transitions, CPU–GPU sync?
        
2. **Memory & performance**
    
    - How do you manage GPU memory? Are you using `VMA` or hand-rolled allocators?
hand rolled allocator
    gpu memory :
    JBuffer: 
	    - create vk buffer info, tell the size, and usage, create the vkbuffer
	    - memory requirement checking, what does this buffer need what requirement (what gpu memory type)


from buffer, understand what gpu memory type
then find memory type index by , findMemoryType, input memory property, physical device, get memory properties from physical device, and see if match with the input memory property

buffer usage: transfer source or transfer destination etc
memory property: host coherent or host visible or device local




**What is MSAA and how to use MSAA here**
multi-sample anti-anallising



**what is difference between use 3 frames in flight and one frame in flight**




**为什么要对齐？layout transition的原因是什么？**
1. 为什么要对齐（alignment）？**
因为 GPU 访问内存有硬件对齐要求。
- UBO/SSBO 有最小对齐粒度（比如 256 bytes）
- Image row pitch 有对齐
- Buffer copy 也有对齐
如果不按对齐要求分配或访问内存，GPU 无法正确加载数据，会导致性能下降甚至 undefined behavior。
本质：硬件只能按照特定块大小读取内存，所以资源必须按对齐创建。



How many draw calls can you push at 60 FPS on your target GPU?
        
    - Did you profile GPU vs CPU? With what tools?
        
3. **Correctness & maintainability**
    
    - Any **unit tests**? Regression tests (e.g. golden images)?
        
    - How do you structure your **CMake/build**?
        
    - Are there **debug layers** enabled? Validation error-free?
        
4. **C++ level**
    
    - Which **C++ standard** (17/20)?
        
    - How do you handle ownership (RAII, smart pointers)?
        
    - Any use of templates, ranges, constexpr, etc.?
        

**Resume improvements:**

Right now:

> The engine features Physically Based Shading, Image Based Lighting, HDR skybox…

Consider adding _impact_ and _tech detail_:

- “~X lines of modern C++ (C++20) with RAII-based resource management and a minimal render-graph abstraction over Vulkan pipelines.”
    
- “Achieves 120 FPS rendering of scenes with ~Y objects / Z draw calls on [GPU] at 1080p.”
    
- “Implemented GPU resource allocator and descriptor set cache to minimize reallocations.”
    

### Stable PBR Texture Extraction on Shiny Surfaces with Nvdiffrec

> Modified Nvdiffrec’s material optimization by splitting it into two branches with different learning rates and loss functions…

This sounds really interesting, but it’s too vague for a technical reviewer.

Questions:

1. **Math / loss design**
    
    - What exactly are the **two branches** optimizing? Which parameters where?
        
    - What loss functions did you use? (L1, L2, perceptual, regularization?)
        
    - How did you choose different learning rates, and why?
        
2. **Results**
    
    - How did you measure “more stable texture recovery”? PSNR / SSIM / LPIPS? Qualitative only?
        
    - On how many scenes / samples? Any metrics you can quote?
        
3. **Engineering**
    
    - Framework: PyTorch? JAX? Native CUDA?
        use pytorch

    - Did you refactor Nvdiffrec code or hack on top? Any PRs upstream?
        

**Resume improvements:**

Add something like:

- “Implemented dual-branch optimization of basecolor/roughness using PyTorch, reducing flickering artifacts on shiny surfaces by ~X% (measured via Y metric) on a dataset of Z scenes.”
    
- “Refactored Nvdiffrec’s material pipeline to modularize loss terms and support experiment configuration via YAML/JSON.”
    

### Beauty2Albedo (Stable Diffusion)

> Fine-tune the Stable Diffusion model to predict Albedo maps from Beauty renders by modifying the UNet component.

Again, good concept, but no scale/details.

Questions:

1. **Dataset**
    
    - How many image pairs? What resolution?
        
    - How did you generate the dataset? From your own renders or a public dataset?
        
2. **Training**
    
    - Which SD version (1.5, 2.1, SDXL)?
        
    - Training duration, GPU, batch size?
        
    - Any tricks: LR schedule, EMA, mixed precision?
        
3. **Engineering**
    
    - How is the code structured? Module layout? Config system?
        
    - Any evaluation metrics? Baselines you compared to?
        
    - Did you build a small inference UI / CLI?
        

**Resume improvements:**

- Add scale + tools: “Trained on ~NK image pairs at 512×512 using PyTorch and xFormers on a single RTX 4090, achieving [metric or qualitative improvement claim].”
    
- Mention modifications specifically: “Injected skip-connection residual blocks in U-Net mid-block to better preserve spatial structure of underlying albedo.”
    

---

## Work Experience – Goodbye Kansas Studios

Title: **“Generalist Artist / Envrionment Artist”**  
→ “Envrionment” is a typo. For a picky engineer, a typo in your title is a big “do you check your own work?” flag. Fix this immediately.

Overall issue: This section reads like **artist CV**, not **engineer/problem-solver** CV. For a tech interview, I would ask:

> “Where is the _coding_? Where is the _automation_, _tools_, _scripts_? What did _you_ build that saved the team time or enabled something new?”

Let’s go bullet by bullet.

 Bullet 1

> Managed the assembly and layout of 3 main/complex 3D environments… including assets modelling, texturing, look development…

Questions:

- “Managed” means what? You led other artists, or you personally did most of the work?
    
- Did you write any **tools/scripts** to help layout, scattering, or asset management? Houdini[[#Bullet 3]] digital assets? Python for USD?
    
- Any **quantifiable** outcome: reduced environment build time by X%, handled scenes with Y million polys?
    

Resume improvement:  
Make it clearer what your engineering-ish contributions were:

- “Built and maintained 3 hero USD environments for cinematics, using Houdini + USD; created Python tools for asset layout and scatter that reduced manual dressing time by ~30% for a team of 6 artists.”
    

(Only put the percentage if it’s not made up.)

Bullet 2

> Achieved building high quality CG set extension for 6 shows, utilized on-set data like Lidar scans and HDRI…

Questions:

- What’s “high quality”? Did supervisors re-use your setups across multiple shows?
    
- Any processing of **Lidar data** using scripts? Automation for alignment, cleaning, decimation?
    
- What tools and data formats (e.g. Alembic, USD, custom)? Any optimization for render times?
    

Resume improvement:

- Add tech and process: “Processed Lidar scans (X–Y points each) and HDRI data to build physically plausible set extensions in Houdini and USD, optimizing geometry and textures to keep render times under Z min/frame in [renderer].”
    

Bullet 3

> Closely collaborated with multi-disciplinary teams and supervisors. Participated in 1-2 daily review meetings…

This is fine but generic. For SWE, we’d rather see:

- When did you **push back** on unrealistic requests?
    
- Did you **clarify requirements**, or **redefine scope** to fit deadlines?
    
- Any examples where you proposed a technical solution instead of brute-force manual work?
    

Consider compressing this into one sentence and using the space for more technical content.

Bullet 4

> Refined and up-scaled models and textures from external vendors. Efficiently created and updated automated assets for team use, and integrating them into pipelines(USD).

This is the first bullet that hints at **automation**, which is gold for your SWE story.

Questions:

- What do you mean by “automated assets”?
    
    - Houdini digital assets? Python tools that auto-generate things from parameters?
        
    - Templates in USD that auto-wire shading?
        
- What **languages/tools** did you use? Python, VEX, USD API, command line?
    
- Did you reduce some process from hours to minutes? How many artists used your assets?
    

Resume improvement:

Turn this into a clear engineering bullet, e.g.:

- “Developed Python tools and USD-based procedural assets to standardize vendor geometry and materials, cutting per-shot asset clean-up from ~2 hours to ~20 minutes across N artists.”
    

Bullet 5

> Reflected promptly to changes from upstream departments…

This sentence is a bit awkward (“reflected promptly” is unusual wording).

Questions:

- Did you just react quickly, or did you build **robust, non-brittle setups** so changes propagated automatically?
    
- Any examples where your pipeline design made a late change easy instead of catastrophic?
    

Resume improvement:

- “Designed non-destructive Houdini/USD workflows so that late upstream changes (animation, layout) propagated automatically to lighting/compositing, avoiding manual rework on N+ shots.”
    

Projects list & showreel link

Good to have these; just make sure:

- The password for the showreel is not something silly (it currently is “123456” → this looks unprofessional; use something neutral or remove password if not needed).
    
- If possible, highlight **one or two projects** where your tech contributions were strongest and be ready to talk in depth about them.
    

---

## Skills

> C++, Python, Linux, Git  
> VFX: Houdini, USD, VEX, Maya, Substance, Nuke, etc.

For a tech interview, this is too shallow. As a picky senior:

Questions:

1. C++
    
    - What level? Can you:
        
        - Explain move semantics, RAII, value vs reference semantics?
            
        - Use smart pointers correctly (unique_ptr/shared_ptr/weak_ptr)?
            
        - Discuss O(…) complexity and memory of your data structures?
            
    - Any familiarity with STL (vector, unordered_map, algorithms), or more advanced parts (ranges, coroutines)?
        
2. Python
    
    - Mostly scripting inside Houdini/Maya/Nuke, or also standalone apps?
        
    - Any use of:
        
        - PyTorch/TensorFlow,
            
        - packaging, virtualenv/poetry,
            
        - testing (pytest), logging?
            
3. Linux
    
    - Daily driver? Comfortable with shell, SSH, basic debugging (strace, gdb) or just “I used it at work”?
        
4. Git
    
    - Just basic commit/pull/push, or branching strategies, code review, resolving conflicts, bisect?
        
5. Missing but implied skills:
    
    - GLSL/HLSL or shader languages (you do PBR rendering; surely you write shaders).
        
    - CUDA / GPU compute? Any?
        
    - PyTorch for the ML projects.
        
    - Build systems (CMake, Ninja).
        

**Resume improvements:**

Make this more structured and tailored towards engineering roles:

- **Languages:** C++ (C++20, strong), Python, GLSL, VEX
    
- **Core:** Algorithms & Data Structures (self-study + interview prep), OOP, multithreading basics
    
- **Graphics:** Vulkan, PBR shading, IBL, HDR, GPU profiling
    
- **ML:** PyTorch, Stable Diffusion fine-tuning, Nvdiffrec
    
- **Tools:** Linux, Git, CMake, Houdini, USD, Maya, Nuke, etc.
    

(Only list “Algorithms & Data Structures” if you’ve actually done serious prep.)

---

  
## What I’d expect you to be asked (and you should prep for)

Here are concrete, adversarial questions I’d ask in an interview based on your CV:

### On J-Renderer

- Walk me through your **rendering pipeline** from CPU scene representation to pixels on screen.
    
- How do you handle **swapchain recreation** on window resize?
    
- How do you manage **descriptor sets** for materials? What happens when you have thousands of objects?
    
- Show me a bug you hit related to Vulkan synchronization and how you debugged it.
    
- How would you refactor your engine if you wanted to add **deferred rendering** or **shadow mapping**?
    

### On Nvdiffrec / Beauty2Albedo

- How did you **split the optimization branches** in Nvdiffrec? What parameters did each branch optimize?
    
- What was your **training loop** for Beauty2Albedo? Show pseudo-code.
I ran for 8k iterations, 
    
- How do you avoid **overfitting** when fine-tuning Stable Diffusion on a relatively small dataset?
    
- Explain your **loss functions** and why they are appropriate for texture/albedo recovery.
    

 

### On fundamentals

Because your CV doesn’t clearly show it, they _will_ test:

- Time/space complexity of common algorithms.
    
- Implementing basic DS (linked list, stack, queue, binary tree) on the whiteboard / online editor.
    
- Graph traversals (BFS/DFS), maybe simple shortest path.
    
- Maybe simple DP problems.
    

Make sure you do **some LeetCode-style practice tonight** (even 5–10 problems is better than none) and review:

- Big-O of arrays, vectors, maps, sets.
    
- Common patterns: two-pointer, sliding window, sorting + greedy, BFS/DFS.
    

---

## Priority fixes for _tomorrow_

If you only have limited time before your interview, I’d do this in order:

1. **Fix glaring issues in the resume**
    
    - Typos (“Envrionment”).
        
    - Remove the template garbage/extra links at bottom.
        
    - Clean showreel password (or remove password).
        
    - Tighten Skills section to be more engineer-focused.
        
2. **Add 1–2 sentences per project to show impact + scale**
    
    - J-Renderer: mention C++ version, lines of code (rough), FPS/scene scale, tests or tools.
        
    - Nvdiffrec / Beauty2Albedo: mention dataset size, framework (PyTorch), at least one metric or clear improvement statement.
        
3. **Prepare stories for:**
    
    - One tool/automation you built at Goodbye Kansas.
        
    - One big debugging/optimization story from J-Renderer or Nvdiffrec.
        
    - One example where you took initiative to improve a process.
        
4. **Do a quick algorithms refresh**
    
    - Rehearse verbally how you’d explain BFS/DFS, binary search, hashing.
        
    - Do a couple of easy/medium problems.
        

---





JRenderApp initialize JWindow, JDevice and renderer 

Renderer: 
- create swapchain
- create a vector of JSync:  sync objs
- create a vector of JcommandBuffer



Device:
- create Instance





---
debug
multiple descriptor pool
expectation: Only one descriptor pool created and shared across the whole software
Debug: through gdb debug, 
`break JDescriptorWriter::JDescriptorWriter` then realize there are actually two descriptor pool (been called three times, and one of them , the descriptor pool has different memory address)

---

# Project details





- “项目里遇到最大的技术挑战是什么？”
    
- **how would you deal with intermittent hard to reproduce issue?**
	- Check the environment, isolate the environment
	- Check 
	- then Try to reproduce the issue by myself
	- 
    
- “你当时考虑过哪些方案？为什么选择了最终方案？”
    
- “如果现在再做一次，你会怎么改进？”
    

👉 **目的：理解你的思维方式是否成熟、是否会独立解决问题。**

---

## **3. 你是否能在他们的团队里工作得顺畅？**

这包含协作、沟通、态度。

因此会问：

- What if disagree with teammate (“你和队友意见不一致怎么办？”)
	- I will first make sure I fully understand their perspective, then I will explain my reasoning by using data or existed examples. 
	- If we still disagree, I would suggest that we run a quick test or prototype, and we will check the result together, and find the right decsion.
	- If we need the decision fast, I will ask lead or senior engineer for suggestions or direction.
	- The goal is always solve the problem, and focus on that
    
- “有没有遇到 deadline 很紧的情况？你怎么应对？”
    
- “你和 senior engineer 的合作方式是什么？”
	- I collaborate with senior engineers by being clear about what I am working on, asking questions early when I'm stuck, and actively seeking feedback on my approach.
	- I try to understand their design choices and learn the reasoning behind them.
	- The goal is build things effectively while learning from their experience.
    
- What kind of engineering culture do you like ? (“你最喜欢怎样的工程文化？”)
	- I like the culture that  values collaboration, clear communication and learning.
	- I appreciate teams where people give constructive feedback through code reviews, share knowledge openly and help each other grow.
	- I also like document the project and issues that encounter.
    



    

- “你最自豪的项目是什么？”
I am very proud of my Vulkan Engine, because of Vulkan API's learning curve is very steep, and I finally manage to build the whole software and able to actually render something. 
    
- “你遇到最失败的项目是什么？学到了什么？”
The concord game trailer project. It is a huge project, but the outcome is not very satisfying. What I learnt is that, no matter which position I am, I must have strong ownership mindset. In this project, I been 

    
- “你什么时候意识到自己错了？怎么处理的？”
When I doing my research project, 
    




# **1. Motivation & Role Fit**

These are almost guaranteed:


    
- **Why do you want to transition from VFX/CG to software engineering?**
I realized what I enjoy in the VFX wasn't artistic side, but I become more and more interested in the technical problem-solving,  I am more interested in how things working under the hood, how the pipeline built, and how the process could be automated.
I was starting to build some small tools and procedural assets for the team, such as the procedural grass, procedural generate organic paper etc. I also helped my colleague to debug render or pipeline specific issues, such as their asset cannot be publish to the pipeline, when change the render engine, the material result doesn't remain the same, etc. I enjoy thinking in systems, and I think that naturally pushed me toward computer science.





- **Tell me about a technical project you’re proud of (e.g., Vulkan engine, Nvdiffrec modification). What were the hardest parts?**
The hardest part for Vulkan engine is the architecture. I want to make a modular system that I can expand in the future, so at the begining after I finished the official tutorial, I was checking the way that make the architecture more modular, I research open-source project, trying to understand other's design reasoning and think about what I can learn from that logic. However since this is a exploring process, there were many times I need to keep changing. For example, at the beginning I write all classes that follows OOP but only cover objects such as material, textures etc. Then after I want to introduce GUI interface, I realize I have to separate the system, area that focus on interactive like ImGUI and camera will be one system, rendering logic should be collect in one etc.
Now after the project is expanding, I realize I will need more, like resource management, scene graph  etc.
    
- **What is the most complex system you’ve built? How did you design it?**
    
- **What’s your experience with C++?**  
    They might follow up with:
    
    - memory management
	    - I followed RAII design pattern, the class usually comes with destructor, since Vulkan API 
	    - During the developing, I debugged many memory leaks using vulkan's validation layers, and fixed the issues like I didn't free the vulkan resources in the destructor.
	    - 
        
    - performance optimisations

        
    - threading/concurrency basics
        
- **How comfortable are you with Python?**
    
- **What’s the most challenging debugging issue you’ve faced recently?**
    
- **What’s your experience with distributed systems or real-time pipelines?**  
    (Even from your VFX USD pipeline work.)
    

---

# **3. Software Engineering Practices**
 
Your VFX background gives you strong teamwork stories—they will want to test that:

- **Tell me about a time you collaborated under pressure or tight deadlines.**
	
- **How do you handle feedback?**
    
- **Describe a situation where different teams had conflicting requirements. What did you do?**
    
- **Tell me about a miscommunication in a technical project. How did you fix it?**
    

---

**5. Your Experience in VFX and How It Translates**

- **How has your experience with USD, Houdini, or CG pipelines prepared you for systems engineering?**


- **What did you learn from building CG environments that applies to large-scale software?**
They all follow similar development process like agile development. The major difference is that in software engineering, the development could be more flexible.

- **How did you deal with performance bottlenecks in VFX workflows?**





 **6. Culture & Growth Potential**

- **What new technology or topic have you explored recently?**
The new technology I explored recently is the quantum computing from 2025 siggraph. There is a talk about Quantum computing.
    
- **How do you stay up-to-date with engineering best practices?**
I would bookmark the technical blogs (through my life), and follow up those blogs. I also pay attention to the conference such as siggraph, on these conferences I can get to know more new things.
    
- **What are your long-term goals in the field of virtual worlds or platform software?**
As the person who build the platform, I will be the person who also use it, I want to try to target on specific group of people, and I will use the technique to build a project that fit their preferences, also recording the case-specific tutorial to help more people learn how to use it, and show the actual, beautiful, useful result. 
    
- **What makes you stand out from other graduate engineers?**
I have the production-level VFX experience, I know what users want.
    

---

# **7. Specific Questions They'll Likely Ask _You_ Given Your CV**

These are tailored to your actual experience:

- **Your Vulkan engine project: what architectural decisions did you make and why?**  
    (They will dig into this—it shows systems-level thinking.)
    
- **You modified Nvdiffrec: what problem were you solving, and what did you change in the optimisation loop?**
    
- **How did you manage team coordination at Goodbye Kansas when delivering complex environments?**
    
- **What is one technical achievement from your VFX career that demonstrates engineering ability?**
    
- **How do you compare building CG pipelines vs. software systems?**
    

---

# **8. Questions They May Ask Toward the End**

These are typical closing questions:

- **What do you expect from your mentor or team?**


- **How do you like to receive feedback?**
I would like constructive feedback, it would be even better if there are specific examples that can be referenced.
    

---
5## Questions
1. What kind of candidates would be the best for this role, what kind of people doing great on this role.
2. What is the career path, like people you see are doing what directions
3. What are some of the most interesting and impressive career paths you have seen from people who started in this position?
4. would you like to tell me about the structure about the team and whom I will be working with 
5. I am wondering if this role is new headcount or backfill?




**What is your understanding of a technical assistant? Do you know what does Technical assistant do?**
- what I will do is support artists when they meet technical difficulties, set up anything that artists need to do their magic. like loading plates, restoring the old work, archive all works.
- Monitoring and manage the render farm, re-piorities the renders. 
- Sometimes build automation tools to improve the efficiency of the pipeline
- As I understand, this is an entry level job for the technical role of visual effects industry


**Introduce:**
Junyi -> start career as CG Generalist -> previously worked in Goodbye Kansas studios -> participated in films, tv series, cinematic game trailer -> after years working -> being artist doesn't really match what I want to do -> 
I am more interested in tech, how to automate stuff, how everything works under the hood, why my render is slow, can I make it better? what is the latest trend of machine learning and AI stuff that happen to visual effects, can those things make vfx more productive?
-> back to uni learn cs -> I learned more advanced math, learn from statistics to all components of stable diffusion model -> fine tune stable diffusion from code, from here I start able to read paper 
->  modify nvdiffrec framework understand differentiable rendering, actually bring in my own ideas and trying to build solutions ->
build my own vulkan engine using C++, on the one hand understand how does rendering work, what can make the render slow, on the other hand this gives me a solid software development experience, I am able to write unit test,  debug, profiling to see what is strange, using Jira to track the progress etc
-> I also use python build a HDRI browser in Houdini recently, this is not shown on the cv that you have now. Build in HDRI browser in Houdini, artist can directly view HDRI and import them houdini directly with one click or drag and drop.
-> I really enjoy the technical side of visual effects, and I saw this position post, and I feel I could be a good fit for this role. Since I want to develop technical skills in VFX direction, ILM is the top company in this area. Also, since I was an artist previously, I am very familiar with the visual effects pipeline and I fully understand what artist want, what do they care,




**How do you see yourself in 5 years**

In general, I would want to focus on the technical solution for VFX industry, I will be expert on the technical details of vfx production. 
I think I will specialize in the pipeline and also do some research work, because since I do nvdiffrec project, I feel if I can refine this method and make it a useful tool, we can create digital double more accurately, because it output the separate texture layers.

If we breakdown, 
In next one or two years, I would see myself mastering the core responsibility of the technical assistant role, and I would be a reliable person that can troubleshoot complex issues across different department. 

After that, maybe I will shift to the pipeline team and build the production tools.

Grow deep in technical,

1.  I would see myself as an top expert focus on technical solution in VFX area, the potential career path would become a pipeline td, this could change because the techniques nowadays is developing extremely fast. I am very open to any opportunites as long as it is the tech side of this industry.
2. Develop pipeline for the specific show, fix technical issues.
3. Be more practical, I aiming to spot the issues that vfx artist or vfx studios have, and write tools or software to help them, or integrate the latest techniques. or even possible I wish I can publish paper.  
4. I will see myself still a strong learner after 5 years,  I will stay open-minded and continue embracing new techniques.


**Talk about your project**

**What tool you have done**
During my time in Goodbye kansas studios, I did many HDA procedural assets, for example the procedural pipes, procedural planet, organic assets
I also write some simple vex script to control normal or tangent direction. Simple python script for saving nodes, and recreate them.
After I practice the programming skills, I did bigger project, several weeks ago I made a HDRI browser in the Houdini

**What is your weakness:**
Sometimes I get very drawn into technical details, and spend too long time on it. I've become much more aware of this, so I have started structuring my work more deliberately. I break tasks down in  Jira  and use sprint style approach to keep myself focused on milestones. If I find something that I want to investigate further, I tag it and schedule it for later. 


Collection of other peoples jd:
- Troubleshooting and dynamic problem solving for layout, animation, lighting and post-production workflows.  
- Image/Media handling, including conversion, manipulation, quality control and playback for visual reviews.  
- Render troubleshooting and queue management.

- Data management and render wrangling/support for shows in production which involved:  
a. Overseeing incoming/outgoing data to and from the studio  
b. Ensuring the smooth and correct ingestion of plates through the pipeline, as well as  
supporting the process technically  
c. Making decisions to ensure the best utilization of the render farm  
d. Collecting overnight render stats and compiling morning reports to communicate back to the Senior Producers  
- Hands-on troubleshooting shot issues with in-house tools and workflows/processes, requiring continuous communication with artists and Production  
- Responsible for maintaining and further developing pipeline/department scripts/tools, as well as updating the show’s pipeline setup, along with the documentation needed for those tools

(level up)
- Started taking over more challenging pipeline tasks  
- Frequent communication with CG and Comp Supervisors  
- Became a member of the show setup team:  
a. Interpret and implement on the pipeline the client’s requests on the provided Technical Spec Sheet  
b. Better understanding of image processing/science and colour  
- More managerial responsibilities within the department - acting for the Data Manager in their absence  
- Involved in the forecasting of the rendering and data activity for the shows in production at the beginning of each week that involved making important decisions  
- Coordinating the archiving of a show once completed  
- Became a member of the interviewing panel for new hires, and was part of the decision making process that followed up each interview. Then offered daily and continuous training and assistance for new hires on the in-house tools and workflows



git merge:
git checkout main : go to the main branch
git merge feature: merge the feature branch into the main  branch




 **2. Linux/Unix 能力**

80% 的技术问题都跟 Linux 文件系统、权限、环境变量相关。常见面试题：
- 如何用命令找出一个目录占用磁盘最多的文件？
- 如何查看一个进程的 CPU/RAM？
- 如何判断网络连通性（如渲染节点无法访问存储）？
- 如何查看一个 Python 脚本为什么跑不起来？
    

---

 **3. Python/Shell 脚本 & 自动化**

TA 要经常写小脚本解决问题，因此测试：
- Python 基础语法
- 怎样读取、写入大量文件
- 批量文件重命名脚本
- 解析 log、搜集统计数据
- 如何定期检查磁盘、自动清理缓存


    
 **5. 图像处理 & 视频基础知识**

因为 JD 提到 image/media handling，常出现：
- EXR、MOV、DPX 的区别？
	- exr is image sequence, linear, 16-bit or 32-bit, multiple compress method, multiple channels/layers
	- dpx: also image sequence, for color grading and storage (store the **scanning from films**), 10bit or 16 bit, usually log and uncompressed
	- mov: contained, rely on codec, 8-bit to 12/16-bit
    
- 色彩空间（sRGB、ACES）的基本概念
	- SRGB, the most common colorspace, relatively small color gamut, use gamma2.2, so allow images show on LDR monitor.
		- Cons: cannot save high saturation and high luminance information.
	- ACES: Academy color encoding system. Big color gamut, use 16-bit or 32-bit. You need to understand what colorspace is your file, so you can view it correctly
	- OCIO: (OpenColorIO): load aces or curstomized configurations, make sure all software and artists are working under the same settings
	- LUT: viewing transform. Allow users are seeing the correct output, but data itself not change
	- VFX always follow linear workflow. All filmed data need to convert to linear colorspace
	- CG renders need to be set as linear(exr)
	  
    
- 帧率问题
    
- 用什么工具检查 metadata（OIIO、ffmpeg）
-

**OpenImageIO:** 

`iinfo -v xxx.exr`: Get general information of exr
> channels, data format, software



The reason to check is for Quality control(QC)
- **Color integrity**: for files are being marked as Log is not mistakenly treated as Linear.
- **Continuity**: verify that timecodes and frame numbering are sequential and match editorial logs, preventing expensive reshoots or re-render
- **Debug/Troubleshooting**: if shot looks wrong, maybe can find something in here




Use the `ffprobe` utility, which is included with FFmpeg, with the `-show_format` and `-show_streams` options.

`ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,avg_frame_rate:format=duration,bit_rate,tags -of default=noprint_wrappers=1 input_video.mov`

| **Output Section**     | **Data You Check**                        | **Why You Check It**                                                                 |
| ---------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| **`codec_name`**       | ProRes, H.264, etc.                       | Ensures the correct codec was used for delivery.                                     |
| **`avg_frame_rate`**   | $24/1$ (24 fps), $30000/1001$ (29.97 fps) | Verifies timing is correct and consistent with project standards.                    |
| **`tags:timecode`**    | Timecode value.                           | Essential for syncing video with editorial and audio tracks.                         |
| **`tags:color_space`** | Rec.709, BT.2020, etc.                    | Provides a high-level check, but often **not** the deep color data (see OIIO below). |


**Imagine artist report the local workstation not working same as renderfarm**
1. confirm that I receive this report and I am starting the investigation
2. Ask for the file (local workstation) and job ID on the farm, exactly which frame is failed
3. **env:** The mismatch of local software version and farm software version? 
4. **linking issue:** Path different? (maybe not the same network mount, absolute or relative path )  license issue?
5. manually launch a small, single frame test job under the same submission script, if work, linking/data-specific issue, if not work, env issue

**env:**
- File permission/mounting
- plugin missing?
- system difference?

**data-specific**:
- data corruption?
- if it is frame specific issue, I will isolate those frames and see what unique elements are there

```bash
rsync -av source/ dest/
```



✔ tail log 查渲染进度

```bash
tail -f /var/log/render.log
```





---

 ▶ **权限相关**

```bash
chmod
chown
chgrp
stat
umask
```

很多艺术家无法写入、渲染失败就是权限问题。

---

 ▶ **进程/性能排查**

```bash
top
htop
ps aux
kill -9
nice
renice
```

用于：
- 查看 Maya、Nuke 卡死
    - 渲染节点 CPU 负载是否正常
    - 判断是否因内存不足导致失败
    

 ▶ **网络和挂载问题**

```bash
ping
traceroute
mount
umount
df -h | grep nfs
```

用于：
- 渲染节点无法访问素材
- NFS 存储掉线
- 检查挂载点是否挂死
    
 ▶ **环境变量（Pipeline 核心）**

```bash
printenv
env
export
source
which maya
```

Pipeline 出问题，有一半是 **环境变量错了**。

Check env path:
`echo $PATH`

Add new path to PATH:
`nano ~/.bashrc` 
`export PATH=$PATH:/opt/mytools/bin`  (if only do  this in the terminal, it is temporary)
`source ~/.bashrc` reload your shell (added new path permanently)




```bash
tail -f /path/to/log
grep -R "error" .
less
```

---
- `oiiotool`（OpenImageIO，EXR/图像处理）
- `ffmpeg`（视频工具）

- “如何用命令行把 EXR 转成 JPG？”   
`oiiotool input.exr -o output.jpg`
`oiiotool input.exr --quality 95 -o output.jpg`
`oiiotool *.exr -o %04d.jpg`

    




**Why you transfer from art to tech**
For the long time, I realize everytime when I approaching an issue, my brain is wired for logic and system

While working as an artist, I realized that my approach to creating shots was a bit different from others. I always want to find a way to build the system or build 
therefore I like building the procedural asset or tools
 I am always interested in things under the hood
 

For example, we started a project, and start with a very simple task, pipe. 


basically some kind of thinking like this, but it actually not sound verynice, it can give a vibe that I am not good with my old job so I want to try something new. no emplyer want to hear that

I am still in vfx industry, just change from artist job to technical side of vfx job, like technical assistant pipeline td 


What is your motivation for this role


**What is your motivation for ILM**
**Why do you want to join ILM**

I want to join because ILM producing high-end visual effects, and this is where hardest problems are, and I would be very happy to challenge myself and solve difficult problems.

Also, with Disney Research behind it I think ILM is the place where new techniques are implemented, I want to see first hand how these advanced technologies are integrated into the production.



**Why do you think you fit**
1. I was an artist, I have the real production experience that I can see issues in the shot
2.  I am not afraid of difficulties and I welcome challenges. Harder tasks usually come with greater rewards 
3. I consider myself very strong self-study ability, I always make notes, I have my own notebook system, 
4. I have strong passion for visual effects



**Do self introduction again:**
Except the part that we have discussed last time, I think maybe this time we can go deeper into the 



Elaborate more on the technical side:


**The most difficult task in the previous work:**
In a previous project, I need to create a big corn field, the camera was first follow the main character, and then gradually increase the height to see the whole scene. So first we found some detailed corn model, and I procedural modeled leaves and the stem, and put back them together, so I can have many different variant of individual corns, then I did the similar thing on the weed on the root,. Also, consider that naturally, each corn has different spread of its weed on the ground, and they usually keep distance from each other, the simple scattering corn positions will not work in this case.  I wrote a vex script that delete overlap script under the certain threshold.   Also this spread attribute also been used on the ground texturing, so I use this spread as weight to mix several different soil type, to introduce more realism. Everything is done in Houdini, so all materials can introduced with some randomness based on the unique id, like this corn and its weed are a more yellow than others, and also layered with randomness on the  



**How do you see yourself in 5 years**
**What do you want to do in the future**

1. In the first one or two years, I want to fully understand ILM's workflows, and be excellent on this role,
	1. I would be very comfortable communicate and understand artist, writing the tool that fix their issues. Currently I am developing more tools that I found could be useful if I am an artist, and 
2. Then for the long term, I want to be expert in technical solution focus on the VFX, focus on the practical and efficient solutions. Through development I want to handle bigger and complex task. If ILM going to implement new technology, I will be able to help to integrate that into the pipeline.
3. In my free time, I am going to continue studying computer graphics fundamc entals, I feel this could potentially help me in some complex, low-level crashes or bugs. I wanted to build deep technical understanding in this area.     computer graphic.



I really enjoy the feeling that, in a project, or in a production, I meet an issue, I will target on this issue and find ways to solve it, keep thinking about it, maintain and improve it. 




**Help other people:**

In my previous work in GBK, we were integrating into the new USD pipeline, our HOD was building the tool, so we import alembic file, and go through the tool, it will have the correct name, LOD, showing correct in the Solaris, 
One of my colleague was asking me for help, she imported the alembic file, but after switching to LOP, there is nothing in the viewport, so we were having the call, share the screen and investigate it together, I open the tool and dive inside, I deleted all unnecessary attributes in the SOP first, then I went through all nodes in the tool in LOP one by one, checking the data flow, 
I remember the reason is that the tool was developing in the early stage, and there is an edge case that the tool didn't consider, and when pack the geometry, everything become points, and in the LOP viewport, also because the tool by default only show the lowest LOD, so there is only one point left, and make it looks like there is nothing in the viewport



**Questions:**

will there be separate pool for different show

How do you define priority
How do yo define which data going to be deleted

Tracking dependecies of each show

Do you have a system that track the heavy files on a on

Will you delete heavy cache on the ongoing show time to time, because of tracking the dependecies, or tags,
or you will not regularly delete things untill the storage is almost full, then find the biggest file, contact with artist to confirm if this could be deleted



How many people in the team
My responsibility will be solely on London or also need to care about other sites
Are you using any cloud, how much 
.


