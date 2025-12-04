---
title: nvdiffrecmc
---

## Installing
```
conda create -n nvdiffrecmc python=3.12
conda activate nvdiffrecmc
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128
pip install ninja imageio PyOpenGL glfw xatlas gdown
```
install nvdiffrast: 
git clone the repository, get into the repo. 
Need to set up several things to support 
```bash
export NVDIFFR_USE_EGL=ON
export EGL_INCLUDE_DIR=/usr/include
export EGL_LIBRARY=/usr/lib64/libEGL.so
pip install .
```

install tiny-cuda-nn:
```
export TCNN_CUDA_ARCHITECTURES=120
pip install git+https://github.com/NVlabs/tiny-cuda-nn/#subdirectory=bindings/torch
```
修改nvdiffrecmc中的一些代码：torch.cross，在最后加上dim=-1

似乎EGL的问题还是并没有修复，所以直接用
修改train.py中`glctx = dr.RasterizeGLContext()` 改成 `￼glctx = dr.RasterizeCudaContext()`


```

```