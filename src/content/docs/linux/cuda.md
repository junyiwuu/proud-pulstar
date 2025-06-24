---
title: Cuda-relative
description: recording cuda relative configuration, OS is Rocky Linux
---



## Check if you have cuda
`nvidia-smi`: if the output showing cuda version, then you have cuda (I currently using 12.4)

## Check if you have cuda-toolkit
`nvcc --version` : check the cuda-toolkit version (not the cuda itself version, the toolkit version can be different from cuda version)

### Download the cuda-toolkit version you want
Be aware that when go through some posted repository/paper, they are using different toolkit. Cuda can back tolerate, but the cuda-toolkit must match the author's version
```bash
sudo dnf install -y cuda-toolkit-11-8
```
### Set/switch cuda-toolkit version
```bash
export CUDA_HOME=/usr/local/cuda-11.8 
export PATH=$CUDA_HOME/bin:$PATH 
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
source ~/.bashrc 
```
* after executing PATH, then can check the output of `echo $PATH`
* LD_LIBRARY_PATH environment path, tells the system where to look for shared libraries (.so files) when running programs
* 这是一种临时办法， 并不是永久的，如果是永久就打开`~/.bashrc` 或 `~/.bash_profile`加入这些命令

**CUDA_HOME set the path for CUDA TOOLKIT!!**

### Set/switch cuda-toolkit version in Conda environment
1. 首先要明白自己现在用的是什么版本的cuda toolkit
`ls -ld /usr/local/cuda` 看返回的结果指向哪里
```bash
readlink -f /usr/local/cuda
```
```bash
which nvcc
readlink -f $(which nvcc)
```




---

## Check if you have available cuda (for specific env/proj)

```python
# 检查 CUDA 是否可用
print(f"CUDA 是否可用: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"CUDA 设备数量: {torch.cuda.device_count()}")
    print(f"当前 CUDA 设备: {torch.cuda.current_device()}")
    print(f"CUDA 设备名称: {torch.cuda.get_device_name(0)}")
```