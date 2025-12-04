---
title: Marching Tetrahedra
---

In marching tetrahedra, each cube is split into six irregular tetrahedra by cutting the cube in half three times.  




![tetrahedra](https://github.com/andresbejarano/MarchingTetrahedra/blob/master/images/cubesubdivisions.jpg?raw=true)








![marching tetra](https://www.researchgate.net/publication/384087800/figure/fig5/AS:11431281278457001@1726639787529/Five-unique-marching-tetrahedra-cases-based-on-30-The-resulting-discretized-interface.ppm)




## Key points: 
Adjacent cubes share all edges in the connecting face, including the same diagonal. This is an important property to prevent cracks in the rendered surface.
- Because interpolation of the two distinct diagonals of a face usually give slightly different intersection points.
- And up to five computed intersection points can be reused when handling the neighbor cube.
- This includes the computed surface normals and other graphics attributes at the intersection point.

Each tetrahedron has $2^4 = 16$ possible configurations.






Reference:
[^1]: https://en.wikipedia.org/wiki/Marching_tetrahedra
[^2] https://book.vtk.org/en/latest/VTKBook/06Chapter6.html