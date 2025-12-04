---
title: HDRI Browser Dev
---



`onCreateInterface()`: main entry point
`onCloseInterface()`: cleanup on close


`fillInTable()` :  populates table cells
`createTableCell() / tableCell()`: individual table cell creation

`scheduler()`: 
- create `concurrent.futures.ThreadPoolExecutor`
- if thumbnail already exist, dispatcher emit thumb ready (so set the image)
- if not, check if in the processing set 
	- if not in processing set
> Must check if in the processing set, because when resizing the panel or anything, the system will re-calculate the thumbnail size. If it is in the set, so not duplicate the calculating
> If not checking processing set, if resize the panel, it will emit a lot of task, therefore a lot of duplicate calculating.



Several connections link to the Qt button:
`btnRefresh`: refresh button
`sliderThumbSize`: thumbnail size slider
`btnSelectPath`:  Select the path
`btnImport`: import node to the network


**Watcher:**
`dropWatcher`:
`PanelResizeWatcher`:

Register watcher is by event filter



**Convert and generate thumbnail (OpenImageIO)**:
1. first read by using image buffer: `buf = oiio.ImageBuf(src_path)`
2. Get how many channels of the image: `img_channels = buf.nchannels`
3. Tone mapping: 
	1. multiply exposure `imgBuf = oiio.ImageBufAlgo.mul(imgBuf, 2**exposure)`
	2.    **Reinhard global tone-mapping operator**.$$I_{\text{tm}} = \frac{I_{\text{exp}}}{I_{\text{exp}} + 1}  $$
```python
one = oiio.imageBufAlgo.fill((1.0,) * imgBuf.nchannels, roi=imgBuf.roi)
denom = oiio.imageBufAlgo.add(imgBuf, one)
out = oiio.imageBufAlgo.div(imgBuf, denom)
# roi: region of interest, tells the size of the image
```

4. Get aspect ratio
5. Define the thumbnail's size, and resize the original image to this size
6. clamp and write out

	
   


how to scan loop the whole folder
```python
if os.path.isdir(dir_path):
	for file in os.listdir(dir_path):
		ext = file.split('.')[-1].lower()
		if ext == 'hdr' or ext =='exr':
			fullpath = dir_path + '/' + file
			cache[cache_key(fullpath)] = fullpath
```

Get metadata:
```python
metadata = os.stat(src_path)
```



----
## Update to menu / single pop up

Done :
import
thumbDispatcher

- [x] Connect all buttons
- [ ] All button logics
	- [ ] import logic
	- [ ] refresh
	- [ ] thumbsize resize
	- [ ] import
- [ ] panel size (resize adjust)
- [ ] thumb dispacter
- [ ] drag and drop listener
- [ ] table cell class
- [ ] utils:
	- [ ] get jpg path
	- [ ] update table size
	- [ ] fill in table




1. load ui file