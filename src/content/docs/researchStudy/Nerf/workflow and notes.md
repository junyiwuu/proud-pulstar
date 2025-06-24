---
title: nerf workflow and notes
---

## General Information
[yenchenlin/nerf-pytorch](https://github.com/yenchenlin/nerf-pytorch) : simple code. projects/nerf-pytorch.
but slow. around 3 hours on my machine. Low VRAM usage (5gb)

[krrish94/nerf-pytorch](https://github.com/krrish94/nerf-pytorch) : full project and configuration. projects/nerf2/nerf-pytorch. faster, around 1 hour on my machine. 20gb VRAM
LLFF: Local Light Field Fusion. google dataset.
npy file: each line is camera's metadata. not the image itself. 


## Content
run_nerf_helper: 
* img2mse
* mse2psnr
* to8b
* Positional Encoding
* NeRF model




它把空间点 `x` 和观察方向 `d` 一起作为输入，但不是**直接拼**一开始就进网络，而是：
- 先只处理 `x`，得到一个 feature `h(x)`
- 然后再拼 `d`，进一步得到颜色 `rgb`
  

## Functions learning
**torch.meshgrid** : 
```

x = torch.tensor([1, 2, 3])
y = torch.tensor([4, 5])
xx, yy = torch.meshgrid(x, y, indexing='ij')

# all values on x axis
xx =
[[1, 1],
 [2, 2],
 [3, 3]]

# all values on y axis
yy =
[[4, 5],
 [4, 5],
 [4, 5]]

# then it equals to create these points: 
coords = torch.stack([xx, yy], dim=-1) # shape: [H, W, 2]
tensor([[[1, 4],
         [1, 5]],

        [[2, 4],
         [2, 5]],

        [[3, 4],
         [3, 5]]])
```

`ij`:  
* x copy twice via horizontal, because y size is 2
* y copy three times vertically, because x size is 3
`xy`:
* x copy twice vertically because y size is 2
* y copy three times horizontally because x size  is 3

```
x = torch.tensor([1, 2, 3])
y = torch.tensor([4, 5])
xx, yy = torch.meshgrid(x, y, indexing='xy')

xx: 
tensor([[1, 2, 3],
        [1, 2, 3]])
yy:
tensor([[4, 4, 4],
        [5, 5, 5]])

coords = torch.stack([xx, yy], dim=-1) # shape: [H, W, 2]
coords:
tensor([[[1, 4],
         [2, 4],
         [3, 4]], 

        [[1, 5],
         [2, 5],
         [3, 5]]])
```


横着有多少个数，就是最后的coords中的w有多少个数
ij 是数学矩阵风格，行是i 列是j
xy 是图像像素风格，x是横 y是竖

---
## NeRF Model
###  NeRF的ray生成器
**Description**: 从一张图的每个像素出发， generate 对应的ray起点和direction . (world coordinate)
Input:
Output: 
* `rays_o`, ray origin
* `rays_d`, ray direction


#### 用相机metadata `K` 还原camera坐标下的ray direction
```python
dirs = torch.stack([
    (i - cx) / fx,
    -(j - cy) / fy,
    -1
], -1)
```
给定一个像素坐标 `(i, j)`，推回这个像素在相机坐标系下的方向向量 `(x, y, z)`。
**怎么来的：**
1. **像素坐标是由这个等式来的（正向）：**
$$
\begin{bmatrix}
i \\j \\1\end{bmatrix}
=
K\cdot\begin{bmatrix}
x \\y \\z\end{bmatrix}\div z
$$
2.  **(can skip)**
$$
\begin{bmatrix}
i \\j \\1 \end{bmatrix}
=
K \cdot \left(\frac{1}{Z}\begin{bmatrix}
X \\Y \\Z\end{bmatrix}\right)=K \cdot \left( \frac{1}{Z} X_{cam} \right)
$$
* $(i, j)$：对应的图像像素位置
* $K \in \mathbb{R}^{3\times3}$：相机内参矩阵（不需要转置）
* $X_{cam}$：点在相机坐标系中的位置（物理坐标）
  
3. **反推**
$$
\begin{bmatrix}
x \\y \\z\end{bmatrix}
=z \cdot K^{-1}\cdot
\begin{bmatrix}
i \\j \\1\end{bmatrix}
$$
但我们不关心 `z` 的实际大小（因为是方向向量，归一化就可以），所以我们可以直接设定 `z = -1`，代表“朝着 -z 看”。

4. **手动求 $K^{-1}$（因为是 upper triangular 矩阵）：**
$$
K^{-1} =\begin{bmatrix}
1/f_x & 0 & -c_x/f_x \\0 & 1/f_y & -c_y/f_y \\0 & 0 & 1\end{bmatrix}
$$
5. **代入计算**
$$
K^{-1}\begin{bmatrix}
i \\j \\1\end{bmatrix}
=\begin{bmatrix}(i - c_x)/f_x \\(j - c_y)/f_y \\1
\end{bmatrix}
$$
6. **对应矩阵上的位置**
给定像素坐标 `(i, j)`，相机内参：
* $f_x = K[0][0]$
* $f_y = K[1][1]$
* $c_x = K[0][2]$
* $c_y = K[1][2]$

4. **就得到了前面的那个代码**
  

>逆矩阵的例子 inverse matrix： 
$$A = \begin{bmatrix}a & b \\c & d\end{bmatrix}$$
  它的逆矩阵是：
 $$A^{-1} = \frac{1}{ad - bc}\begin{bmatrix}d & -b \\-c & a\end{bmatrix}$$
 只要 $ad - bc \ne 0$，就可逆。





---

## ✅ 你可以这样拆分三层来整理

### 🟩 1. 数据处理层
- 读图像 → 读 camera pose → 生成 ray
- embedder 把 ray 上的 3D 点做 sin/cos 编码
    

### 🟨 2. 网络层（NeRF）
- 每个点 `(x, d)` 喂进网络 → 输出 `(rgb, σ)`
- 多个点按 ray 顺序做 volume rendering → 拼出一个像素值

### 🟥 3. 训练层
- 把渲染出来的像素和真实图像比 → MSE loss
- 反向传播更新网络参数
    


|功能|代码|
|---|---|
|加载图像 + pose|`load_blender_data()`|
|生成 ray|`get_rays()`|
|点编码|`Embedder.embed()`|
|网络前向|`run_network()` + `network_query_fn`|
|渲染像素|`render_rays()` → `raw2outputs()`|
|优化|`train()` 中计算 loss、backward|

---

整套流程 `图像 → 模型 → 渲染 → loss` 