---
title: Machine Learning
---


## Mean / std
**Standard deviation**
How spread out a set of value is
> if everyone almost the same height, means small standard deviation

**Mean**
The average 

**Logvar**
The logarithm of the variance ( `log(variance)`)


---

## Optimizer
is algorithm that adjusts the model's parameters (weights and biases) in order to minimize the loss function.

1. Forward pass → model makes prediction
2. Compute loss → compare prediction vs ground truth
3. Backward pass → get gradients (how wrong each weight is)
4. OPTIMIZER → uses gradients to update weights properly
e.g. Adam, vanilla gradient descent (SGD)
SGD: every step is the same.
SGD momentum: Don’t just move based on the current gradient — also remember and continue moving in the direction we were previously going.
(previous step direction * γ) + (current gradient)
 → like rolling a heavy ball downhill
 → smoother, faster convergence



---
## Forward pass

Forward pass is the process where input data travels through a neural network, layer by layer, to produce an output prediction. This usually the first step. followed by evaluate its error and adjust its weights in the backward pass.



## Back propagation 
Starting from the output, calculate how much each weight contributed to the loss, use the chain rule to work backwards through each layer, computes the gradient(direction and magnitude of change needed) for every weight/layer/parameters.


## Chain rule
Chain rule is a way to differentiate the composite function, which is a function inside another function, by finding the derivative of outside function and multiplying it with the inside function

$$
\frac{d}{dt} f\bigl(g(h(t))\bigr)
= \frac{df}{dg} \cdot \frac{dg}{dh} \cdot \frac{dh}{dt}
= f'\bigl(g(h(t))\bigr)\, g'\bigl(h(t)\bigr)\, h'(t)
$$


---

## Hyperparameters
**Explain**
The parameters that we have to manually set up, they are not learned by gradient descent. 
For example learning rate, batch size, number of training epochs, optimizer type, number of layers in the model architecture, activation function, kernel size, dropout rate..


---
---
## ML algorithms

### Regression
Tell me several regressions, and what scenario they fit.

**Linear regression:**
Straight line relationship. 
> e.g. predict house price from size

**Polynomial regression**
Extend linear regression, add more $x^2$, $x^3$ etc. 
Show curve relationships. For data is not linear, but still smooth curve. 
> e.g. population growth over time

**Support Vector Regression (SVR)**
![pic](https://scikit-learn.org/stable/_images/sphx_glr_plot_iris_svc_001.png)
**Support Vector Machine (SVM)**
Can do regression or classification
If we have two groups of point in the plane, we want to find a line to separate these two groups, and make sure the distance between them are maximized.


**Decision Tree, Random Forest Regression**
Input data is continuous, and decision tree has if condition, keep split the data


**XGBoost / Gradient Boosting Regression**

---


### Classification

**Logistic regression**
Outputs probability instead of continuous value. For predicting yes or no

.
**K-means**
unsupervised, clustering algorithm, the points in each cluster are similar to each other, and each cluster is different from its neighboring clusters.

**KNN algorithms**
supervised, classification algorithm, it classifies an unlabeled observation based on its K (can be any number) surrounding neighbors.


**Random Forest**
supervised for classification problem.
It operates by constructing multiple decision trees during the training phase, the random forest choose the decision of the majority of the trees as the final decision


---
---


## Bias and Variance
Bias is predicted values are further from the actual values. Low bias indicates a model prediction values are very close to the actual ones.
- Underfitting: high bias
Variance: the amount the target model will change when trained with different training data. A high variance model is unstable and overly sensitive to the training data.
- Overfitting: good on training dataset, bad on test dataset.

**Tradeoff:**
As model flexibility increases (more capacity), bias decrease but variance increase. The optimal point minimizes expected generalization error ($bias^2 + variance + noise$)

### Underfitting and Overfitting
**Solution:**
Underfitting: 
- Bigger capacity
- training longer, increase learning rate
- less regularization/dropout/weight decay
- change the model (for example from CNN to diffusion? VAE?)

Overfitting:
- More training data
- data augmentation
- regularization, drop our, weight decay
- early stopping


---
## Learning rate
**Explain**
The size of each step the optimizer takes while updating weights parameters. 
- Too high: training explodes, cannot converge
- Too low: training too slow, and stuck at bad local minimum
### Warmup
**Explain:**
At the start of training, LR is ramped up gradually from 0 to the target learning rate over the first few hundred or thousand steps.
**Why:**
When the network is uninitialized, large updates are unstable, so warmup prevents explode before it learn something useful

---
## Regularization
**Explain**
Regularization can prevent the model overfitting. Also it can prevent the model from overfitting to noise and outliers in the image task.
**What is L1 and L2**
L1:
![pic](https://builtin.com/sites/www.builtin.com/files/styles/ckeditor_optimize/public/inline-images/1_l2-regularization.png)
L2 / weight decay:
![pic](https://builtin.com/sites/www.builtin.com/files/styles/ckeditor_optimize/public/inline-images/2_l2-regularization.png)

> Drop out -> Check DL Dropout

L1 的惩罚函数：|w|

它是一个 尖的 V 字型，在 w=0 这个点特别尖，  
→ 为了让 loss 最小，模型会“喜欢”把 w 直接放在 0 上（最舒服的位置）  
所以 L1 具有 “稀疏性” → 自动把没用的特征权重裁掉

L2 的惩罚函数：w²

它是 一条平滑的抛物线，在 0 附近是很圆润、很平滑的  
→ 不会有强制把 w 推成 0 的激进行为，只是温柔地让它变小  
所以 L2 保留所有特征，只是不让它们过大 → 更稳定
What is 



- **把一个“惩罚项”加入 loss 里**  
- 这个惩罚项会让 loss 在 w 很大时变得更大  
- 反向传播时，为了减小 loss，**优化器就会自己把 w 往小的方向调整**

what is early stopping and how to do it 
**Early Stopping 是最经典、最有效的防止 Overfitting 的方法之一**。
**一旦模型在 Validation/Dev set 上的表现开始变差，就立即停止训练**，  
而不是盲目继续训练到 epoch 满或者 loss 掉到极低为止。
你可以设置一个 **`patience`** 参数，比如：
- **patience = 5** → 如果连续 5 个 epoch Val loss 没进步，就停止训练
- 保存 **Val loss 最小点的 model checkpoint**，训练结束后**加载它作为最终模型**

Talk about regularization method you met

| Regularization 类型                   | 作用                    | 举例                       |
| ----------------------------------- | --------------------- | ------------------------ |
| **Total Variation (TV loss)** ✅ 最常见 | 让贴图在空间上**平滑、不要高频噪声**  | TV( texture ) = sum(     |
| **L2 / smoothness 正则**              | 抑制贴图的**大强度变化**        | 常用在 normal / roughness 上 |
| **Entropy / sparsity 正则**           | 避免贴图太“花”，鼓励**低熵/少噪点** | 某些 pipeline 加过           |
| **Prior-based 正则（如 clamp 或 range）** | 防止贴图像素爆炸，比如颜色超出 0-1   | 常见在 roughness / metallic |

In nvdiffrec, TV Loss (total variation regularizer)
`loss += texture_reg * l1_smoothness(texture)`

它就是“让相邻像素差不要太大”  
→ **抑制噪声纹理**  
→ 让贴图更“真实/物理合理”





---

## Confusion matrix
in supervised learning, it is called confusion matrix
in unsupervised learning, it called matching matrix
Two parameters:
- actual
- predicted

A confusion matrix is a specific table that is used to measure the performance of an algorithm. 
![example](https://www.simplilearn.com/ice9/frs_images/1-confusion_matrix.jpg)

total observation = 1 + 12 + 3 + 9 =  25
accuracy = (12 + 9) / 25 = 0.84

**What is false positive and false negative**
- False positive: predicted yes, but actually no
- False negative: predicted no, but actually yes


## Precision / Recall
**Precision**
The ratio of events you can correctly recall to the total number of events(mix correct and wrong)
`Precision = (true positive) / (true positive + false positive)`

**Recall**
The ratio of number of events you can recall the number of total events.
`Recall = (true positive) / (true positive + false negative)`


### F1 score
combines both precision and recall, it is also the weighted average of precision and recall
F1 is one when both scores are one.
`F1 = 2 * (precision * recall) / (precision + recall)`


## Type | and Type ||
Type | occurs when the null hypothesis is true and we reject it.
Type || occurs when the null hypothesis is false and we accept it.


## Bayes Theorem
**Explain what is Bayes theorem**
A mathematical formula that describes how to update the probability of something being true when you get new evidence.


$$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}  $$

$P(A|B)$ : probability of A given B -- poster probability
$P(B|A)$ : probability of B given A -- likelihood
$P(A)$: probability of A -- prior probability
$P(B)$: probability of B -- marginal probability

**What is naive bayes:**
Assume all features are independent to each other (which is not possible in the real i)



What is likelihood
What is posterior
what is evidence

## Cross Entropy
Cross entropy measures the difference between two probability distributions, often used as a loss function in the classification task, to evaluate how well a model's predicted probabilities match the true outcome.
$$loss = - Σ ( true\_label * log(predicted\_probs) )
$$
## Likelihood
> **Likelihood answers: “Given my model, how probable is this observed data?”**

Example:  
You flip a coin and get **8 heads out of 10 flips**.  
You wonder if the coin is **fair (p = 0.5)**.

**Likelihood** = Probability of observing **exactly 8 heads** if p = 0.5

$$L(p=0.5)=(0.5)^8×(0.5)^2=0.000976
$$
Likelihood is used to **estimate parameters** (e.g., “what is the best p for this data?” → MLE = maximum likelihood estimation)


## Softmax
**Explain:**
Softmax is a function that turns  raw model outputs (logits) into a probability distribution, meaning all values become positive and sum to 1.
**Where to use it:**
We mainly use it in the final layer of multi-class classification to interpret outputs as class probabilities and to compute cross-entropy
**Compare:**
Compare with argmax, which just return the index of largest value, not differentiable, can only be used in the prediction. Softmax returns probabilities, so it is differentiable.


## Unsupervised learning
**What are unsupervised ML techniques?**
- clustering: data to be divided into subsets, also called clusters, contain data that are similar to each other. Different clusters reveal different details about the objects
- association: identify patterns of associations between different variables or items. Like e-commerce website can suggest other items for you to buy, based on the prior purchases you have made, spending habits, items in your wish-list, other customer's purchase habit etc. (Recommendation engine)


---



---

## General Questions:

**What is supervised and unsupervised learning, reinforcement learning**
- Supervised learning: a model makes predictions or decisions based on past or labeled data.
	- e.g. Email spam detection (labeled spam), healthcare diagnois(providing the image and model decide).
- Unsupervised learning: we don't have labeled data, a model can identify patterns, relationships in the input data.
- Reinforcement learning: the model can learn based on the rewards it received for its previous action.
- Semi-supervised machine learning: contains a small amount of labeled data and a large amount of unlabeled data. (loss has two parts: L_sup + L_unsup, but sharing and optimize the same model)

**What is neural network**
Neural network is a function approximator composed of layers of linear transformations and nonlinear activation functions, which is trained using data to learn a mapping from input to output.
(convolutional layer is also linear transformation)


**What is machine learning:**
Machine learning is a field of AI where computers learn patterns (or mathematical function) from data, instead of explicitly programmed with fixed rules. During the training, the model evaluate its error and updates it parameters using gradient descent or other optimization methods.
- model improves its performance automatically by learning from the training data and adjust its parameters to minimize the errors.

**What is deep learning:**
A subset of machine learning.
Compare: 
- in ML, feature engineering is done manually in ML
- in DL, the model consisting of neural networks will automatically determine which features to use

Data: DL need more data, requires a lot of computing power, while ML only a small amount of data for training


**What is feature engineering**
Using intuition to design new features, by transforming or combining original features. Make it easier for learning algorithm to make predictions.
For example, we have a sentence, and  check
- 2 "FREE" inside, feature1=2
- The portion of capital letters: feature2=0.65
- contain 1 external link: feature3=1
Then we have this feature vector \[2, 0.65, 1], and pass it to ML
This is feature engineering



**What is Gradient descent:**
Gradient descent is an iterative optimization algorithm used to find the minimum of a function. Minimize the error in machine learning model.


**What is loss function:**
The loss function is what the model directly tries to minimize during the training. It measures how wrong the model currently is. It must be differentiable.

| Task           | Typical Loss             |
| -------------- | ------------------------ |
| Classification | Cross-Entropy Loss       |
| Regression     | MSE (Mean Squared Error) |
| GANs           | Adversarial Loss         |
| NeRF           | RGB Reconstruction Loss  |

**What is Metric:**
A metric is used to evaluate model performance, but not necessarily optimized directly, it does not need to be differentiable, just need to be meaningful to humans

| Task           | Typical Metric     |
| -------------- | ------------------ |
| Classification | Accuracy, F1-Score |
| Regression     | MAE, R²            |
| Segmentation   | IoU, mAP           |
| Language Model | BLEU score         |

**What is gradient disappear**
The vanishing gradient problem is a major challenge in training deep neural network, where gradients become extremely small when they back propagate many layers
- layers near the output learn quickly and adjust their weights
- layer near the input receive almost zero gradient signal


**What is tensor:**
It is a data structure, an n-dimensional numerical array used to represent and store data in deep learning frameworks like PyTorch and TensorFlow


**How to handle missing or corrupted data in dataset?**
If the file header is broken, or cannot read, then skip it and log the file index. For example .npy file has metadata as header.
For pure text data, can use IsNull() and dropna() to find the column or rows with missing data and drop them, or Fillna() to replace the wrong value with placeholder value.


**What is three stages of building a model in ML?**
1. Model building (choose suitable algorithm for model and train it)
2. Model testing (check the accuracy of the model through the data)
3. Applying the model (make the required changes after testing and use the final model for real-time projects)

**When will you use classification over regression**
Classification is used when your target is categorical , sparse (gender, predicting yes or no, breed of animal), while regression is used when target is continuous (the score, sales of the product)


**Why we don't like x<0, and activation function usually zero out it**
In deep learning, we are looking for the connections, patterns, so if x>0, means this feature can contribute to identify the pattern. When x<0,   this is not important signal or even worse effect.
So this is why ReLU here, throw away not important features/signals, and make the model more clean, sparse, faster to train.
However, negative value can contain information, so Swish, GELU, LeakyReLU here, if it is negative, more negative, less impact, more positive, more impact.


**Explain logistic regression**
a classification algorithm used to predict a binary outcome for a given set of independent variables.
Any value above 0.5 is considered as 1, and any point below 0.5 is considered as 0.



**What is correlation**
Describe how strongly two variables are related to each other. When one changes, does other tend to change as well.

**What is covariance**
Covariance tells us the direction of linear relationship between two random variables. It can be any value between negative infinitive and positive infinitive


**Why random seed/reproducibility is important**
Fixed random seed to make sure each training result is the same.
Reproducibility to make sure other people can re-do your work, helpful for debug, compare different method

```python
random.seed(seed)                   # Python 随机数
np.random.seed(seed)                # NumPy 随机数
torch.manual_seed(seed)             # PyTorch CPU 随机数
torch.cuda.manual_seed(seed)        # 当前 GPU
torch.cuda.manual_seed_all(seed)    # 所有 GPU（多卡）
```



## ASK
- Can you describe your pipeline?
- What is the next goal of the company?
- What is the most technically challenging  aspect of standing up the operations here, and what is the most politically challenging? Concern about dataset these kind of issue?
- whats the challenge the organization is immediately facing, where is the pain point
- what is your goal are for the organization, and how do you measure success
