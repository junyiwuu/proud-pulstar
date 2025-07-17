---
title: Signed Distance Functions
description: SDFs and Neural SDFs
---
## Signed Distance Function
A SDF is a mathematical function. 
For any points in space, gives the (signed) distance to the nearest surface of an object.
- Positive is outside the object, negative is inside, zero is exactly on the surface
- The SDF of a sphere: `f(x, y, z) = sqrt(x^2 + y^2 + z^2) - r`

Function:
$f : \mathbb{R}^3 \to \mathbb{R}$ where $d = f(\mathbf{x})$ is the shortest ${signed}$ distance from a point $\mathbf{x}$ to a surface $\mathcal{S} = \partial \mathcal{M}$ of a volume $\mathcal{M} \subset \mathbb{R}^3$, where the sign indicates whether $\mathbf{x}$ is inside or outside of $\mathcal{M}$. As such, $\mathcal{S}$ is implicitly represented as the zero level-set of $f$:
$$
\mathcal{S} = \{ \mathbf{x} \in \mathbb{R}^3 \mid f(\mathbf{x}) = 0 \}.
$$



## Neural Signed Distance Function




Neural SDF encodes the SDF as the parameters $\theta$ of a neural network $f_\theta$. 

Retrieving the signed distance for a point $\mathbf{x} \in \mathbb{R}^3$ amounts to computing $f_\theta(\mathbf{x}) = \hat{d}$. The parameters $\theta$ are optimized with the loss
$J(\theta) = \mathbb{E}_{\mathbf{x}, d} \mathcal{L}\left(f_\theta(\mathbf{x}), d\right),$
* $d$ is the ground-truth signed distance 
- $\mathcal{L}$ is some distance metric such as $L^2$-distance. 
- An optional input “shape” feature vector $\mathbf{z} \in \mathbb{R}^m$ can be used to condition the network to fit different shapes with a fixed $\theta$.




Paper: vhttps://arxiv.org/abs/2101.10994

Neural signed distance functions(SDFs) -- effective representation for 3D shapes


**Before:** encode SDF with ==a large fixed-size neural network ==to approximate complex shapes with implicit . This MLP as the learned distance function
- require many forward passes through trhe network for every pixel
- imporactival for real time graphic



**This method:** Implicit surface using an octree-based freature volume
- shapes with multiple discrete levels of detail (LODs), 
- enable continous LOD with SF interpolation


A efficient algorithm to directly render neural SDF representation in real time, by querying only the necessary LODs with sparse [[octree]] traversal



Rendering and probing neural SDFs -->[[Sphere Tracing]] -- a root-finding algorithm that require hundreds of SDF evaluation per pixel to converge


discrete a space by using a sparse voxel octree





Use a ==feature volume== which contains a collection of ==feature vectors==. 

in bounding box $\mathcal{B} = [-1, 1]^3$
Each voxel $V$ in the SVO holds a learnable feature vector $\mathbf{z}_V^{(j)} \in \mathcal{Z}$ at each of its eight corners (indexed by $j$ )

**For LOD:** 
Each level $L \in \mathbb{N}$ of the SVO defines a LOD for the geometry.
As the tree depth $L$ in SVO increases, the surface is represented with finer discretization, allowing reconstruction quality to scale with memory usage.

- Maximum tree depth: $L_{max}$ 
- Small MLP neural networks $f_{1:L_{\text{max}}}$  , as decoders
	- with parameters $\theta_{1:L_{\text{max}}} = {\theta_1, \ldots, \theta_{L_{\text{max}}}}$
	- which means every LOD level has its own decoder parameters -- for each level in the octree, there is a separate MLP decoder$f_{\theta_L}$, and its parameters $\theta_L$
	- The set ${\theta_1, ..., \theta_{L_{\max}}}$ refers to all these different decoders, one for each LOD.

Target:
Compute an SDF for a query point $\mathbf{x} \in \mathbb{R}^3$ at desired LOD $L$
1. traverse the tree up to level $L$ to find all voxels $V_{1:L} = {\{V_1, \ldots, V_L\}}$  containing $\mathbf{x}$ 
2. for each level $\ell \in {1, \ldots, L}$ compute a per-voxel shape vector $\psi(\mathbf{x}; \ell, \mathcal{Z})$   by trilinearly interpolating the corner features of the voxels at $\mathbf{x}$
3. Sum the features across the levels to get $\mathbf{z}(\mathbf{x}; L, \mathcal{Z}) = \sum_{\ell=1}^L \psi(\mathbf{x}; \ell, \mathcal{Z})$
4. Pass them into the MLP with LOD-specific parameters $\theta_L$
5. Compute the SDF as  $\hat{d}_L = f_{\theta_L}([\mathbf{x},, \mathbf{z}(\mathbf{x}; L, \mathcal{Z})])$
- $[\cdot , \cdot]$ 表示向量拼接（concatenation）。


### **核心流程可以总结成三步：**

#### 1. **Find all relevant voxels up to the desired LOD**

你要渲染（或查询）某个点 $\mathbf{x}$，并且指定了一个想要的细节层级 $L$（LOD）。

- 你就**从最粗的level 1，一直找到level $L$，**每一级都找到包含$\mathbf{x}$的那个voxel（体素块）。
    

#### 2. **At each level, get a “per-voxel shape vector” via trilinear interpolation**

- 每一级（$\ell$）上，把这个voxel 8个角的特征向量用trilinear插值，算出 $\psi(\mathbf{x}; \ell, \mathcal{Z})$，也就是这一级体素对点$\mathbf{x}$的shape特征。
    

#### 3. **Sum up all these shape vectors, concatenate with $\mathbf{x}$, and feed to the MLP for the selected LOD**

- 把所有level 1到L的shape vector**加起来**，得到总的shape特征 $\mathbf{z}(\mathbf{x}; L, \mathcal{Z})$。
    
- 把这个特征和点$\mathbf{x}$**拼在一起**（concatenate），输入到当前LOD专属的MLP（$f_{\theta_L}$），
    
- 得到SDF输出。
    


 **简化版理解**

- 不是只用“当前LOD”，而是**把LOD 1 到 L**所有级别的信息全都用上（多尺度特征融合）。
- 每个LOD有自己的一套decoder参数（网络）。    
- 这样做是为了让网络能够利用从粗到细的所有空间上下文，更稳定更精细。
    

**你想象成：**

“对于同一个点$x$，把从大到小的所有‘包围盒子’里能得到的信息都综合起来，然后用适合当前分辨率的网络来解码。”

