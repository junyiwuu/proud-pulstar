---
title: Common Commands
description: Record the commands that I met
---
this is overview?


---
## Folder permission

### Check folder permission
`ls -ld /path/to`
####  Check if you have write permission
````bash
[ -w /path/to/folder ] && echo "Writable" || echo "Not Writable"
````

---
### Understand output
`drwxr-xr-x. 12 root root 144 Jan 18 16:54 /usr`
* `d` : it is a directory
* `rwx`: The **owner** can read(**r**) write(**w**) execute(**x**).
* `r-x`: The **group** can read and execute but not write.
* `r--`: **Others** can only read.

---
### Change folder permission
#### Grant full ownership to yourself
`sudo chown your_username /path/to`
<span style="color: grey;">this is permanent change</span>
#### Grant group ownership
`sudo chown root:group_name /usr`

#### Grant group some permission
`sudo chmod 770 /path/to`
- `7` → **Owner (root)**: Read, Write, Execute
- `7` → **Group (your_username or users)**: Read, Write, Execute
- `0` → **Others**: No access

***Apply recursively***
`sudo chmod -R 770 /path/to/folder`


---
---
---
## Group
### Create a new group
`sudo groupadd __groupname__`

### Add a user to the group
`sudo usermod -aG _groupname_ _username_`
* `-aG`: append the user to the specified group

###  Lists users in a group
`getent group _groupname_`


---
---
---
## Mount
### Install 

```sh
sudo dnf install ntfs-3g
```

### Find the partition
```sh
lsblk
```

for example : /dev/sdb2

### Mount it 

```sh
sudo mount -t ntfs-3g /dev/sdb2 /mnt/D
```
`-t`: specify the file system type

**Make it always mount after reboot**:
```sh
sudo nano /etc/fstab
```
add line at the end: 
```
/dev/sdb2   /mnt/D   ntfs-3g   defaults   0   0
```
`defaults` : mount options
>- `rw` → Read & write access
>- `suid` → Allow set-user-ID programs
>- `dev` → Allow device files (e.g., `/dev/null`)
>- `exec` → Allow executing binaries
>- `auto` → Mount automatically at boot
>- `nouser` → Only root can mount
>- `async` → Enable asynchronous I/O


`0`:  Dump option, control filesystem backup 
> `0` means do not backup with the dump command

`0` : Filesystem check order,  controls `fsck` (filesystem check) at boot
>`0` means do not check (recommended for NTFS)
>Linux-native filesystems (like `ext4`) usually have `1` or `2` instead.

Then reload:
```sh
sudo mount -a
```
`-a`: mount all



---
---
---

## Finding

already in a folder, and want to find anything name with "aa" (recursively)
`find . -name "*aa*"`

`ls *aa*`






---
## Kernel
**Show current kernel**
`uname -r`

**List all kernels**
`rpm -q kernel`

**Remove certain kernel**
`sudo dnf remove kernel-<version>`

**check GRUB** so the deleted kernel not display on the GRUB boot menu
1. check`ls /boot/vmlinuz-* /boot/initramfs-*` then you  might see:
```
[xxx]$ ls /boot/vmlinuz-*
/boot/vmlinuz-0-rescue-5b633ea425544c99914b0944b06a7c25
/boot/vmlinuz-5.14.0-503.23.1.el9_5.x86_64
/boot/vmlinuz-5.14.0-503.23.2.el9_5.x86_64
[xxx]$ ls /boot/initramfs-*
/boot/initramfs-0-rescue-5b633ea425544c99914b0944b06a7c25.img
/boot/initramfs-5.14.0-503.23.1.el9_5.x86_64.img
/boot/initramfs-5.14.0-503.23.1.el9_5.x86_64kdump.img
/boot/initramfs-5.14.0-503.23.2.el9_5.x86_64.img
/boot/initramfs-5.14.0-503.23.2.el9_5.x86_64kdump.img
```

2. remove everything about this kernel, full clean it 
```bash
sudo dnf remove $(rpm -qa | grep 5.14.0-503.35.1.el9_5)
```

---
## Copy

* copy from our machine to a remote machine:
`scp myfile.txt ubuntu@192.168.1.30:/home/ubuntu/toRemoteHere.txt`

copy from remote machine to our machine
`scp ubuntu@192.168.1.30:/home/ubuntu/remoteFile.txt toLocalHere.txt`



---
## Serve
### Turn your computer into a quick and easy web server
`python3 -m http.server`
`python3 -m http.server 8000`

* `-m`: tell python to run a module as a script





---
## System

### systemd
Linux init system, they start when the system start


### systemctl


`systemctl` is a command allows us to interact with the **systemd** process / daemon


`echo "test 123" &`   when adding & at the end, it means put `echo "test 123" ` in the background, and return an ID Number


### check certain program PID
`pgrep sshd`


| command      | Description                     |
| :----------- | :------------------------------ |
| `pgrep sshd` | check certain program's PID<br> |
| `echo $!`    | check latest programs           |
| `ps aux`     | check current running program   |
|              |                                 |
|              |                                 |
|              |                                 |



---


---
`sudo ncdu .`  check the disk space
`nvtop`  check gpu and other parts live-time status
`mc` : terminal version browsing the files
`watch -n1 nvidia-smi` : live-time check nvidia graphic card status