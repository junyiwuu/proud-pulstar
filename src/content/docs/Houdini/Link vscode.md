---
title: Link vscode
---

## Linking:
- Edit - preferences - Set External Text Editor
- Edit` houdini.env `-- add `VISUAL = "/usr/bin/code"`


## Stubs
Find the python for this Houdini:
```python
import sys
print(sys.version)     # the python version
print(sys.executable)  # find where is the python
```

Then go to that folder, using pip to download `PySide6` (but pip here cannot be used directly), so we are doing differently:
1. go to that folder
2. `./pythonxxx -m pip install PySide6`

Follow [tutorial](https://pakreht.com/houdini/configure-vscode-for-python/)
(Need to generate stubs, works on Rocky Linux 30/11/202)5
[Internet archive](https://web.archive.org/web/20241014071425/https://pakreht.com/houdini/configure-vscode-for-python/)

Summary: 
1. Find all necessary path info from Houdini
2. Create a profile in vscode and edit `settings.json` file
3. Generate stubs manually
4. Link them
5. 







