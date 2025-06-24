---
title: Houdini notes
---

**sudo launchctl start com.sidefx.sesinetd**

## Launch the server
issue: 
`http://localhost:1715: No server found running, please start the server before retrying`
Solve: `cd /usr/lib/sesi` --> `sudo ./sesinetd`

`sudo /usr/lib/sesi/sesinetd`

---
**create a service make it always running** (not working for now, 懒得折腾...)
```bash
sudo nano /etc/systemd/system/sesinetd.service
```


```ini
[Unit]
Description=SideFX License Server (sesinetd)
After=network.target

[Service]
ExecStart=/usr/lib/sesi/sesinetd
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable sesinetd.service
```

---


after install houdini and make it work: 
1. `cd /opt/hfs20.5`  
2. `source houdini_setup`
3.  if no libXss: `sudo dnf search libXss`  --> `sudo dnf install libXScrnSaver`
4. `houdini` then can start


