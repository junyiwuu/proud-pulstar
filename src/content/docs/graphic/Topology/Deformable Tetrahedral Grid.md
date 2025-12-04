---
title: Deformable Tetrahedral Grid
---
[DefTet](https://research.nvidia.com/labs/toronto-ai/DefTet/)



The main limitation of voxel representation is quality critically depends on the grid resolution. (voxel less, quality worse)

explicitly place every vertex to produce a more flexible representation.



### 1. representation

  
* **Deformable Tetrahedral Mesh / Grid（DefTet，Gao et al. NeurIPS 2020）**：

Start from a tetrahedral mesh network with fixed, pre-defined topology (unit cube uniformly tetrahedralized). This network learns to deform the mesh vertices and predict a binary occupancy(inside or outside) for each tetrahedron.
The surface mesh is explicit, it is directly extracted from the occupancy boundary, requiring no post-processing. But the resolution is fixed.
The target is reconstruction (from point cloud or images)

 

* **Deep Marching Tetrahedra (DMTet，Shen et al. NeurIPS 2021)**：
Inheriting the structure of  a deformable tetrahedral grid, but instead of predicting binary occupancy, it predicts a signed distance value (SDF) at each vertex -- a discretization of an implicit field.
The base representation is a hybrid of implicit and explicit:
* tetrahedra grid represent implicit SDF
* a differentiable marching tetrahedra layer extracts an explicit triangular mesh

Preserve the topology flexibility of the implicit representation, while allowing direct supervision/optimization on the output surface.e
  

---

  

### 2. surface conversion

  

* **DefTet**：explicit, occupancy boundary. representation and output are sharing same strcture.

* **DMTet**：从隐式 SDF 通过 **differentiable Marching Tetrahedra** 提取 iso-surface（显式 mesh）。这个过程是端到端可微的，允许 loss 从最终 mesh 反传回 SDF 和 grid 变形。相比传统 Marching Cubes 其在拓扑变化和优化上更适合深度学习框架。

  

---

  

### 3. 分辨率 / 细化机制（adaptivity / hierarchy）

  

* **DefTet**：使用固定的 tetrahedral 网格（虽然顶点可变形），没有内建的多层级细化机制；作者提到 hierarchical 可以借鉴但留作未来工作。

* **DMTet**： **coarse-to-fine  hierarchy**：通过识别与零水平集相交的 surface tetrahedra 进行选择性细分（subdivision），并且该细分与变形是联合学习的，从而在需要的地方自适应集中分辨率，节省计算。

  

---

  

### 4. 监督 / 优化目标

  

* **DefTet**：主要是重建（reconstruction）——从输入图像/点云学习变形和 occupancy，使得重建的体积/表面逼近目标。优化是显式的，loss 可以是标准的 3D 重建 loss（如 surface fidelity）；没有生成模型成分。

* **DMTet**：不仅做重建，还做 **条件生成（conditional shape synthesis）**，可以从粗 voxel 等引导（user guide）生成高分辨率形状。它在 **最终提取的 surface mesh 上** 施加 loss（包括 Chamfer、adversarial loss 等），直接优化 geometry 和 topology 以及 subdivision hierarchy。这个显式 surface supervision 是质量提升的关键。

  

---

  

### 5. 拓扑灵活性

  

* **DefTet**：通过 tetrahedron 的 occupancy pattern 可以间接改变拓扑（内部/外部定义），但拓扑的变化是通过 binary 分割模拟的。

* **DMTet**：由于基于隐式 SDF 和 iso-surfacing，拓扑变化更自然（任意拓扑由零水平集直接给出），且通过 differentiable 提取和 surface-level loss 进一步稳定和提升。

  


### 7. 继承与推进关系

  

DMTet 明确引用并扩展了 Deformable Tetrahedral Grid（DefTet）——把 occupancy 换成 SDF，增加 differentiable marching tetrahedra、selective subdivision 以及 surface-level generative监督，形成一个 hybrid implicit-explicit、可自适应分辨率、可生成任意拓扑的更强表示与系统。可以认为是 **在 DefTet 基础上的进一步 advance（further advance）**，但方向上是从“显式体积+occupancy” 转向了“隐式场 + 可微 iso-surfacing + 生成/细化机制”的混合新范式。


  

### 总结对比表（简化版）

| 维度          | Deformable Tetrahedral Mesh/Grid (DefTet) | Deep Marching Tetrahedra (DMTet)                              |
| ----------- | ----------------------------------------- | ------------------------------------------------------------- |
| 基础字段        | 顶点位置 + tetrahedron 二值 occupancy           | 顶点上的 signed distance values (SDF)                             |
| 表示类型        | 显式体积（occupancy）                           | implicit（SDF） + 显式 surface via 可微 iso-surfacing               |
| 表面提取        | 直接由 occupancy 边界构成                        | differentiable Marching Tetrahedra                            |
| 分辨率/细化      | 固定网格                                      | 选择性 subdivision（层级、coarse-to-fine）                            |
| 拓扑          | 通过 occupancy 隐式变化                         | 自然由 SDF 零水平集支持任意拓扑                                            |
| 训练目标        | 重建（reconstruction）                        | 生成 + 重建（conditional synthesis），对 surface 直接监督（包括 adversarial） |
| 主要用途        | 形状重建（从图像/点云）                              | 高分辨率形状合成与重建                                                   |
