---
title: Qt
---


## Qt
### QtObject
Roughly every non-visual Qt thing ultimately inherits from this
- signal & slot
- Event filtering (`eventFilter`)
- timers
- thread affinity
- parent-child lifetime management
(emit signals, use eventFilter etc)

> [!example]

**A signal:**
```python
class ThumbDispatcher(QtCore.QObject):
    # the purpose is change the ui immediately
    thumbReady = QtCore.Signal(str, int, int)
    
def onThumbReady(jpg_path: str, row, col):
    try:
        cell = table.cellWidget(row, col)
        if isinstance(cell, QtWidgets.QWidget) and os.path.exists(jpg_path):
            cell.thumb.setPixmap(QtGui.QPixmap(jpg_path).scaled(
                cell_w-padding, cell_h-padding*2,
                QtCore.Qt.IgnoreAspectRatio, QtCore.Qt.SmoothTransformation
            ))
    except Exception:
        traceback.print_exc()
```
*How to use*
- whenever the work is done (or can call after find out the work has already done): `dispatcher.thumbReady.emit(jpg_path, row, col)` , like ring a bell
- After ring the bell (to the dispatcher object), it will execute `onThumbReady` function. And this function works on the main thread to update UI.
*Use*:
```python
dispatcher = ThumbDispatcher()
dispatcher.thumbReady.connect(onThumbReady)
```


**Resize Watcher:** / **Event Filter:**
```python
resize_watcher = PanelResizeWatcher()
resize_timer = QtCore.QTimer()
resize_timer.setSingleShot(True)
resize_timer.timeout.connect(onViewportResized)
table.viewport().installEventFilter(resize_watcher)

class PanelResizeWatcher(QtCore.QObject):
    def eventFilter(self, obj, event):
        if event.type() == QtCore.QEvent.Resize:
            if resize_timer is None:
                return False
            resize_timer.start(100)  # 100ms
        return False
        
# ...
table.viewport().installEventFilter(resize_watcher)
# Qt, send viewport UI events to my resize_watcher object first, before process them yourself
# ...
```
- Only QtObject based calls can do `installEventFilter()`
- in eventFilter function, if the event should be filtered(i.e. stopped), return true, otherwise must return false
*Event Filter*:
Many event filter type can be used, check [QtEvent](https://doc.qt.io/qtforpython-6.5/PySide6/QtCore/QEvent.html) , other things like: `QEvent.MouseButtonPress`, `QEvent.MouseMove`, `QEvent.KeyPress`
- When the timer finishes counting down, call onViewportResized


**Timer:**
```python
resize_timer = QtCore.QTimer()
resize_timer.setSingleShot(True)
resize_timer.timeout.connect(onViewportResized)
```
One time timer setup, and then run anytime you want the delayed callback: `resize_timer.start(100)`





### QtWidget
Visual elements, but still a QtObject in the end
Including: `QPushButton`, `QLabel`, `QMainWindow`, `QTableWidget`, etc.
So it majorly for visual, but also event-capable(because of QtObject)







GIL: Global Interpreter Lock
Only one thread to execute python bytecode at a time -> It is a mechanism/lock/situation




