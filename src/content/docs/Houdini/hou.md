---
title: hou API
---
https://www.sidefx.com/docs/houdini/hom/hou/ui.html


**Select nodes**: `hou.selectedNodes()` , the list of nodes, select the first one: `hou.selectedNodes()[0]` 

```
UI = hou.ui.readInput(
	initial_contents=select.name(), 
	buttons=["Save","Cancel"], 
	title="script name", 
	message="set the name")
```


**Open input dialog**: `hou.ui.readInput()`, it returns tuple : (result, text) -> result: an integer indicating which button was pressed, text-> the string the user typed in the input field

**Expands global variables and expressions in a string at the current frame**: `hou.expandString`



### Linux similar operations
`hou.pwd()`
`hou.cd("/obj/")`


### Basics
#### Checking UI
`hou.ui.paneTabs()` : check current pane contexts

ex: 
```
for pane in hou.ui.paneTabs():
    print(pane.name(), pane.type())
    if hasattr(pane, "pwd"):
        print(" Current node: " , pane.pwd())
```

