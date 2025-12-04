---
title: Arcball Camera
description: Study notes about Arcball Camera with an online code example
---
[Online Code Example](https://github.com/Twinklebear/arcball-cpp/tree/master)

[[Quaternion]]

The arcball trick uses pure quaternions to represent points on the sphere (just vectors), then builds a **rotation quaternion** by multiplying two pure quaternions and thereby getting a nonzero scalar part (which encodes the cosine of half the rotation angle).



When $w=0$, your quaternion is
$$q = (0,\;x,\;y,\;z)$$

and since for a unit‐quaternion $w = \cos\frac\theta2,$ 
we have $\cos(\theta/2)=0$. That means $\theta/2 = \tfrac\pi2 \quad\Longrightarrow\quad \theta = \pi$

i.e. a **180° rotation**.
The vector part $(x,y,z)$ then satisfies 
$$
(x,y,z) = \mathbf{u}\,\sin\frac\theta2 = \mathbf{u}\,\sin\frac\pi2 = \mathbf{u}
$$
where $\mathbf{u}$ is your unit rotation axis.

 So in practice

* **$w=0$ → exactly a half‐turn** (180°) about the axis
* Your quaternion is $q=(0,\,u_x,\,u_y,\,u_z)$
* Example: rotate 180° about Y → axis $(0,1,0)$, quaternion 
$$q = \bigl(0,\;0,\;1,\;0\bigr)$$
**Whenever you see a quaternion whose real (scalar) part is zero, it encodes a 180° flip around whatever axis its vector part points along.**