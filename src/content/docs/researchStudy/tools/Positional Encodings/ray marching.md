---
title: ray marching
---


Ray marching is a general technique in computer graphics for rendering scenes defined by implicit surfaces, volumetric data ...

"marching" -> "stepping"
Marching along a rat from the camera into the scene, sampling the scene at regular or adaptive intervals, and checing at each step if a condition is met (like hitting a surface or reaching a certain density)

- for volumes: sample density/opacity/color
- for implicit surface: check if the function value crosses a threshold (eg: 0 for SDFs)
- Strop if the ray hit the surface/ meet the threshold, or if you go beyond the scene bounds

Use case:
- volume rendering
- Rendering implicit surfaces
- neural fields