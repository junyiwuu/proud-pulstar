---
title: Kernel
---







## Remove kernel
**List all kernel:**
`rpm -q kernel`

**Check the current kernel:**
`uname -r`

**Remove the specific old kernel:**
`sudo dnf remove kernel-<version>`


## Remove kernel on boot (if not removed)

```bash
rpm -qa | grep kernel
```

After find the version, replace the `<version>` to the version you want to delete
```bash
sudo dnf remove kernel-<version> kernel-core-<version> kernel-modules-<version>
```

Rebuild the GRUB configuration
1. Check if yo are on UEFI or BIOS: 
```bash
[ -d /sys/firmware/efi ] && echo "UEFI" || echo "BIOS"
```
or
```bash
efibootmgr -v
```


2. 
**check GRUB** so the deleted kernel not display on the GRUB boot menu
3. check`ls /boot/vmlinuz-* /boot/initramfs-*` then you  might see:
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




```bash
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```






