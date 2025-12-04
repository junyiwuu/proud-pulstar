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

## Searching / `find`

already in a folder, and want to find anything name with "aa" (recursively)
`find . -name "*aa*"`
`find . -iname "*aa*"` (case insensitive search)
`find . -type d -name "*cache*"` (only show directory)
`find . -type f -name "*log*"` (only show files)

`find /path/cache -type f -mtime +3 -delete`: find cache that older than 3 days ago
`find /path -type f -mtime +7`  :Find all files that the last modified time is 7 days ago


`ls *aa*` : find any file's name contains aa
`ls "*aa*"` :  find the name that exactly equal to `*aa*`




Find keyword in the file: `grep "error" logfile.txt`
Recursive search in a directory: `grep -r "xxx" .` 
> `.` represent the current directory

**grep**

|**Option**|**Description**|**Example**|
|---|---|---|
|**`-i`**|**Ignore Case** (matches 'Keyword', 'keyword', 'KEYWORD').|`grep -ri "fail" .`|
|**`-l`**|**List Files only** (prints only the names of files containing the match, not the matching lines).|`grep -rl "secret" /etc`|
|**`-n`**|**Line Number** (shows the line number where the match was found).|`grep -n "listen" /etc/httpd/conf/httpd.conf`|
|**`-w`**|**Whole Word** (matches "key" but not "keyboard").|`grep -w "port" config.txt`|



---
## Copy / `cp`

* copy from our machine to a remote machine:
`scp myfile.txt ubuntu@192.168.1.30:/home/ubuntu/toRemoteHere.txt`

copy from remote machine to our machine
`scp ubuntu@192.168.1.30:/home/ubuntu/remoteFile.txt toLocalHere.txt`

---
## Remove / `rm`


```bash
rm -rf myfolder
cp -r src_folder dst_folder
```
`-r`: recursive



---
## Serve
### Turn your computer into a quick and easy web server
`python3 -m http.server`
`python3 -m http.server 8000`

* `-m`: tell python to run a module as a script





---
## System / `systemctl` / `systemd`

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

`mc` : terminal version browsing the files
`watch -n1 nvidia-smi` : live-time check nvidia graphic card status






## Check process / `top` / `ps`

`nvtop`  check gpu and other parts live-time status
`top` / `htop` : check process

✔ 查看 Maya 是否真正启动

```bash
ps aux | grep maya
```

`ps`: process status
`a`: show all user's processes
`u`: user friendly format (user, cpu, memory etc)
`x`: show the background services

**Check the memory, cpu of a specific pid:**
`ps -p 4374 -o pid,ppid,cmd,%cpu,%mem`



---

## Disk / `du` / `df`


**`du`: disk usage**

```bash
ls -lh
du -sh *       
du -sh /path/to/dir
```

```bash
du -sh *    
```
show the size of each file/folders in this directory

- `du` disk usage
- `-l`  long format
- `-s`  summary
- `-h`  human readable   (human readable is 125g, non human readable is 130215688)
- `*`  all files/ folders in current directory
- 
The biggest 10 files:
```
du -ah . | sort -hr | head
```
- `-a`  show all files
- `-r` reverse

**`df` disk free**
`df -h` : show disk usage for all filesystems in a human-readable way  (only for filesystem-level disk)
