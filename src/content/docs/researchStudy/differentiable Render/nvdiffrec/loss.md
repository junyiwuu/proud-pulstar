---
title: loss
---

设渲染值为 $R_i$，目标值为 $T_i$，像素总数为 $N$，数值稳定常数为 $\varepsilon$，则：


## MSE
MSE is  the most "harsh" on bright-pixel errors and outliers

$$
\ell_{\rm MSE}
= \frac{1}{N}\sum_{i=1}^N (T_i - R_i)^2
$$


torch.nn.functional.mse_loss on linear HDR values


---

## SMAPE



$$
\ell_{\rm SMAPE}
= \frac{1}{N}\sum_{i=1}^N
\frac{\lvert T_i - R_i\rvert}
     {\lvert T_i\rvert + \lvert R_i\rvert + \varepsilon}
$$
SMAPE/RELMSE 用局部强度做分母，自动抑制了亮处误差。

---

## RELMSE

$$
\ell_{\rm RELMSE}
= \frac{1}{N}\sum_{i=1}^N
\frac{(T_i - R_i)^2}
     {T_i^2 + R_i^2 + \varepsilon}
$$

**Low**: bright-pixel errors are divided by a large I2+R2I2+R2, so down-weighted.

**High** at dark pixels: when both I,R ⁣≈ ⁣0I,R≈0, denominator is tiny → huge penalty for small errors.

---

## Log-L1
   （先对像素加 1，再取对数，再做 L1）

$$
\ell_{\log L1}
= \frac{1}{N}\sum_{i=1}^N
\Bigl\lvert \log(T_i + 1)\;-\;\log(R_i + 1)\Bigr\rvert
$$

Log-L1/L2 先做对数／伽马压缩，高光变化被大幅缩小。





---

## Log-L2
   （先对像素加 1，再取对数，再做 MSE）

$$
\ell_{\log L2}
= \frac{1}{N}\sum_{i=1}^N
\Bigl(\log(T_i + 1)\;-\;\log(R_i + 1)\Bigr)^{2}
$$

其中，$\varepsilon$ 通常取很小的常数（如 $10^{-6}$）以防分母为零。




---

## l1
torch.nn.functional.l1_loss on linear HDR values