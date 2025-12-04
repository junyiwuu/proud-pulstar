---
title: Rotation (quaternion -> matrix)
---



Unit quaternion:
$$q = w + x\,\mathbf{i} + y\,\mathbf{j} + z\,\mathbf{k},$$

--> 3x3 matrix :

$$R =
\begin{pmatrix}
1 - 2(y^2 + z^2) & 2(xy + wz) & 2(xz - wy) \\
2(xy - wz) & 1 - 2(x^2 + z^2) & 2(yz + wx) \\
2(xz + wy) & 2(yz - wx) & 1 - 2(x^2 + y^2)
\end{pmatrix}$$

  
--> 4x4 matrix, column-major 
 

$$R =
\begin{pmatrix}
1 - 2(y^2 + z^2) & 2(xy + wz) & 2(xz - wy) & 0 \\
2(xy - wz) & 1 - 2(x^2 + z^2) & 2(yz + wx) & 0 \\
2(xz + wy) & 2(yz - wx) & 1 - 2(x^2 + y^2) & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}$$


```cpp
glm::mat4 M(
1 - 2*(y*y + z*z), 2*(x*y + w*z), 2*(x*z - w*y), 0,
2*(x*y - w*z), 1 - 2*(x*x + z*z), 2*(y*z + w*x), 0,
2*(x*z + w*y), 2*(y*z - w*x), 1 - 2*(x*x + y*y), 0,
0, 0, 0, 1
);
```

  

这里：
* $w$ 是四元数的实部，$(x,y,z)$ 是虚部分量。
* 前三行前三列就是前面公式里的 $R$，表示绕原点的旋转；
* 第四行第四列设为 1，以保持齐次坐标的不变性，其它行列为 0。
GLM 的 `glm::mat4_cast(q)` 就是按上面这个公式把 quaternion 转成一个 4×4 的旋转矩阵。