---
title: Conda
---

```
positional arguments:
  command
    clean        Remove unused packages and caches.
    compare      Compare packages between conda environments.
    config       Modify configuration values in .condarc. This is modeled
                 after the git config command. Writes to the user .condarc
                 file (/home/j/.condarc) by default.
    create       Create a new conda environment from a list of specified
                 packages.
    info         Display information about current conda install.
    init         Initialize conda for shell interaction.
    install      Installs a list of packages into a specified conda
                 environment.
    list         List linked packages in a conda environment.
    package      Low-level conda package utility. (EXPERIMENTAL)
    remove       Remove a list of packages from a specified conda environment.
    rename       Renames an existing environment
    run          Run an executable in a conda environment.
    search       Search for packages and display associated information. The
                 input is a MatchSpec, a query language for conda packages.
                 See examples below.
    uninstall    Alias for conda remove.
    update       Updates conda packages to the latest compatible version.
    upgrade      Alias for conda update.
    notices      Retrieves latest channel notifications.

optional arguments:
  -h, --help     Show this help message and exit.
  -V, --version  Show the conda version number and exit.

conda commands available from other packages:
  env
```



* `-c` : channel, it specifies which repository or source Conda should use to find the package
* `-n`: name, it specifies the name of the new environment.
* `conda-forge` is a community-maintained Conda channel that provides up-to-date and well-maintained packages.
* `conda info`: if Conda is correctly installed, this will display information about your installation
* `conda env list`: check available Conda environments
* disable auto activate base env: `conda config --set auto_activate_base false` then `source ~/.bashrc `


## Create

`conda create --name myenv python=3.8`

## Download / install
download -> chmod +x path -> run it -> install
Then add to the path:
`nano ~/.bashrc` -> `export PATH="$HOME/anaconda3/bin:$PATH"` -> `source ~/.bashrc`


## Remove the environment
`conda remove --name myenv --all`
`conda env remove --name myenv`


## Remove cache (not packages in using)

`conda remove --all`
remove cache, it won't affect the existing environments. 

## Delete  env

`conda remove --name xxxxxx --all`

## List all existed env
`conda env list`

### Check if specific package is installed
`conda list | grep -E "diffusers"`

log: 
`conda install -y -c pytorch pytorch=2.0.0 torchaudio=2.0.0 torchvision=0.15.0`
this is done, with one error: Solving environment: failed with initial frozen solve. Retrying with flexible solve.

### Delete specific package
`conda remove torch`
* notice: if something suddenly broken in your conda environment, just remove that thing, and re-install. Debug will take too long time




## disable conda base environment
disable conda base environment not be  activated on startup:
`conda config --set auto_activate_base false`



---
## Delete all conda things from the computer

#### check rpm
`rpm -qa | grep conda` : show all conda relative things, remove them, for example :
```bash
sudo dnf remove python3-conda python3-conda-package-handling
```

#### check PATH:
`export $PATH` , check if anything conda relative in the output

#### delete others

```bash
rm -rf ~/.conda ~/.anaconda ~/.jupyter ~/.ipython 
```

#### clean DNF Metadata (option)
`sudo dnf clean all`


#### verify if conda all gone
`conda --version`

```bash
export CUDA_HOME=/usr/local/cuda
export PATH=$CUDA_HOME/bin:$PATH
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
```


---
## Make sure we are install under conda
```bash
conda install python=3.10
```
and run 
`which python`, `which pip` it should show something relative conda
if it is not under conda path, then something wrong

> **Always use conda  if available, for package that not available under conda, use pip


After installed a package, can check in the jupyter notebook: 
```
import sklearn
print(sklearn.__file__)
```
output:
`/home/xxx/anaconda3/envs/data_analytic/lib/python3.10/site-packages/sklearn/__init__.py
`

---
## kernel not install

use `conda install jupyter`can solve. sometimes this issue happen from no where. 

---

## Jupyter notebook select Conda env
logic: create conda env --> under this env, create a kernel that jupyter notebook can use --> inside jupyter notebook, select and using that kernel

first `pip install ipykernel`

##### create a kernel
**run** `python -m ipykernel install --user --name=stable_diffusion2 --display-name "Python (stable_diffusion2)"`

##### how can i know if this kernel is point to correct env
```
cat /home/user/.local/share/jupyter/kernels/stable_diffusion2/kernel.json
```
you can see something like 

```
{
 "argv": [
  "/home/user/anaconda3/envs/stable_diffusion2/bin/python",
  "-m",
  "ipykernel_launcher",
  "-f",
  "{connection_file}"
 ],
 "display_name": "Python (stable_diffusion2)",
 "language": "python",
 "metadata": {
  "debugger": true
 }
```
so you can see it is pointing to my specific conda environment
##### 1. `python -m ipykernel install`

- `python -m`: Runs a **Python module** as a script.
- `ipykernel install`: Registers a new **Jupyter Kernel**, which is an execution environment for Jupyter Notebook.

##### **2. `--user`**

- Installs the kernel **only for the current user**, not system-wide.
- Prevents permission issues when running without admin/root access.

##### **3. `--name=sd-env`**

- **Internal name** for the kernel (used by Jupyter to identify it).
- Should match your Conda environment name (`sd-env` in this case).

##### **4. `--display-name "Python (sd-env)"`**

- **Human-readable name** that appears in Jupyter Notebook's kernel selection.
- This makes it easy to recognize when choosing a kernel in **VS Code or Jupyter**.


**check kernel list** : `jupyter kernelspec list`



---

## List all configuration in current conda

* List packages and versions in current conda environment
`conda list`

* Export all configurations including dependencies:
`conda env export`
`conda env export > environment.yml`

* Rebuild the environment according to this yml file
`conda env create -f environment.yml`





























