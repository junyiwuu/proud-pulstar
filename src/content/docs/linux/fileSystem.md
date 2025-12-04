---
title: File System
description: Linux file system, what are they, what do they do
---



`/ `: root

`/boot`: store kernel, grub settings (if modify, can causing system launch issue)

`/dev` : The purpose is allow the system and user programs to interact with hardware devices as if they were standard files. This abstraction is core feature of the Unix design philosophy

`/usr`: Unix System Resources. Contains the majority of system utilities and applications. It's the largest part of file system hierarchy and holds non-critical data needed after the system has booted. 
- It is often considered shareable and read-only (except for software installation/update)

(Non essential:)
>`/usr/local/bin`: Locally compiled and installed programs are normally here
> `/usr/bin`: Contain the majority of the system's executable files that are not critical for booting or repairing the system.

`/bin`: (Essential) Contain programs that are absolutely essential for the system to boot, run, and for basic repair/single-user mode operations.  
- Essential user command binaries, include commands like `ls`, `cp`, `mv`, `cat`, and `bash`.

`/sbin`: (Essential) Programs primarily intended for the system administrator for system maintenance, repair and configuration.

`/home`: User's own directory. Each user has different home.

`/lib`: (Libraries) Contains the essential shared libraries needed by the executables in /bin and /sbin 
- Shared libraries are collection of code that multiple programs can use simultaneously.

`/tmp`: Holds temporary files created by applications and the system. 
- Files here are often deleted every time the system reboots, or by system cleanup utilities, so program should not rely on files placed here. Anyone can write into this folder.

`/var`: (Variable data) Contains files whose contents are expected to change frequently while the system is running. Like log (`/var/log`), emails(`/var/mail`), database files, web files(`/var/www`)

`/etc`: (Configuration files), stands for Etcetera. Contains all system-wide configuration files. These are static configuration files used to control how the system and applications behave. They are usually human-readable plain text file.s

`/proc`: (Process Information). It is a virtual filesystem created dynamically by the kernel at boot time.
- Does not contain physical files on a disk. It exposes real-time information about the system, running processes, hardware and kernel parameters. (Like show CPU info in `/proc/cpuinfo`, or memory info in `/proc/meminfo`)