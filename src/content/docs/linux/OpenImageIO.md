---
title: OpenImageIO
---



- `iinfo -v`（check metadata）
- `idiff`（difference between versions）
- `iconvert`（格式转换、resize、色深）
- `maketx`（纹理转换）
- `oiiotool`（自动化/批处理神工具）
    


OIIO 自带的命令主要有：

- `iinfo` — 查看图像信息
- `idiff` — 比较图像
- `iconvert` — 图像转换
- `igrep` — 搜索元数据
- `ipaste` — 粘贴 / overlay
- `icrop` — 裁切
- `iwarp` — 变形
- `maketx` — 生成纹理（最常用在渲染 pipeline）
- `iv` — 图像查看（某些版本）
    

**`iinfo`**

```
iinfo foo.exr
```

Check exr header info
```
iinfo -v foo.exr
```

Check all channels
```
iinfo -a shot_beauty_v001.exr
```

Batch show files' info
```
iinfo /path/to/renders/*.exr
```

    

---

 **`idiff`**

Basic comparison
```
idiff A.exr B.exr
```

### 设置容忍度（浮点误差）

```
idiff -fail 0.001 A.exr B.exr
```

用途：

- check-in 前比较版本差异
    
- 渲染农场回归检测
    
- 合成脚本更新 QA
    

---

**`iconvert`**

### EXR → JPG

```
iconvert input.exr output.jpg
```

### 只转换通道

```
iconvert -ch R,G,B AOV.exr rgb.exr
```

### EXR → PNG（合成输出预览很常用）

```
iconvert frame.%04d.exr frame.%04d.png
```

### 改 bit depth（float→half）

```
iconvert --datatype half in.exr out.exr
```

---

**`icrop` / `iconvert --resize`**


```
icrop 0 0 1920 1080 in.exr out.exr
```

```
iconvert --resize 50% in.exr out.exr
```

---

# 📌 **5. 打入 / 修改 metadata** — `iconvert --attrib`

### 写 metadata（很常用）

```
iconvert --attrib shot_name "FOO_010" in.exr out.exr
```

修改 color space tag：

```
iconvert --attrib "oiio:ColorSpace" "linear" in.exr out.exr
```

---

# 📌 **6. 图像拼接（tile / paste）** — `ipaste`

```
ipaste base.exr overlay.exr 100 200 out.exr
```

用途：

- 把 thumbnail 或 slate 合成到预览上
    
- 工具自动生成 contact sheet
    

---

# 📌 **7. 搜索 metadata** — `igrep`

搜索包含某个 tag 的图像：

```
igrep resolution *.exr
```

搜索特定值：

```
igrep "shot=100" /show/renders/*
```

---

# 📌 **8. 图像变换（warp）** — `iwarp`

（使用频率较低）

```
iwarp in.exr coords.tif out.exr
```

---

# 📌 **9. 最重要之一：纹理生成** — `maketx`

渲染部门（RenderMan, Arnold, Redshift, Karma, V-Ray）中非常常用。

### 生成 MIPMAP / tiled EXR TX 文件

```
maketx input.exr
```

### 指定输出

```
maketx input.exr -o input.tx
```

### 利用多线程

```
maketx -u --threads 16 input.exr
```

### 对大量纹理生成 TX

```
maketx -u /assets/textures/*.exr
```

用途：

- 自动生成 `.tx` 做渲染优化
    
- 资产发布 / lookdev pipeline 必备
    

---

# 📌 **10. Contact Sheet（序列预览）** — `oiiotool --contactsheet`

`oiiotool` 比上面简单工具更强大。

示例：

```
oiiotool *.jpg --contactsheet:cols=6 -o sheet.jpg
```

---



---

如果你愿意，我可以给你做一份：

- **VFX 专用 OIIO 命令行速查表（PDF）**
    
- **Pipeline 自动化示例（Python + OIIO）**
    
- **针对你工作流程的定制命令模板**
    

你想要哪一种？