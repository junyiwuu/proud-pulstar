---
title: PyTorch
---
## Download:

Current issue: PyTorch 3D pre-compiled version (where you can download directly from pip ) doesn't compatible with GPU(RTX5090) yet. Even though torch itself is working perfectly.

[discussion link](https://github.com/facebookresearch/pytorch3d/issues/1962)
[official link](https://github.com/facebookresearch/pytorch3d/blob/main/INSTALL.md)

How to solve: Build the wheel by yourself.

1. First, install **CUDA 12.8**. Then, install PyTorch using:
`pip3 install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128 `
(already have torch work correctly, skip this)
2. clone the **PyTorch3D** source code and install it:
`git clone https://github.com/facebookresearch/pytorch3d.git` -> 
`cd pytorch3d` -> `pip install -e .`
* But notice there, `-e` means developer mode, so the source code will not be copied into site-packages, but create a soft link which point to the current directory. Therefore when you change the local code, it will be effective immediately..
* Problem : It creates a new environment, not the environment I am currently using, so there is no torch. So the error says `ModuleNotFoundError: No module named 'torch'`
* Solve: `pip install . --no-build-isolation --no-deps`. -> force building under the current environment,  `--no-deps` means don't install dependencies
* 