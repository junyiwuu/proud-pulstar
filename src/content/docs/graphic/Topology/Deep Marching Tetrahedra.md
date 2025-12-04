---
title: Deep Marching Tetrahedra
---

## Representation
Using a sign distance field(SDF) encoded with a deformable tetrahedral grid, adopted from [[Deformable Tetrahedral Grid]].
Why use SDF?

Further selectively subdivide the tetrahedra around the predicted surface. 
Then convert the signed distance-based implicit representation into a triangular mesh using a marching tetrahedra layer.
The final mesh is further converted into a parameterized surface with a differentiable surface subdivision module.


Deformable tetrahedral grid:  $(V_T, T)$  
- $V_T$ : are the vertices in the tetrahedral grid $T$
- $T$: tetrahedral grid

each tetrahedron $T_k \in \mathcal{T}$ is represented with four vertices  $\{v_{a_k}, v_{b_k}, v_{c_k}, v_{d_k}\}$, with $k \in \{1,\ldots,K\}$, where $K$ is the total number of tetrahedra and $v_{i_k} \in V_T$.

- $s(v_i)$:  SDF value at vertex $v_i \in V_T$ 

**What about SDF value inside the tetrahedron??:**  SDF values for inside the tetrahedron follows a barycentric interpolation of the SDF value of the four vertices that encapsulates the points.



 **$s(v_a) = s(v_b)$ ?**

* $s(v)$ is the signed distance value at a vertex. Zero means the vertex lies exactly on the surface; positive/negative usually denote outside/inside.
* They have the same SDF value.

  * If that common value is **zero**, both are exactly on the surface.
  * If it’s nonzero and same sign, both are either inside or outside, so the surface does **not** cross that edge.

 **Where the “singularity” concern comes from**

Marching Tetrahedra computes the position of a zero-crossing along an edge $[v_a, v_b]$ when the signs of $s(v_a)$ and $s(v_b)$ differ. 
The interpolation formula (one form of it) is:

$$
v'_{ab} = \frac{s(v_b)\,v_a - s(v_a)\,v_b}{s(v_b) - s(v_a)}
$$

Concern: If $s(v_a) = s(v_b)$, the denominator is zero, so that expression would be undefined—this is the *singularity* they refer to.

But here’s the key: you only ever try to compute a crossing when $\operatorname{sign}(s(v_a)) \neq \operatorname{sign}(s(v_b))$. If $s(v_a) = s(v_b)$, then their signs are the same :
- unless both are exactly zero, in which case there’s no “crossing” in the usual sense—the entire edge lies on the zero-level set
- you wouldn’t invoke that interpolation. so In practice never happens in the relevant cases.



## Process
1. Initialize a coarse tetrahedral-grid for the input point cloud / voxel
	1. If the input is point cloud, use PVCNN (Point-Voxel CNN), project sparse point cloud to 3D feature grid (feature volume)
	2. If the input is voxel, get a feature volume by using 3D convolution neural network. 
2. predict the SDF values of each vertices using neural network. 


 $F_{\text{vol}}(x)$ each position $x$ (in 3D space) multi-channel vector. It encodes the context of this point.

$F_{\text{vol}}(v, x)$ : feature vector, 网格有一堆顶点 vv，每个顶点在空间有坐标。为了给每个顶点一个对应的输入上下文信息，论文不是直接采样最近的 voxel，而是：
- 在 feature volume 上对该顶点坐标做 **trilinear interpolation（3D 线性插值）**，从周围体素插值得到该点的 feature vector，记作 Fvol(v,x)Fvol​(v,x)。 
- 这就是“在那个顶点位置，从 encoder 计算出的上下文特征向量”。

Input feature vector: $F_{\text{vol}}(v,x)$ and position $v$  -> to a small MLP.
  $$
  (s(v), f(v)) = \text{MLP}(F_{\text{vol}}(v, x), v)
  $$
  * **$s(v)$** 是这个顶点的 **signed distance value**（即 SDF 预测值），是隐式表面在这个 tetrahedral grid 上的初始编码。0 等值面会在后面的可微分 Marching Tetrahedra 层被用来提取表面。
  * **$f(v)$** 是一个额外的 **feature vector**，不是几何距离，而是用于 **后续的 surface refinement（表面细化）** 的辅助特征，在 volume subdivision 阶段用来决定如何细化/调整局部几何。换言之，$f(v)$ 携带的是“这个位置需要怎样在细分后变得更精细”的提示。([NVIDIA][1], [Department of Computer Science][2])



**In Nvdiffrec:**

It doesn't require an input point cloud or initial voxel. 
- DMTet's original supervised version need "encoder-from-3D-input".
- It starts from a generic "empty" deformable tetrahedral grid ( a coarse grid covering the object's bounding volume) with its per-vertex *signed distance values* and *offset* as *learnable parameters*.


## Discrimnator

![paper image](https://velog.velcdn.com/images/jameskoo0503/post/3e7df256-7515-48f3-8a9c-4247c9680cca/image.png)
### 1. 目的

判别器的作用是 **促使生成的局部几何（即表面细节）更真实**。它不是在全局比较形状，而是聚焦在 **高曲率点附近的局部几何**，因为那些地方更容易体现细节和真实性——比如尖锐边缘、褶皱、小的凹凸。

---

### 2. 输入是什么

* 先从预测出的网格（以及对应的真实网格）上采样一组 **高曲率的点 $v$**（这些点代表几何变化剧烈的地方）。
* 围绕每个这样的点，分别从 **生成网格** 和 **真实网格** 计算一段局部的 **signed distance field（SDF）体积**。这个 SDF 是显式地从三角网格解析出来的（analytic SDF），所以它对生成网格的顶点和 SDF 值是可微的，梯度可以回传回来。
* 同时，把条件输入（比如原始的 point cloud / 粗 voxel 形状）编码成一个体积特征场 $F_{\text{vol}}(x)$，并在点 $v$ 处做三线性插值，得到该位置的上下文特征 $A_{\text{vol}}(v, x)$。这个让判别器是**条件式**的：它不仅看形状本身，也参考输入的语境。

---

### 3. 判别器结构

* 把局部 SDF 体积（预测的或真实的）送进一个 **3D CNN**，提取该局部几何的描述。
* 同时将插值得到的条件特征 $A_{\text{vol}}(v, x)$ 也融合进来（通常是拼接或加法）。
* 最后经过一个 MLP 输出一个 real/fake 评分，表示这段局部几何是来自真实数据还是生成器。

> 图里 “No Gradient” 标在真实（GT）那一支上，说明真实网格那边不反向传播梯度（它是固定的标准）；而生成网格那边的 SDF 是可微的，判别器的反馈会通过 SDF 和网格回传到生成器。

---

### 4. 训练目标

使用类似 **LSGAN（Least Squares GAN）** 的损失，使得：

* 判别器学会区分真实 vs 生成的局部 SDF 片段（给真实打“真”，生成打“假”），
* 生成器则试图让其生成的局部 SDF 片段被判别器认为是真实的（即“骗过”判别器）。

这个对抗过程增强了局部细节的逼真度，尤其在高曲率区域。

---

### 5. 为什么用高曲率采样

直接在全表面均匀判别会稀释信号，细节难以学到。高曲率点附近是几何信息密集和易出错的地方，把判别器的注意力集中在那里，可以更有效地提升细节质量。

---

如果你要，我可以进一步帮助你写出这个判别器的伪代码/实现框架，或者分析它和普通 patch-based discriminator 的异同。你想先从哪部分展开？
