---
title: Windows Issues
description: record some stupid windows shit
---
Because I encounter many times re-install both windows and Linux, so back up these stupid things since I always meet them.
Stupid and annoying windows ahhh



# Disable auto restart
By default, Windows auto update and auto restart computer in the night, which might lead to Linux system broken (causing from mounting point).
So prevent it auto restart would be a good point.

** Windows + R** : `gpedit.msc` (open the Local Group Policy Editor)

Computer Configuration --> Administrative Templates --> Windows Components --> Windows Update --> Legacy Policies -->  "No auto-restart with logged on users for scheduled automatic updates installations" **make it Enable**

# Disable hibernate

1. cmd + run as Administrator
2.  `powercfg.exe /hibernate off`
	1. if want to turn on -->  `powercfg.exe /hibernate on`