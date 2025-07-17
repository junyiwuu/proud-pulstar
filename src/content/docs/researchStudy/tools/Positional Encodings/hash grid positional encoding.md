---
title: Hash Grid Positional Encoding
description: Understanding what is Hash Grid Positional Encoding
---

## Overview

Multi-resolution Hash Grid Positional Encoding, derived from [Instant-ngp](https://github.com/NVlabs/instant-ngp) project. 
Practical code: [tiny-cuda-nn](https://github.com/NVlabs/tiny-cuda-nn)
Paper: [Instant Neural Graphics Primitives with a Multiresolution Hash Encoding](https://nvlabs.github.io/instant-ngp/assets/mueller2022instant.pdf)


A fully-connect neural network that arranged into:
* $L$ layers (LOD)
	* each containing up to $T$ feature vectors
		* each feature vectors has up to $F$ dimensions

**The coarsest resolution** (lowest LOD) $N_{min}$
**The finest resolution** (highest LOD) $N_{max}$

**Feature vectors** are on the grid point's position. In 2D case, one grid has 4 points. in 3D case, one grid has 8 points
* When comes to high resolution, we can't give each grid point a feature vector (512\*512\*512 would be a very big number). 
* Therefore we use **Hash Table**, coordinate -> hash function -> hash index. Give feature vector to this hash index.


**Querying a surface point** $P \in \mathbb{R}^3$ , find which grid does $P$ belongs to, since this $P$ high possibly not exactly on the grid point, we find the feature vector for this point by interpolating 4 or 8 corner grid points that on this grid.
Then concatenate all level-wise feature vectors. 
> For example, find which grid does $P$ belongs to on level 1, interpolating and get $P$'s feature vectors --> find the feature vector of $P$ on level 2 --> ... --> concatenate all these features vectors from all levels

With $P$ and corresponding feature vectors, we got the result from the MLP
* Because we use feature vector from all levels, even if the hash collision happen on a high resolution level, the same collision might not also happen on low resolution level. Therefore **mitigate Hash collision**






Breakdown everything and make fully understanding. Here will also including techniques in NeRF


## Code

(tiny-cuda-nn)
```python
import torch
import tinycudann as tcnn  # pip install tinycudann

enc_cfg = tcnn.Encoding(3, {
    "otype": "HashGrid",
    "n_levels": 16,
    "n_features_per_level": 2,
    "log2_hashmap_size": 19,
    "base_resolution": 16,
    "per_level_scale": 1.5
})

x = torch.rand(10, 3).cuda()  # 10 random 3D points
features = encoder(x)
print(features.shape)  # (10, 32) if 16 levels * 2 features/level
```


