---
title: vulkan structure
---


## Client
focus on the application logic
#### asset manager
(upload data to cpu)
> base class JAsset, 

#### window manager 
> manage window creation and input events

#### camera
> camera logic


#### Event manager
handles application wide events
> 
- window creation and management
- input handling (keyboard, mouse)
- 


Manage table: 
hash the filepath for now (it is more simple, hash the content later)

string (the name of the file) : gpu handle?






## UI / Editor
Focus on the UI
provide GUI , user change the settings

Each node in the graph:
- transformations (pos, rot, scale)
- references to assets
- parent-child relationship





## Scene layer
The logic structure of the 3D world, where scene graph is 
The Scene layer focuses on the logical structure of the 3D world, while the `Renderers` layer focuses on rendering. This separation ensures that the scene graph is not tightly coupled to the rendering pipeline.
-


> when rendering, Renderer traverse the scene graph
> -- for each node, the renderer queries the AssetManager for the GPU handle of the nodes assets
> -- The renderer use GPU handle to bind resources and issue draw calls
- **Responsibilities:**
    
    - Manages the hierarchy of objects in the scene (e.g., nodes, transforms, parent-child relationships).
    - Stores references to assets (e.g., meshes, textures) and their GPU handles.
    - Provides an interface for the `Renderer` to traverse and render the scene.
- **Key Components:**
    
    - [Scene](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): The root of the scene graph.
    - [SceneNode](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): Represents individual objects in the scene (e.g., meshes, lights, cameras).
    - `Transform`: Handles position, rotation, and scaling of nodes.



Workflow: AssetManager, ResourceManager, and Scene Graph

Here’s how everything connects:

 **Step 1: Asset Loading**

- The `AssetManager` loads assets (e.g., textures, meshes) from disk into CPU memory.
- The `AssetManager` calls the [ResourceManager](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) to upload assets to the GPU.

  **Step 2: Resource Deduplication**

- The [ResourceManager](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) checks its hash table to avoid duplicate GPU uploads.
- If the asset is already uploaded, the [ResourceManager](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) returns the existing GPU handle.
- If the asset is not uploaded, the [ResourceManager](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) uploads it and stores the GPU handle in the hash table.

  **Step 3: Scene Graph References Assets**

- The `Scene` contains a hierarchy of `SceneNode` objects.
- Each `SceneNode` references assets (e.g., `Mesh`, `Texture2D`) managed by the `AssetManager`.

  **Step 4: Rendering**

- The `Renderer` traverses the scene graph and renders each node.
- For each node, the `Renderer` queries the `AssetManager` for GPU handles and binds them during rendering.















---
## Render layer
Handles rendering logic. This is where the rendering pipeline is defined.

**Resource manager** 
> upload data from cpu to gpu


- **Responsibilities:**
    
    - Manages the rendering pipeline (e.g., shaders, framebuffers, render passes).
    - Interfaces with the [Scene](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) to render objects.
    - Abstracts rendering details from the `Client` layer.
- **Key Components:**
    
    - `Renderer`: The main rendering class that orchestrates the rendering process.
    - `Material`: Represents shaders and their parameters.
    - `RenderPass`: Defines Vulkan render passes.
    - `FrameGraph` (optional): Manages dependencies between rendering passes.
    - 
rendering logic, scene graph, scene node









## VulkanCore
Vulkan API abstraction
 Vulkan-specific code is isolated and not exposed to other layers.
    
- **Responsibilities:**
    
    - Wraps Vulkan objects (e.g., `VkDevice`, `VkBuffer`, `VkImage`) into higher-level abstractions.
    - Provides utility functions for Vulkan initialization and resource management.
    - Ensures that other layers (e.g., `Renderers`) do not directly interact with Vulkan.
- **Key Components:**
    
    - `VulkanDevice`: Manages the Vulkan logical device and queues.
    - `VulkanBuffer`: Wraps Vulkan buffer creation and management.
    - `VulkanImage`: Wraps Vulkan image creation and management.
    - `VulkanSwapchain`: Manages the swapcha



 
- **Client Layer** interacts with:
    - `Editor Layer` (if present) to provide UI functionality.
    - `Scene Layer` to manage the scene graph.
    - `Renderers Layer` to trigger rendering.
- **Editor Layer** interacts with:
    - `Scene Layer` to manipulate scene objects.
    - `Client Layer` for application-level events (e.g., input).
- **Scene Layer** interacts with:
    - `Renderers Layer` to provide data for rendering.
    - `Client Layer` for asset loading and updates.
- **Renderers Layer** interacts with:
    - `VulkanCore Layer` for Vulkan-specific operations.
    - `Scene Layer` to traverse and render the scene graph.
- **VulkanCore Layer** is isolated and only used by the `Renderers Layer`.

---

### **4. Key Improvements Over Your Current Design**

1. **Encapsulation of Vulkan Details:**
    
    - By isolating Vulkan-specific code in the `VulkanCore` layer, you ensure that other layers (e.g., `Client`, [Scene](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)) remain Vulkan-agnostic. This makes your code more modular and easier to maintain.
2. **Separation of Scene and Rendering:**
    
    
3. **Editor as an Optional Layer:**
    
    - The `Editor` layer is optional and can be excluded in a production build. This keeps the core application lightweight.
4. **Clear Responsibilities:**
    
    - Each layer has a well-defined purpose, reducing the risk of overlapping responsibilities.

---

### **5. Next Steps**

1. **Finalize the Architecture:**
    
    - Decide if this refined architecture aligns with your goals.
    - Adjust folder structure and class responsibilities accordingly.
2. **Focus on One Layer at a Time:**
    
    - Start with the `VulkanCore` layer to ensure Vulkan initialization and resource management are solid.
    - Move to the `Renderers` layer to define the rendering pipeline.
    - Implement the [Scene](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) layer to manage the scene graph.
    - Finally, integrate everything in the `Client` layer.
