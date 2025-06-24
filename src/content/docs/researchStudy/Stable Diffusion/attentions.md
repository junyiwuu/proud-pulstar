---
title: attentions
---









## Self attention
![softmax](https://jalammar.github.io/images/t/self-attention-matrix-calculation-2.png)
Q = query
K = key
V = value


在 Stable Diffusion 的 **UNet** 中，包含了若干层 **Cross-Attention** 机制。这些层需要将“文本编码器输出的向量”与“UNet 内部的潜变量表示”相互作用。为了完成这种注意力操作，模型会包含若干 **线性层（Linear Layer）**，也称为“投影矩阵（projection matrix）”。

- **Cross-Attention 的大致流程**
    
    1. 将文本嵌入（通常是 `[batch_size, seq_len, hidden_dim]`）投影到 `query` / `key` / `value` 空间；
    2. 将潜变量的特征也投影到相应的空间；
    3. 计算注意力得分并进行加权。
- **权重矩阵**
    
    - 这些线性层的权重就保存在 **UNet** 的模型参数里。
    - 在 PyTorch 中，常以 `nn.Linear(in_features, out_features)` 形式出现，其内部保存一个形状为 `[in_features, out_features]` 或 `[out_features, in_features]` 的权重矩阵。

当你调用 `unet(...)` 时，输入的 `encoder_hidden_states`（即文本嵌入）会经过这些线性层进行投影。如果 `in_features`（例如 768）和 `out_features`（例如 1024）不匹配你的实际输入，就会出现矩阵相乘维度错误。
## Cross Attention

**Cross attention**

