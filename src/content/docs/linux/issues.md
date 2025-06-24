---
title: Issues
description: record the issues that I met
---
##  Recursively changed the permission of /usr

**result:** not successfully restore the system, re-install Rocky Linux in the end
### Restoring RPM package permissions and ownership
`sudo rpm --setperms -a` : restoring the permissions
`sudo rpm --setugids -a`: restoring the ownership



---
## After Linux Updating, nothing can be launched

*fuck wayland*
* GNOME: Display Manager
* wayland: is the new Window Manager
* X11: the old stable window manager

How to check which one is using:  
```
echo $XDG_SESSION_TYPE
```

How to switch:
log out --> on the log in page, right bottom corner --> switch to X11


---


