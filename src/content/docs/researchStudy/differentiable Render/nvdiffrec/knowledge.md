---
title: knowledge
---


---


## 强制注入grad
original code:
```
class SpecifyGradient(torch.autograd.Function):
    @staticmethod
    def forward(ctx, input_tensor, gt_grad):
        ctx.save_for_backward(gt_grad)
        return torch.ones([1], device=input_tensor.device, dtype=input_tensor.dtype)

    @staticmethod
    def backward(ctx, grad_scale):
        gt_grad, = ctx.saved_tensors
        gt_grad = gt_grad * grad_scale
        return gt_grad, None
```

例子：
```
x = torch.tensor(2.0, requires_grad=True)
y = x * 3
z = y ** 2
loss = z.mean()
loss.backward()
```
现在 PyTorch 会这样反向传播：
1. 最终目标是：对 `loss` 求 `x` 的导数
2. PyTorch 会依次求：
$$
\frac{d \text{loss}}{dz} \cdot \frac{dz}{dy} \cdot \frac{dy}{dx}
$$  
* `dy/dx = 3`
* `dz/dy = 2y`
* `dloss/dz = 1`

  **✅ 回到original code：**
你定义了：
```python
dummy = SpecifyGradient.apply(input_tensor, gt_grad)
```

这个 `dummy` 会被放入下游的计算图中，比如说：
```python
loss = dummy * 5
```
那 PyTorch 反向时就会从 `loss` → `dummy`，调用你的：
```python
SpecifyGradient.backward(grad_scale)
```
这个 `grad_scale` 就是：
$$
\frac{\partial \text{loss}}{\partial \text{dummy}} = 5
$$
也就是链式法则中上一层传下来的 ∂L/∂y。

## ✅ 所以你图里这段话：

  

> 这个就是 `grad_scale`，是上层传下来的梯度

  

非常准确，就是链式法则中的 ∂L/∂y。

  

你只要记住：

  

> backward 的参数，就是 loss 对你 **output** 的导数，

> 你需要乘上你这个模块对 input 的导数，才得到最终要传回去的梯度。

  

这样你就理解 PyTorch 自定义 backward 的机制了。你说的 “这个 chain 的上层吗？” 说得完全正确。


---




## ctx
也就是forward和backward的中间结果
解释：在forward里算过的一些中间结果，如果在backward里还需要用到，就把他存到ctx中

```python
class SquareFn(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x):
        ctx.save_for_backward(x)  # 把 x 暂存起来
        return x * x

    @staticmethod
    def backward(ctx, grad_output):
        x, = ctx.saved_tensors
        return 2 * x * grad_output
```
**说明**：
* `x * x` 是前向计算的结果
* 但反向传播的时候我们要用 `∂(x²)/∂x = 2x`
* 所以我们 **在 forward 里把 x 存进 ctx**
* 在 backward 里通过 `ctx.saved_tensors` 取出来用
 **如果不存呢？**
那你在 backward 就得重新计算，或者根本得不到想要的数据（比如 `x` 已经丢了）
**前向过程中产生的、但反向传播时还要用的变量**，为了避免重算、节省内存、保持梯度正确，要临时保存下来 —— 用的就是 ctx。

---






light做积分，不适合实时，所以这里用的是近似+lookup的方法

**真实物理中的光线传播是积分**
比如一个表面的出射 radiance：

$$
L_o(p, \omega_o) = \int_{\Omega} f_r(p, \omega_i, \omega_o) \cdot L_i(p, \omega_i) \cdot \cos\theta_i \, d\omega_i
$$

你要：

* 遍历所有入射方向 $\omega_i$
* 对每个方向：
  * 乘 BSDF
  * 乘入射光
  * 乘角度因子
* 最后积分

**所以这里使用近似+lookup**
> 对于diffuse：
* 对环境贴图做一次 cosine-weighted convolution
* 得到一张 diffuse 环境贴图（全方向模糊版）
* 渲染时直接查表就行，不需要实时积分！

> 对于specular：
* 构建多级 mipmap，模拟不同粗糙度下的模糊反射
* roughness 越大 → 查越模糊的 mip 层
* 用 `mip_level = roughness_to_lod(roughness)` 决定查哪层
