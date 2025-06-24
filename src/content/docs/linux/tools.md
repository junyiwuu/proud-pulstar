---
title: Tools
description: some tools that I used
---
## Sync two folders (bidirectional synchronization)
---
### Install
```sh
sudo dnf install unison
```
---
### Initial sync
```sh
unison /path/to/folderA /path/to/folderB -auto -batch
```
* if folderA has context, folderB is empty --> folderB will be filled in folderA stuff
* if both folders have different files already,  unison will merge them

`-auto` :  Automatic Mode. Unison automatically resolve non-conflicting changes. If a file is new or unchanged in both locations, Unison will sync it without asking.

`-batch` : Fully Automatic Mode. this makes Unison completely non-interactive. It assumes the latest modified version wins and resolves all conflicts automatically.


**If meeting permission issue**: Then don't sync permission
```sh
unison /path/to/folderA /path/to/folderB -auto -batch -perms 0
```

---
### Build connection
#### Sync every xx seconds
`while true; do unison /path/to/folderA /path/to/folderB -auto -batch; sleep 5; done`
This is a Bash infinite loop that repeatedly runs Unison every 5 seconds
* `do`: marks the beginning of the loop body
* `done`: marks the end of the loop body
>everything between `do` and `done` runs once per loop iteration

* `sleep 5`: pauses execution for 5 seconds before restarting the loop
**this is only good for syncing across network drives (NFS, SSH etc)**

<hr style="border-top: 2px dashed rgb(218,201,166, 0.5);">

#### Watch mode
(terminal open, stop when terminal window close)
Monitor file changes in real-time and sync only when necessary
```sh
unison /path/to/folderA /path/to/folderB -auto -batch -repeat watch
```

`-repeat watch`: enables watch mode , detecting changes in real-time


<hr style="border-top: 2px dashed rgb(218,201,166, 0.5);">


### Run as a Background Service

Instead of keeping a terminal open, create a systemd service:
```sh
sudo nano /etc/systemd/system/unison-sync.service
```

Paste:

```ini
[Unit]
Description=Unison Sync Service
After=network.target

[Service]
ExecStart=/usr/bin/unison /home/j/projects/digital-debris/src /mnt/D/blog/digital-debris/src -auto -batch -repeat watch -silent -prefer newer -perms 0
Restart=always
User=j
Group=j
WorkingDirectory=/home/j

[Install]
WantedBy=multi-user.target

```

Then enable it:

`sudo systemctl daemon-reload 
`sudo systemctl restart unison-sync`
`sudo systemctl enable --now unison-sync`

This makes Unison **run in the background** automatically.

**check Unison status:**
```sh
systemctl status unison-sync
```
**Stop Unison if needed**
```sh
sudo systemctl stop unison-sync
```
**Disable it permanently**
```sh
sudo systemctl disable unison-sync
```


---
### Break connection

**If Unison is running in a loop, kill it**:
For example : in `while true` --> execute `pkill unison`


**Remove Synchronization Metadata**:
`rm -rf ~/.unison`



---

## Change background color (solid color) on Gnome

[reference link](https://askubuntu.com/questions/943245/change-desktop-background-to-a-solid-color-e-g-pitch-black-in-gnome-3)

* launch dconf Editor -- `dconf-editor`
* Go to `/org/gnome/desktop/background/`
* if you have a picture: go to `picture-url`, change Custom value to `none`
* if not, just change the color:  go to `primary-color`, change `Custom value` to desired one






<!-- Solid line -->
<hr style="border-top: 2px solid #000;">

<!-- Dashed line -->
<hr style="border-top: 2px dashed #000;">

<!-- Dotted line -->
<hr style="border-top: 2px dotted #000;">

<!-- Double line -->
<hr style="border-top: 4px double #000;">

<!-- Groove line -->
<hr style="border-top: 4px groove #000;">

<!-- Ridge line -->
<hr style="border-top: 4px ridge #000;">



<hr style="border-top: 2px dashed red;">


<hr style="border-top: 2px solid blue;">


<hr style="border-top: 2px dotted green;">



<hr style="border-top: 2px dashed #FF0000;">  <!-- Red -->

<hr style="border-top: 2px solid #0000FF;">   <!-- Blue -->
<hr style="border-top: 2px dotted #00FF00;">  <!-- Green -->


<hr style="border-top: 2px dashed rgb(255,0,0);">      <!-- Red -->
<hr style="border-top: 2px solid rgba(0,0,255,0.5);">  <!-- Semi-transparent blue -->

<hr style="border: none; height: 2px; background: linear-gradient(to right, red, blue);">