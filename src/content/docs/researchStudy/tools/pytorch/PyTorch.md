---
title: pytorch
---




## PyTorch specific:

* Register Buffer: 注册一个不需要训练，但需要与model一起管理（保存，迁移）的tensor。他不是一个可训练的参数，不会参与gradient calculation。







---

* clear the old gradient descent: `.zero_grad()`
* calculate current gradient (by using loss) : `.backward()`
* update gradient descent: `.step()`



## Torch

* torch是pytorch的主体库，提供了tensor操作，autograd(自动求导)，optim(优化)等基本功能
* torchvision，是pytorch官方的一部分，专门面向image processing , computer vision任务

|             |                                |
| ----------- | ------------------------------ |
| torch       | 侧重于通用的深度学习框架功能<br>             |
| torchvision | 提供图像相关的工具function，预训练模型和常用数据集等 |

---
#### torch.utils
*  `torch.utils` 是 PyTorch 中的一个工具包集合，里面按子模块划分，提供各种辅助功能。
- 最常用的子模块是 `torch.utils.data`，主要负责数据集和数据加载器（`Dataset`、`DataLoader`）等。

- `Dataset`：自定义数据集的基类，需要实现 `__len__` 和 `__getitem__` 两个方法。
- `DataLoader`：负责批量加载数据，常见参数有 `batch_size`、`shuffle`、`num_workers` 等。


---
#### Examples:
```python
import torch
import torch.utils.data.dataloader

class mydataset (torch.utils.data.Dataset):
    def __init__(self, data_list):
        self.data = data_list
    def __len__(self):
        return len(self.data)
    def __getitem__(self, idx):
        return self.data[idx]
    
dataset = mydataset([1,2,3,4,5])
dataloader = torch.utils.data.DataLoader(dataset, batch_size=2, shuffle = True)
for a in dataloader:
    print(a)
```
`__getitem__` is a iter, using next(iter(dataloader)) to show the contents


---

#### Others
* tensor是pytorch中最基本的数据结构，用于存储数值，并支持运算，相当于多维数组
* torch.size:当调用tensor的size方法，返回的是torch.size对象，本质上是不可变的tuple,来描述该tensor的个个维度的大小

|           |                               |
| --------- | ----------------------------- |
| squeeze   | 删除tensor中所有大小为1的维度（或指定维度）<br> |
| unsqueeze | 在指定位置添加一个大小为1的新维度             |


* LongTensor通常指的是torch.int64类型的tensor
* permute : `permute(0, 2, 3, 1)` 会将维度从 `[batch, channels, height, width]` 变为 `[batch, height, width, channels]`。

























