---
title: conda issues collection
---

## /lib64/libstdc++.so.6: version `GLIBCXX_3.4.30' not found`

1. First check this
```
strings /usr/lib/x86_64-linux-gnu/libstdc++.so.6 | grep GLIBCXX
```
if return : no such file , means you go to this folder and want to find GLIBCXX file but can't find one.
2. try to donwload: 
```bash
conda install -c conda-forge libstdcxx-ng
```
3. even after download still not fix, this means the soft connection is broken.
4. check if conda has it: 
`conda list libstdcxx-ng`
it returns: 
```
# Name Version Build Channel 
libstdcxx-ng 14.2.0 h4852527_2 conda-forge
```
Then check` strings $CONDA_PREFIX/lib/libstdc++.so.6 | grep GLIBCXX_3.4.30`. It turns out no such file. so overall I installed :libstdcxx-ng" but so link is not copied.
5. run 
```bash
ls -l $CONDA_PREFIX/lib | grep stdc++
```
correct shoudl be: 

```
libstdc++.so.6 -> libstdc++.so.6.0.33
libstdc++.so.6.0.33
```

Mine only appear the one without "->" , so my link is broken. So create the link back: 

```bash
cd $CONDA_PREFIX/lib
ln -s libstdc++.so.6.0.xx libstdc++.so.6 
```
Then verify: 
```bash
strings $CONDA_PREFIX/lib/libstdc++.so.6 | grep GLIBCXX_3.4.30
```
Then it shows everything ok. Then can do : `python -c "import torch"`. PyTorch can be import correctly



---




