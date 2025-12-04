---
title: Marching Cubes
---
* [[Marching cubes]]-- [1987](https://dl.acm.org/doi/pdf/10.1145/37402.37422) 
	* [[Adaptive Marching Cubes]] -- [1995](https://www.comp.nus.edu.sg/~mohan/papers/amc.pdf)




## How does it works
Marching cube works by iterating ("marching") over a uniform grid of cubes superimposed over a region of the function.
- If all 8 vertices of the cube are positive, or all 8 vertices are negative, the cube is entirely above or entirely below the surface, and no triangles are emitted.
- Otherwise the cube straddles t he function and some triangles and vertices are generated. 
Since each vertex can either be positive or negative, there are $2^8$ possible configurations, but many of these are equivalent to one another. There are 15 unique cases.
![marching cube lootable](https://graphics.stanford.edu/~mdfisher/Images/MarchingCubesCases.png)


![video](https://www.youtube.com/watch?v=LfttaAepYJ8)
![example](https://catlikecoding.com/unity/tutorials/marching-squares/tutorial-image.jpg)

## Issue:
Ambiguity: 
### Solution:
Marching Tetrahedra: doesn't have ambiguity problem, but generates isosurfaces consiting of more triangles, and the tessellation of a cube with tetrahedra requires making a choice regarding the orientation of the tetrahedra.

leave a hole (what hole? exact image?)

## Different between Marching Tetrahedra
[Stackflow answer](https://stackoverflow.com/questions/11074462/marching-cube-ambiguities-versus-marching-tetrahedron)








Volumetric and implicit shape representation (e.g., SDFs) can be converted to meshes through Marching cubes


cons: impose discretization errors


Good learning source
https://graphics.stanford.edu/~mdfisher/MarchingCubes.html

https://www.cs.carleton.edu/cs_comps/0405/shape/marching_cubes.html


https://www.youtube.com/watch?v=M3iI2l0ltbE

https://book.vtk.org/en/latest/VTKBook/06Chapter6.html


Marching tetrahedra



DMTet: differentiable marching tetrahedra




FlexiCubes


## Next:
asymptotic decider