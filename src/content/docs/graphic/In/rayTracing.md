---
title: Ray Tracing
---


![pic](https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/ray.png)
`P(t) = O + D * t`

```
vec3 curPos = vec3(uv, 0.0);
vec3 rayDir = normalize(curPos - rayOrigin);
float t = -rayOrigin.z / rayDir.z;
float d = length(rayDir.xyz * t);
```

keep the aspect ratio:
```
vec2 uv = gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0;
uv.x *= iResolution.x / iResolution.y;
```



## Intersection

**Sphere intersection**
How to know if two sphere intersect:
$$||x - c_1|| ^2 = r_1^2 ,    ||x - c_2|| ^2 = r_2^2$$
$c_1, c_2$: two spheres' centers
$r_1, r_2$: two spheres' radius
$d = ||c_2 - c_1||$ 

- $d > r_1 + r_2$ too far apart, no intersection
- $d = r_1 + r_2$ touching externally
- $d = 0$ two sphere identical
- $d < r_1 + r_2$ intersection


**Plane intersection**
$Ray(t) = O + t \cdot D$ 
$N \cdot (X - P) = 0$
- $P$ : any point on the plane (known)
- $N$: plane unit normal 
- $X$: any point on the plane (unknown) (what we need to solve)


So put the first equation to the second one:
$N \cdot (O + tD - P) = 0$
$$t = \frac{N \cdot (P - O)}{N \cdot D}$$


