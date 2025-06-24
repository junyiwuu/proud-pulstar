---
title: Hash Grid Positional Encoding
---






Breakdown everything and make fully understanding. Here will also including techniques in NeRF


## Pre-build library

### tiny-cuda-nn
```python
import torch
import tinycudann as tcnn  # pip install tinycudann

encoder = tcnn.Encoding(3, {
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
## Hash Table