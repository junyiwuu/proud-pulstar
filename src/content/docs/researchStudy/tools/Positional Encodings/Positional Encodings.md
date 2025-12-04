---
title: Positional Encodings
---

## **常见的位置编码（Position Encoding）对比对象**

### 1. **Fourier/Positional Encoding（正余弦编码）**

- 最早在NeRF用的sin/cos编码，也叫Fourier features、PE等。
    
- 公式简单，频率叠加，参数不可学习。
    
- 优点：实现简单，MLP能学高频内容。  
    缺点：参数量随频率线性增长，表示效率一般。
    

### 2. **Learnable Embedding/Grid（可学习网格/查表编码）**

- 类似于Hash Grid，但不用哈希、直接为每个格点分配参数表。
    
- 优点：高效，可学习。  
    缺点：分辨率大时参数爆炸。
    

### 3. **Random Fourier Features（随机傅里叶特征）**

- 类似正余弦编码，但频率由高斯采样。
    
- 有时会配合可学习缩放。
    

### 4. **Sparse Voxel Grids / Octree Embedding**

- 用稀疏体素网格或者八叉树，空间自适应划分，参数更稀疏。
    
- 优点：适合稀疏/大场景。
    

### 5. **Instant-NGP Hash Grid Encoding（主角！）**

- 多分辨率，哈希压缩参数，插值编码，收敛快，空间利用率高。
    

