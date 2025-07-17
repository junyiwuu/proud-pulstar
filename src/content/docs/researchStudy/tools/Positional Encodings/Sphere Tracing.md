---
title: Sphere Tracing
---


A specific ray marching strategy. 
Root finding techniques


Sphere tracing 用在基于距离场（如 signed distance fields, SDF）的光线行进（ray marching）算法中。

**Before:**
In traditional ray tracing, you march along a ray in small steps, checking after each step if you've hit the surface. 
- it is slow


**Now:**
At each point along the ray, the SDF tell you the minimum distance to any surface (it is  the property of SDF). Then this distance is the "maximum safe distance", you can safely "jump" forward by that distance without missing the surface


1. Start from the ray origin.
2. At the current point, evaluate the SDF to get the distance dd to the closest surface.
3. Move forward along the ray by dd. (You are guaranteed not to cross any surface because the SDF is the true minimum distance.)
4. Repeat: at each new location, re-evaluate the SDF and jump forward again.
5. Stop if:
    - The distance dd becomes very small (meaning you are close enough to the surface and have found an intersection). 
    - Or, if you move outside the scene bounds without finding a surface (meaning the ray misses everything).