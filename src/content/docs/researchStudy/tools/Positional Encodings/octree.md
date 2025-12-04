---
title: octree
description: what is octree
---
## Octree

**Octree**: A tree structure , where each node represents a cubic region of space --> which can be recursively subdivided into 8 smaller cubes (children nodes).

[PlenOctrees: Real-time Rendering of Neural Radiance Fields](https://arxiv.org/pdf/2103.14024)

Problem: NeRF can synthesize novel views of a scene with high fidelity (including view-dependent effects like specular highlights), but they are slow to render.
- typically requiring many neural network queries per pixel, which makes real-time rendering infeasible

Solution:
PlenOctree: a hybrid representation that precomputes and "bakes" a trained NeRF into a sparse, hierarchical octree structure.
- spherical harmonic factorization of appearance: 
	- before: NeRF take view direction as an explicit input
	- now: train a modified NeRF to output coefficients of spherical harmonic basis functions.
	- During rendering, these basis functions can be evaluated for any view direction to recover the view-dependent color. 
- PlenOctree structure: the scene is stored in an octree
	- each leaf holds density and the spherical harmonic coefficients
	- The octree is sparse, enforce a sparsity prior during training to keep memory reasonable, so only "important" regions are stored.
- They can
	- convert a trained NeRF into a PlenOctree
	- further optimize the PlenOctree itself via differentiable rendering to improve quality, avoiding the need to wait for full NeRF convergence in some cases.
	- 





method to take a trained NeRF which is typically slow to evaluate because it requires an MLP per sample along each ray, and distill it into a sparse, hierarchical data structure (an octree) that can be rendered in real time, while preserving view-dependent appearance.





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