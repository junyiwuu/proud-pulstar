---
title: Docker
description: docker topic relative issues / installation / tips
---
## Installation 
### Basic installation:
I'm using Rocky Linux (RHEL)
Follow  the official instruction first: [link](https://docs.docker.com/desktop/setup/install/linux/rhel/)
Then in terminal : `docker version`, it reply something. Then` docker run --rm hello-world` to check if working correctly. 
**BUT!  probably don't install desktop, it may make the docker cannot detect GPU(very strange but after i uninstall desktop everything work)**
**Need to install docker engine**
[link from official install docker engine](https://docs.docker.com/engine/install/rhel/)

**ALSO** follow this one [Install the NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
[Another post might be helpful ](https://collabnix.com/introducing-new-docker-cli-api-support-for-nvidia-gpus-under-docker-engine-19-03-0-beta-release/)
* check if container able to connect GPU:
`sudo docker run -it --rm --gpus all ubuntu nvidia-smi`
if no error, and print something (the driver info), then connected
### Require "pass"
**Because for linux system, it force to use authentication**
1. `gpg --full-generate-key`: then follow the instruction, here I use the same username and email that I used for docker. Others are all default.
2. `gpg --list-keys`: find the key id here (the very long public key I guess)
3. `pass init <your_gpg_key_id>`: it will say "created directory xxx, password store initialized for xxx"
4. `docker login -u <username>`: fill in the docker username, and the password (when register on the docker)
5. try `docker run --rm hello-world` again


---


## other issues:
### "Cannot connect to the Docker daemon at ...xxx.sock"
Because installed Docker Desktop previously, so need to remove the left things.

```
rm -rf ~/.docker/desktop
rm -f ~/.docker/config.json
```


### put the user into docker's group
Docker by default need sudo to run. But we can add yourself into docker's user group:

```bash
sudo usermod -aG docker $USER
```
Then restart the shell. If you are on GNOME desktop, you need to log out and log in.




## Concepts:
| 名词            | 是什么                                      | 举例 / 类比                            |
| ------------- | ---------------------------------------- | ---------------------------------- |
| **Image**     | 类似系统镜像（像 `.iso`），包含代码和依赖，可以用来启动容器        | `ubuntu:20.04`, `nvidia/cuda:12.2` |
| **Container** | 从 image 启动出来的“实例”，是一个运行中的环境，可以进、可以退出、可以删 | 类似“虚拟机正在运行”                        |
| **Volume**    | 专门用来挂载数据的东西（你可以把容器数据保存在这）                | 类似云盘、硬盘                            |
| **Network**   | 容器之间的虚拟网络设置（一般默认自动管理）                    | 类似局域网                              |



## Basic operations:
* Enter an Image:
`docker run -it <image_name> `
* exit from the image
`exit`
* delete the image:
`docker rmi <Image_ID> `