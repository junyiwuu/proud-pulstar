---
title: issue-collections
---



## Network service crash
Same issue message as shown [here](https://www.sidefx.com/forum/topic/82596/?page=1#post-371491). The reason from the post is because of Vray, or Houdini environment issue. Not my current case.
*Core reason*:
- Most cases, Chromium sandbox permissions issue, not about firewall, nor internet, nor houdini broken
- Python panel use the embedded Chromium tries to spawn a network_service child process, but Windows blocks part of it due to sandbox restrictions or GPU process isolation
*Debug process*:
- modify `houdini.env` file
	- `QTWEBENGINE_CHROMIUM_FLAGS = --disable-gpu-sandbox`
	- or `HOUDINI_USE_NATIVE_WEB_BROWSER = 1`, `HOUDINI_EXTERNAL_HELP_BROWSER = 1`, `HOUDINI_USE_HFS_PYTHON = 1` force to use the legacy QtWebKit
	- Run Houdini as administrator,  if it works under administrator, then we can confirm it is embedded Chromium permission issue
*Solution*:
1. Go to Nvidia control panel
2. Manage 3D settings
3. Select a program to customize -> if no Houdini, use "Add" button, don't choose, browse to `houdini.exe` file -> open
4. Change `OpenGL rendering GPU` from `auto` to `NVIDIA GeForce RTX 5090` (or your current GPU) -> Because Qt are using openGL
5. restart the computer, then Houdini should work normal without any issue without running as administrator