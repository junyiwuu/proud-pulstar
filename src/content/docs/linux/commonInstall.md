---
title: Common Install
description: common but not common commands
---
## Install Nvidia-driver
[Rocky official instructions](https://forums.rockylinux.org/t/nvidia-drivers-on-rocky-linux/12366)
```graphql
# elrepo-release and epel-release are part of extras
# epel may not be necessary, but it does not hurt to enable it.
% dnf install elrepo-release epel-release -y

# CRB/PowerTools must be enabled
% crb enable

# Perform a dnf update now
% dnf update -y

# Reboot if you had a kernel update
% init 6
```

The driver installation is straightforward.

```shell
# Install the kmod driver
% dnf install kmod-nvidia

# If you find the driver is not available, enable the testing repository.
% dnf config-manager --enable elrepo-testing

# Once installation is done, reboot
% init 6
```

Some users may want cuda support. RPMFusion does provide a cuda subpackage.

```shell
% dnf install xorg-x11-drv-nvidia-cuda
```

---



## Install Houdini
**Old Installer way**
1. Unpack the tar,gz file, and go into the folder
2. From terminal: `sudo bash houdini.install`
3. Run the installing
4. `cd /opt/hfs20.5.522`
5. `source houdini_setup`
6. The might showing miss "libSxx" (something like this)
7. `sudo dnf install libGLU libXScrnSaver`
8. Run houdini: `houdini`