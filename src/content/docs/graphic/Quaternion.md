---
title: Quaternion
description: Quaternion explanation
tags:
  - Basic
---


`glm::quat(w, x, y, z);`

## Quaternion: 
Formula:
$$q = w \;+\; x\,\mathbf{i}\;+\;y\,\mathbf{j}\;+\;z\,\mathbf{k},$$

w: scalar
x, y, z: vector

When using "axis-angle" to create quaternion:
$$q = \Bigl(\cos\frac\theta2,\; u_x\sin\frac\theta2,\; u_y\sin\frac\theta2,\; u_z\sin\frac\theta2\Bigr)$$
* **w = cos(θ/2)**，θ is the rotation angle (normally in radians)，
* **(x,y,z) = axis \* sin(θ/2)** 描述旋转轴方向乘上 sin(θ/2)。
so the default quaternion in GLM is `(1,0,0,0)` 
* θ＝0 ⇒ cos(0/2)=1 ⇒ w=1
* sin(0/2)=0 ⇒ x=y=z=0
**-> means zero rotation**
* w携带了“旋转角度”的一半余弦信息，和向量部分一起完整描述了三维旋转。


* **Pure quaternion** $\Leftrightarrow$ scalar $w = 0$.
* **Non‑pure quaternion** $\Leftrightarrow$ $w \neq 0$.



### Full Quaternion
 a “full” quaternion that generally represents a rotation (or a scaled/combined rotation+scalar).
 
### Pure Quaternion
so it lives entirely in the “vector” subspace 
$$q = x\,\mathbf{i} + y\,\mathbf{j} + z\,\mathbf{k}.$$

If $w \neq 0$, then $q$ has a nonzero real part and is **not** pure—it’s

  
  





