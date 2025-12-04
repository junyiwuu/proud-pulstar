---
title: loss
---






## Earth Mover Distance (EMD)
把一个distribution“变形”成另一个分布，所需要的搬运的最小工作量



$$
W(P, Q) = \inf_{\gamma \in \Pi(P, Q)} \mathbb{E}_{(x, y) \sim \gamma} [\|x - y\|]
$$


- $γ$ 是 joint distribution，表示把 P 的质量搬到 Q 的方式
- $∥x−y∥$ 是搬沙子要走的距离
prohibitively expensive in high dimensions and with large sample sizes

---
## Wasserstein Loss
approximate EMD
(Why it is important to know: It tells how to measure distance between distributions, which is a core idea in generative models.)


discriminator: 辨别真假（输出概率[0, 1]之间）
critic: 输出一个实数值，代表输入样本“有多真实”（越高说明越接近真实分布）（输出任意实数）


