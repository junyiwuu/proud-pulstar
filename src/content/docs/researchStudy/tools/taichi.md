---
title: taichi
---

```
ti.init(arch=ti.gpu)
```
specifies the backend that will execute the compiled code
`ti.cpu` or `ti.gpu`
Taichi will attempt to use the GPU backends in the following order: `ti.cuda`, `ti.vulkan`, and `ti.opengl/ti.Metal`




## Define a Taichi field

```
n = 320
pixels = ti.field(dtype=float, shape=(n * 2, n))
```

* The function `ti.field(dtype, shape)` defines a Taichi field whose shape is of `shape` and whose elements are of type `dtype`.
* Field is a fundamental and frequently utilized data structure in Taichi.
* It can be considered equivalent to NumPy's `ndarray` or PyTorch's `tensor`,


### Kernels and functions
```
@ti.func
def complex_sqr(z):  # complex square of a 2D vector
    return tm.vec2(z[0] * z[0] - z[1] * z[1], 2 * z[0] * z[1])

@ti.kernel
def paint(t: float):
    for i, j in pixels:  # Parallelized over all pixels
        c = tm.vec2(-0.8, tm.cos(t) * 0.2)
        z = tm.vec2(i / n - 1, j / n - 0.5) * 2
        iterations = 0
        while z.norm() < 20 and iterations < 50:
            z = complex_sqr(z) + c
            iterations += 1
        pixels[i, j] = 1 - iterations * 0.02
```
* are not executed by Python's interpreter
* taken over by Taichi's JIT compiler and deployed to your parallel multi-core CPU or GPU (determined by the `arch` argument in the `ti.init()` call.)
* Kernels serve as the entry points for Taichi to take over the execution.
	* can be called anywhere, but in taichi function


## taichi.dense
ti.root代表整个field的根节点，最高层
dense表示在这一级分配一块密集的内存空间，可以多级嵌套，形成多分块，比如分tile，分pixel，分layer
```
pixel_root = (
    ti.root.dense(ti.ij, (self.n_x_tiles, self.n_y_tiles))
    .dense(ti.ij, (8, 8))
    .dense(ti.k, 2)
)
```
比如这里
1. 先划分成了n_x_tiles和n_y_tiles个tiles
2. 每个tile下有8x8个pixels
3. 每个pixel下有2个layer 

`ti.i`, `ti.j`, `ti.k`, `ti.l`，分别代表第1、2、3、4个维度。
`ti.ij` 等价于`(ti.i, ti.j)`,用来表示2D数组的两个维度