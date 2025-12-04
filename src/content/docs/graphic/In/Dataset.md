---
title: dataset
---

## Dataloader / Dataset pipeline
Preprocess can also include read header for JPG, PNG etc, to check if the file are broken.
1. Preprocess the data, for example read beauty and its corresponding albedo image, do transformations(to tensor) and normalization
2. Pass to dataloader, tell batch size, shuffle or not


## Cross validation
(k-fold cross validation)
When there are not enough dataset.
Split the trainset into K portions, use one as validation, and rest of them for training
To avoid one split pattern make the result not reliable.

---

## Normalization / Standardization
**Normalization Explain:**
Bring features to comparable scales, 

For image:
`x = (x / 127.5) - 1` or `x = x / 255`
`x_norm = x / 255.0 * 2.0 - 1.0 # [0, 255] -> [-1, 1]`
> simple and fast, but doesn't center the data

**Standardization Explain:** 
Zero-mean and unit-variance
$$x' = \frac{x - \mu}{\sigma}$$
Popular in traditional ML

**Image per-channel mean-std normalization**
For RGB image, 

```
mean = [0.485, 0.456, 0.406]   ← ImageNet RGB mean
std  = [0.229, 0.224, 0.225]   ← ImageNet RGB std
```
Then every pixel is normalized per channel: (RGB each normalized with their own distribution)
```
image[i] = (image[i] - mean) / std
```
**pros:**
These number comes from ImageNet dataset, shows the real data distribution.  Center zero, prevent the color bias(so one channel lead the training), unify the variance, so balance the gradient between channels


## Normalize
BatchNorm and GroupNorm happen inside the model during training, to stabilize optimization. not just preprocessing
Keep  activations in ranges where gradients don't vanish or explode, so can training deep network
### Batch normalization
Do normalization for each channel, on each batch.
So one channel in one batch got normalized. Help training speed and stability.
Most used in CNNs.
Fails on small batch size, bad for GAN


> How to do normalization: 
> 1.  one channel in one batch, all pixels, calculate standard deviation and mean
> 2. `(x-mean)/std`

### Group normalization
Do normalization per sample, not across batch. Separate channels into groups.
Used in style transfer, GANs, object detection.
Good for small batch size, less effective than batch normalize when batch size is large.







---
## Data Augmentation
**Explain:**
A method that we artificially increase the size and diversity of the training dataset by applying random and realistic transformation to the data. The goal is to help the model generalize better, avoid over fitting.
- help when dataset is small
- prevent overfitting
- makes the model more robust (real world variation)

**Methods:**
Random crop, Flip (horizontal/vertical), rotation, Gaussian blur, noise, color jitters, cutout, random erase, mix-up (blend two images)




---
## Epoch
**Explain**
one complete pass through the entire training dataset during training.
> e.g. The dataset has 1000 training images
> Epoch 10 -> gone through the whole dataset 10 times

**Why do we need multiple epochs**
Model (especially neural network) don't learn everything in one pass. It gradually improve by repeatedly revisiting the data and updating weights a bit each time. More epoch can be more stable and good performance.

Everytime, we don't feed all data in one go in one epoch, they are divided to **batch size**, for example 32, 64 etc
> e.g. Samples: 1000. Batch size =100, so one epoch has 1000/100=10 iterations/batch
> Batch size= 128, so one epoch has 1000/128 = 7.8 -> 8 iterations/batch




---

## Batch size / mini-batch

Full batch means all data, but we don't want to feed in all data in one go, can be very slow.
batch size normally is your mini-batch size
$$real\_gradient = \mathop{E}_{all\_data}[\nabla_w L]  $$

$$approximate\_gradient = \frac{1}{batch\_size} \sum_{i=1}^{batch\_size} \nabla_w L(x_i)  $$

batch 越大 → **估计越稳定**（噪声小）  
batch 越小 → **训练更随机，可能跳出局部最优，但太抖会训练不稳**


|概念|意义|
|---|---|
|**batch size**|每次训练 step 用多少数据算梯度|
|**mini-batch training**|主流训练方式——通过“分批训练”在速度、稳定性、显存之间取得最佳平衡|

- Large batch size, gradient is more "averaged" and stable, so can use bigger learning rate
- Small batch size, gradient is more noisy, learning rate must be smaller to avoid exploding.


---


## Data leakage
**Explain**: Data leakage occurs when a model uses information during training that wouldn't be available at the time of prediction.
Leakage causes a prediction model to look accurate until deployed in its use case, then it will yield inaccurate results, learning to poor decision-making and false insights.


## train / val / test split
|Split|Used When|Purpose|Model is allowed to _learn_ from it?|
|---|---|---|---|
|**Training set**|during fitting|updates model parameters (weights)|✅ yes|
|**Validation set**|during experimentation / tuning|pick best hyperparameters, early stopping, feature choices, model selection|⚠️ _indirectly_ (no gradient! but decisions _are_ influenced)|
|**Test set**|_only at the very end, once_|unbiased estimate of how good the final model actually is|🚫 absolutely not|

### The workflow

1. **Train** your model on the training set. `model.fit(train_X, train_y)`
2. **Use validation set to make decisions** such as
    - choose learning rate, depth, layers, regularization, etc.
    - pick which epoch to stop at (avoid overfitting)
    - compare two model architectures
    - don't report these numbers publicly — they're already “tainted”
3. **Freeze final model & hyperparameters** after validation.
4. **Run exactly once on test set**  
    This is your _true_ performance metric for paper / business / resume.

|数据量规模|推荐比例 (train / val / test)|
|---|---|
|**大数据 (≥ 1M 样本)**|98% / 1% / 1% 或 95 / 3 / 2|
|**中等 (~ 100k)**|80% / 10% / 10% (最常见)|
|**小数据 (< 10k)**|70% / 15% / 15% 或直接 **Train + K-fold CV + Test**|
|**极小数据 (~ 1k 或更少)**|**不固定验证集**，用 `K-fold cross-validation` 替代 val，并留极少量 test（or no test at all）|


## General questions

**Does image dataset need camera intrinsics / extrinsics?**
If the dataset is 2D pure image, for generative task , probably no. But if we want to generate for 3D task, we need camera intrinsics extrinsics data to make the training data match with the original data. (think about nvdiffrec)



- 时间序列 / 视频数据 **不可以随意 shuffle**，为什么？
因为顺序本身就是有意义的，把因果顺序打碎会破坏学习目标本身