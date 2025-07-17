---
title: octree
description: what is octree
---
## Octree

**Octree**: A tree structure , where each node represents a cubic region of space --> which can be recursively subdivided into 8 smaller cubes (children nodes).


## Sparse Voxel Octree (SVO)
SVO is a hierarchical data structure used to efficiently store and process large, mostly empty (sparse) 3D spaces made of voxel.

**Sparse** mean only region of space that contain meaningful data are store, empty space is not.

SVO is great for accelerating ray tracing in games and graphics. It is a general accelerating method in graphic.

**Octant**: small box



![octree](https://geidav.wordpress.com/wp-content/uploads/2014/07/octree.png?w=820)



![octree subdivision](https://www.wobblyduckstudios.com/Images/Octree/Octree_5.png)

![octree model visualize](https://developer.download.nvidia.com/books/gpugems2/37_octree_03.jpg)

Use case:
**Ray tracing**: when shoot a ray, not check if it against every triangle in the whole model, you first find which octants(boxes) the ray passes through.
And only check triangles in those octants. This can make rendering thousands of times faster, especially in large or sparse scenes.

**Collision detection**: only test collisions between objects in the same or neighboring octants, not all possible pairs


**Spatial queries**: find all points near this location -- by only checking points in relevant octants