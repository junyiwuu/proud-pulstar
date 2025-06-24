---
title: Train a diffusion model
---
How to train a UNet2DModel from scratch on a subset of ...dataset
要对应看jupyter notebook，这篇post中只记录记忆点的code
## Dataset
[The dataset we using ](https://huggingface.co/datasets/huggan/smithsonian_butterflies_subset)

**dataclass**
configuration train 


**datasets**
load_dataset
### Configuration
利用装饰器快速生成类的初始化方法
```python
@dataclass
class TrainConfig:
    image_size = 128  #the generated image resolution
    train_batch_size =16
    eval_batch_size = 16
    num_epochs = 50
    gradient_accumulation_steps = 1
    learning_rate = 1e-4
    save_image_epochs = 10
    save_model_epochs = 30
    mixed_precision = "fp16"  # `no` for float32, `fp16` for automatic mixed precision
    output_dir = "ddpm-butterflies-128"  # the model name locally and on the HF Hub
    push_to_hub = True  # whether to upload the saved model to the HF Hub
    hub_model_id = "<your-username>/<my-awesome-model>"  # the name of the repository to create on the HF Hub
    hub_private_repo = None
    overwrite_output_dir = True  # overwrite the old model when re-running the notebook
    seed = 0

config = TrainConfig()

```
---

### Load and Visualize the data
```python
#from datasets import load_dataset
config.dataset_name = "huggan/smithsonian_butterflies_subset"
dataset = load_dataset(config.dataset_name, split="train")

fig, axs = plt.subplots(1, 4, figsize=(16, 4))
for i, image in enumerate(dataset[:4]["image"]):
    axs[i].imshow(image)
    axs[i].set_axis_off()

fig.show()
```

* 注意：`dataset[:4]["image"]`这里的后面的"image",对应的是数据集里面的类别，可以打开数据看：[The dataset](https://huggingface.co/datasets/huggan/smithsonian_butterflies_subset)
* for i, image in ....: 对应的是index and value
---
## Data pre-process 

数据预处理：使用torchvision的transforms对图像进行预处理
```python
#from torchvision import transforms
preprocess = transforms.Compose(
    [
        transforms.Resize(  (config.image_size, config.image_size)  ),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor (),
        transforms.Normalize( [0.5] , [0.5]),
    ]
)

def transform(examples):
    images = [preprocess(image.convert("RGB")) for image in examples["image"]] 
    return {"images" : images}

dataset.set_transform(transform)
train_dataloader = torch.utils.data.DataLoader(dataset, batch_size = config.train_batch_size, shuffle = True)
```
* transform.compose是把多个预处理组合起来的
* 先将图片重新整理大小，和config的image_size对上
* 随机水平翻转
* transfer image to tensor, for PyTorch to calculate
* normalize tensor, 常用于加速模型训练。这里均值和标准差都设为 0.5，将像素值范围从 \[0, 1] 映射到 \[-1, 1]。

---


---
## Issues:
### When after loading matplotlib, kernel crash

sometimes the version between libraries not match, upgrade the library to solve the issue
solution:
```bash
pip install --upgrade matplotlib numpy
```






---

Two modes in PyTorch: eval() and train()
* eval(): turn off Dropouts layers, BatchNorm layers
	* another evaluation/validation is using `torch.no_grad()` in pair with `model.eval()` to turn off gradients computation
	* Purpose: set to eval() because you want ot train part of the parameters ?





latent_scale_factor : VAE latent space
it defines the pixels space and VAE latent space ratio relationship
* if latent_scale_factor = 8, means you have `512*512` image, and it will be `64*64` in latent space



Dataset的处理
* it is recommend using Dataset from PyTorch (use it as super class)



### 1. 数据准备

- **加载数据**：首先你需要准备好训练用的图像数据，通常会把图像读入内存或者利用数据加载器（例如 PyTorch 的 DataLoader）。
    
- **转换为 Tensor**：图像需要转换成 tensor，并根据模型要求进行归一化或其他预处理操作。
    

### 2. 模型组件和冻结参数

- **选择需要微调的部分**：如果你只希望调整 UNet，而其他部分（例如 VAE 或文本编码器）保持不变，可以在加载预训练模型后，将其他模块的参数冻结（即不计算梯度，不更新参数）。
    
- **冻结方法**：通常对不需要更新的部分调用 `requires_grad=False`。
    

### 3. 处理文本提示（Tokenizer）

- **文本条件**：对于像 Stable Diffusion 这样的文本到图像生成模型，文本条件很重要。如果你的任务不依赖于具体的文本提示，你可以设计一个“空白”或固定的提示。但通常建议还是给出合理的文本描述，因为这会影响模型生成的结果。
    
- **Tokenizer 的作用**：Tokenizer 的作用是把文本转换成模型能够理解的 token 序列。即使你用的是一个固定提示，也需要保证输入形式符合模型要求。
    

### 4. 定义损失函数

- **噪声预测损失**：在 Diffusion 模型中，常见的做法是在潜空间中加入噪声，让模型学习从噪声中恢复原始数据，常用的损失是均方误差（MSE）。
    
- **只计算 UNet 的损失**：由于其他部分被冻结，所以梯度只会在 UNet 上进行传播，损失计算过程和标准训练类似。
    

### 5. 训练循环与 Epoch 概念

- **Epoch 的定义**：一个 epoch 指的是模型已经遍历了一次整个训练数据集。例如，如果数据集中有 10,000 张图片，经过一次完整的前向和反向传播后，这个过程就称为一个 epoch。
    
- **训练循环内部主要操作**：
    
    - **批次处理**：数据集被划分成若干个 batch。在每个 batch 中，你会：
        
        - 从数据加载器中读取一批图像和对应的文本提示（如果有的话）。
            
        - 对图像进行必要的预处理，转换成 tensor。(同时做normalization等预处理)
            
        - 对文本进行 token 化（如果需要）。
            
    - **前向传播**：将 batch 数据输入到模型中，通常包括添加噪声、根据当前时间步和噪声进行 UNet 的预测。
        
    - **计算损失**：根据预测和真实的噪声计算损失。
        
    - **反向传播和参数更新**：反向传播梯度并仅更新 UNet 的参数，其他参数因被冻结而不变。
        
    - **记录和监控**：保存损失值，定期保存模型 checkpoint，以便观察训练效果或防止训练中断时丢失进度。



**图像 PNG → tensor（预处理） → latent（编码） → tensor（扩散/处理） → latent（反扩散） → tensor（解码后处理） → PNG**

扩散过程是在latent空间里面做的



