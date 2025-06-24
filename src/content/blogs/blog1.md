---
title: differentiable renderer knowledge
---

## 知识框架

### pipeline:
* 用DMTet 输出tetrahedral grid每个顶点的SDF和offset
* Marching tet得到mesh
* 用differentiable rasterizer calculate texture and light, render the result to 2D image
* calculate image loss and do optimization

### Optimization task:**
L = Limage + Lmask + λLreg
* **Limage** : Image reconstruction loss
	* the loss between rendered image and target image
	* Need to do tone mapping, since neural rendering outputs linear image, we need to gamma correct it first.
	* The purpose: they need to all in same colorspace


*tone map operator*： 
* Linear radiance values:  $x$
* sRGB transfer function: $\Gamma(x)$ 
              ↓  
* tone map 之后的颜色值： $x' = \Gamma(\log(x + 1))$
$$
\Gamma(x) =
\begin{cases}
12.92x & x \leq 0.0031308 \\
(1 + a)x^{1/2.4} - a & x > 0.0031308
\end{cases}
\quad 
a=0.055
$$
基本上就是说，在做tone mapping的的时候先做了一个$log(x+1)$之后套了sRGB 曲线 $\Gamma(x)$ 

**L1 norm:** 
$$
\| \mathbf{x}' \|_1 = \sum_i |x'_i|
$$
L1 norm是对这些tone-mapped的RGB value 取绝对值后求和

 
* **Lmask:** 
	* foreground and background loss supervision
	* mask loss -> foreground L2 loss
	* help model to learn object's boundary

* **Lreg**:
	* Target: reduce floaters and internal geometry

$$
L_{\text{reg}} = \sum_{i,j \in S_e} 
H(\sigma(s_i), \text{sign}(s_j)) + H(\sigma(s_j), \text{sign}(s_i))
$$

它的结构是两个方向的 binary cross entropy。
目的：让相邻两个点的SDF符号一致。
- $σ(x)$：sigmoid 函数，输出在 0 到 1 之间
- $sign(x)$：取符号，正数变 1，负数变 0
- $H(p,y)$：二元交叉熵损失（BCE），输入一个概率 pp，目标值 yy
**这么理解**： 
$σ(x)$理解成x为正的概率，也就是这个点在外面的概率

* 如果 $s_i$ 是正（在物体外），那就鼓励 $s_j$ 也正
* 如果 $s_i$ 是负（在物体内），那就鼓励 $s_j$ 也负
* 所以 BCE 的目标就是让 sigmoid(s) ≈ sign(邻居的 s)

---

### DMTet
**对比：**
* DMTet: hybrid 3D representation (represent a shape with a discrete SDF defined on vertices of a deformable tetrahedral grid)
* NeRF: volumetric representation
* NeuS: implicit surface representation



Deep Marching Tetrahedra (hybrid 3D representation that combines both implicit and explicit 3D surface representations)

Form: SDF defined on vertices of a deformable tetrahedral grid.
↓  
use differentiable Marching Tetrahedra layer(MT) to convert SDF to triangular mesh
↓  
 




**Process**: 
starts from a uniform tetrahedral grid of predefined resolution
* uniform tetrahedral grid是3D空间里均匀分布的四面体网格，可看作是voxel grid的三角化版本
* DMTet让网络不仅输出SDF值，害预测每个vertex的偏移向量，表示从规则的网络出发，要移动多少才更接近真实表面
↓
use network to predict SDF value and deviation vector
* encoded SDF: SDF通过一个比如MLP
* 
↓

↓

↓

↓

↓

↓