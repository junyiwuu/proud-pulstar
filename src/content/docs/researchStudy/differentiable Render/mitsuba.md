---
title: Mitsuba notes
---
dr.jit是一个differentiable rendering framework,全名是differentiable renderer Just -In-Time

和nvdiffrast平级，dr.jit更完整，复杂


尝试了直接渲染，
gradient optimization，是将固定的某个部分来作differenital的


## forward rendering

```
# 需要为每个参数单独计算
def visualize_parameter_effect():
    # 计算红色参数的影响
    dr.enable_grad(params['red.reflectance.value'])
    image = mi.render(scene, params)
    red_effect_map = dr.grad(image)      # 红色参数对每个像素的影响
    
    # 重置，计算绿色参数的影响  
    dr.enable_grad(params['green.reflectance.value'])
    image = mi.render(scene, params)
    green_effect_map = dr.grad(image)    # 绿色参数对每个像素的影响
    
    # 可视化每个参数对图像的影响
    plt.subplot(1, 2, 1)
    plt.imshow(red_effect_map)
    plt.title("Red parameter effect")
    
    plt.subplot(1, 2, 2) 
    plt.imshow(green_effect_map)
    plt.title("Green parameter effect")
```
相当于只显示xx对图像的贡献

就像 AOV 帮助艺术家理解光照构成一样，Forward Mode 帮助研究者理解：
- "这个参数主要影响图像的哪些区域？"
- "为什么优化算法对某些参数敏感？"
- "参数变化如何在图像中传播？"
## Reverse rendering

```
# 一次反向传播，得到所有参数的梯度
for iteration in range(50):
    image = mi.render(scene, params)
    loss = mse(image, target)
    dr.backward(loss)                    # 一次计算
    
    # 现在所有参数都有梯度了
    red_gradient = dr.grad(params['red.reflectance.value'])
    green_gradient = dr.grad(params['green.reflectance.value'])
    # ... 更新所有参数
```



## projective sampling

Projective sampling被用来处理differentiable rendering中的visibility discontinuities，核心思想是：
> 在采样路径的时候，同时考虑当前参数例如物体位置，对路径空间本身的影响，从而获得包含visibility项在内的正确导数


正常的渲染里我们做的是：

$$
I(\pi) = \int_P f(\mathbf{x}, \pi) \, d\mathbf{x}
$$

我们希望求：

$$
\frac{\partial I(\pi)}{\partial \pi}
$$

如果 $f$ 是连续的，就可以直接把导数放进积分符号：

$$
\frac{\partial I(\pi)}{\partial \pi} = \int_P \frac{\partial f(\mathbf{x}, \pi)}{\partial \pi} \, d\mathbf{x}
$$

但如果物体的移动让一些光线突然遮挡/不遮挡了物体，就有了**路径空间的拓扑变化**，这个时候你不能简单地对 $f$ 做微分，而是要对整个积分过程本身做微分。这个就需要用到类似 Reynolds transport theorem 的公式，把 **路径空间的变形**也纳入考虑。

Projective sampling 的做法是：

* 在采样的时候，不只是采样光路本身，还记录这个路径对参数 $\pi$ 的依赖；
* 然后在微分时，除了 $f(\mathbf{x}, \pi)$ 的导数，还额外考虑了路径本身变化带来的导数；
* 这样你就得到了正确的 $\partial I / \partial \pi$，即使在 visibility 有跳变的时候也是成立的。

### Path Space (路径空间)

所有从光源出发，经过一系列表面反射，最终到达相机的一条完整路径的集合


每一条路径 $\mathbf{x}$ 就是一组顶点 $(\mathbf{x}_0, \mathbf{x}_1, \dots, \mathbf{x}_n)$，这些点可能是：

* 光源（起点）
* 表面交点（中间反射点）
* 相机感光面（终点）

所以渲染其实就是在 path space 上做积分：

$$
I = \int_P f(\mathbf{x}) \, d\mathbf{x}
$$

其中：

* $P$：整个路径空间
* $\mathbf{x}$：一条具体的路径（路径上的若干个顶点）
* $f(\mathbf{x})$：该路径对最终图像的贡献，比如通过 BRDF、可见性、几何项等计算出来的 radiance




**跟 Monte Carlo 有什么关系？**

现代渲染（特别是 path tracing）就是：

* 随机采样一些路径（在路径空间中抽样）；
* 对每条路径计算 $f(\mathbf{x})$；
* 求这些值的平均，估计积分。

