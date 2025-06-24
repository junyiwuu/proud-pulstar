---
title: tiny-cuda-nn
---

## Download
```
$ git clone --recursive https://github.com/nvlabs/tiny-cuda-nn
$ cd tiny-cuda-nn

$ git clone --recursive https://github.com/nvlabs/tiny-cuda-nn
$ cd tiny-cuda-nn
```

**add cuda to the $PATH:**
`export PATH="/usr/local/cuda-11.8/bin:$PATH"`

**and $LD_LIBRSRY_PATH:**
`export LD_LIBRARY_PATH="/usr/local/cuda-11.8/lib64:$LD_LIBRARY_PATH"`


THEN： 这是official 网站上说的做法
```
tiny-cuda-nn$ cmake . -B build -DCMAKE_BUILD_TYPE=RelWithDebInfo
tiny-cuda-nn$ cmake --build build --config RelWithDebInfo -j
```
第一次尝试：
**The first line will ask about compute_architecture**
1. check my GPU compute compability
	`nvidia-smi --query-gpu=compute_cap --format=csv`
2. input the command :
	`cmake . -B build -DCMAKE_BUILD_TYPE=RelWithDebInfo -DCMAKE_CUDA_ARCHITECTURES=86`
**fmt issue:**
seems like fmt version (check in the fmt cmake file) doesn't support my cmake version, therefore download the latest fmt into dependencies folder


第二次尝试（因为重装电脑有了新显卡）：
1. 因为链接显示CUDA TOOLKIT12.8一直有问题，所以用这种直接的方式显示的连上
```
cmake . -B build   -DCMAKE_CUDA_COMPILER=/usr/local/cuda-12.8/bin/nvcc   -DCUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda-12.8   -DCMAKE_BUILD_TYPE=RelWithDebInfo   -DCMAKE_CUDA_ARCHITECTURES=120
```
2. 照常运行：`cmake --build build --config RelWithDebInfo -j`
3. 将cmakelist.txt中的 `target_link_libraries(tiny-cuda-nn PUBLIC ${CUDA_LIBRARIES} ${TCNN_LIBRARIES} fmt)` 最后的部分改成`fmt::fmt`。最后也就是`target_link_libraries(tiny-cuda-nn PUBLIC ${CUDA_LIBRARIES} ${TCNN_LIBRARIES} fmt::fmt)`
4. compile成功（terminal会有很多Remark warning，不用管，只是fmt的报错风格）



---

## How to use tiny-cuda-nn in conda environment

install it into your enviornment
First activate your conda envrionment,
Then: 
```
tiny-cuda-nn$ cd bindings/torch
tiny-cuda-nn/bindings/torch$ python setup.py install
```

Pytorch version should support CUDA
for example now my pytorch version is  2.6.0+cu124
(How to check? in the terminal, use python, `import torch)` --> `print(torch.__version__)`
But now the CUDA version  that I used for compile is 11.8



