---
title: knowledge
---


## Deferred Shading
Deferred shading is a rendering technique. 
* 先把所有几何信息都渲染下来，等到最后统一做光照计算
*对比传统的forward shading是逐像素每个光源计算*
**Process**：
1. Geometry Pass
	* put all geometry information (like world position, normal, diffuse color etc) into G-buffers
2. Lighting Pass
	* calculate lighting based on these G-buffers (in screen space). 
	* only calculate visible pixels

好处： 效率高，适合多光源（forward渲染每个光都要重新算，但是deferred只需要一次pass），更容易做后处理效果

缺点：不能很好支持透明物体，不适合每像素材质都很复杂的场景（G-buffer会很大），在MSAA（多重采样抗锯齿）处理上复杂一些



## Vertex buffer

vertices are stored on graphics hardware using buffers -> vertex buffer
Other additional vertex attribute such as colors, normal vectors or texture coordinates, also using vertex buffer objects.

VBO: Vertex Buffer Object





## Spatial Data Structures
The ability to quickly locate geometric objects in particular regions of space is important.
* Ray tracers need to find objects that intersect rays
* interactive applications find the objects visible from any given viewpoint
* Game and physical simulations require detecting when and where objects collide

**Three general classes of spatial data structures**:
1. Bounding volume hierarchies
2. uniform spatial subdivision
3. binary space partitioning                              





* Object partitioning schemes
	* Structures that group objects together into a hierarchy
	* objects are divided into disjoint groups, but the groups may end up overlapping in space
* Space partitioning schemes:
	* Divide space into disjoint regions
	* Space is divided into separate partitions, but one object may have to intersect more than one partition

### Bounding Box
2D bounding box is defined by two horizontal and two vertical lines:
* $x = x_{\min}$
* $x = x_{\max}$
* $y = y_{\min}$
* $y = y_{\max}$
Points bounded by these lines can be described in interval notation:
$(x, y) \in [x_{\min}, x_{\max}] \times [y_{\min}, y_{\max}]$

在ray 和bounding lines的intersection测试中，首先计算ray 与垂直线$x = x_{\min}$ 相交时的参数 $t$ :
* $t_{x\min} = \frac{x_{\min} - x_e}{x_d}$
同理，还要计算：
* $t_{x\max} = \frac{x_{\max} - x_e}{x_d}$
* $t_{y\min} = \frac{y_{\min} - y_e}{y_d}$
* $t_{y\max} = \frac{y_{\max} - y_e}{y_d}$

其中
* $x_e$：射线的起点在 x 方向上的坐标
* $x_d$：射线方向向量在 x 方向上的分量（direction）


