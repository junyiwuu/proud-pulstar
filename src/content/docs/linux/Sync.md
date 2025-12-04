---
title: Syncing
---


## **lsyncd**

### Install lsyncd

```bash
sudo dnf install lsyncd
```

---

### Create config file
Sync two folders/files
Edit `/etc/lsyncd.conf`:

```lua
settings {
    logfile = "/var/log/lsyncd.log",
    statusFile = "/var/log/lsyncd.status",
}

sync {
    default.rsync,
    source = "/home/j/houdini20.5/source_xx/",
    target = "/mnt/D/target_dir/",

    rsync = {
      binary = "/usr/bin/rsync",
      archive = "true",
      _extra = {
        "--include=individual_file_1.py",
        "--include=individual_file_2.txt",
        "--exclude=*"
      }
    }
}
```



---

### Start the daemon

```bash
sudo systemctl enable --now lsyncd
```

Restart:
```bash
sudo systemctl restart lsyncd
```


---

#### Check & Debug
**Check if the service is running**
`systemctl status lsyncd`


**Run lsyncd manually to see the real error:** 
`sudo lsyncd -nodaemon /etc/lsyncd.conf`