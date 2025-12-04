---
title: Camera and Matrix
---



## Basic calculation
### Dot product
Result is scalar

对于两个 n 维向量：

$$\vec{a} = (a_1, a_2, ..., a_n), \quad \vec{b} = (b_1, b_2, ..., b_n)  
$$
点积就是：
$$
[  
\vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2 + \cdots + a_n b_n  
]$$

$\vec{a} = (3, 4), \quad \vec{b} = (1, 2)$

$\vec{a} \cdot \vec{b} = 3 \cdot 1 + 4 \cdot 2 = 3 + 8 = 11$

Geometry:$\vec{a} \cdot \vec{b} = |\vec{a}| \cdot |\vec{b}| \cdot \cos\theta$
-  $||\vec{a}||$：a 的长度
- $||\vec{b}||$：b 的长度
-  $\theta$：a 和 b 之间的夹角

**Usage**
- **判断夹角方向：**
    - dot > 0 ⇒ 小于 90°（方向接近）
    - dot < 0 ⇒ 大于 90°（方向相反）
    - dot = 0 ⇒ 正交（垂直）
> For remember: 
> cos(0) = 1, 0 degree means direction same, then dot product is 1
> cos(90) = 0, so when dot product is 0, two vector is perpendicular

- **投影（projection）**
- **Phong lighting** 的 diffuse 计算就是：  $\text{diffuse} = \max(0, \vec{N} \cdot \vec{L})$


---

## Matrix

### Homogeneous Coordinate
Add a fourth coordinate
- 0 ->vector
- 1->point
**Explain**:
in the normal Euclidean coordinates, rotation and scaling can do matrix multiplication, but translation cannot do the multiplication. 
So we also convert translation into matrix: 
$$\begin{bmatrix}  
1 & 0 & t_x \\  
0 & 1 & t_y \\  
0 & 0 & 1  \end{bmatrix}  
\begin{bmatrix}  
x \\ y \\ 1  
\end{bmatrix} = 
\begin{bmatrix}  
x + t_x \\ y + t_y \\ 1 \end{bmatrix}  $$



### 2D / 3D transformation
Scale: 
$$
\begin{bmatrix}
s_x & 0 & 0 
\\0 & s_y & 0
\\ 0 & 0 & 1
\end{bmatrix}
$$
Rotation:
$$\begin{bmatrix}
\cos\theta & -\sin\theta & 0 \\ 
\sin\theta & \cos\theta & 0 \\
0 & 0 & 1
\end{bmatrix}
$$
Translation:
$$
\begin{bmatrix}
1 & 0 & t_x \\
0 & 1 & t_y \\
0 & 0 & 1
\end{bmatrix}
$$
#### Rotate 90 degree
`vec2(pos.x, pos.y)` -> `vec2(-pos.y, pos.x)`

#### 2D rotation
![coordinate](https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/rotation-radial-coordinates.png)

![rotation coord](https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/rotation-offset-angle.png)


$P_x = r \cdot \cos \varphi$
$P_y = r \cdot \sin \varphi$

$P'_x = r \cdot \cos(\varphi + \Delta)$
$P'_y = r \cdot \sin(\varphi + \Delta)$

let's recall the following trigonometric angle addition formulas:

$\cos(\varphi + \Delta) = \cos \varphi \cdot \cos \Delta - \sin \varphi \cdot \sin \Delta$
$\sin(\varphi + \Delta) = \sin \varphi \cdot \cos \Delta + \cos \varphi \cdot \sin \Delta$

substituting these into the equations 3 and 4:

$P'_x = [r \cdot \cos \varphi] \cdot \cos \Delta - [r \cdot \sin \varphi] \cdot \sin \Delta$
$P'_y = [r \cdot \sin \varphi] \cdot \cos \Delta + [r \cdot \cos \varphi] \cdot \sin \Delta$

$P'_x = P_x \cdot \cos \Delta - P_y \cdot \sin \Delta$
$P'_y = P_y \cdot \cos \Delta + P_x \cdot \sin \Delta$

(always input radians)
```
  float angle = sin(iTime)*3.1415;
  // to make it from -1 to 1 -> -pi to pi
  float c = cos(angle);
  float s = sin(angle);
  float posx = position.x * c - position.y * s;
  float posy = position.y * c + position.x * s;
  
  vec2 newPos = vec2(posx, posy);
  gl_Position = projectionMatrix * viewMatrix * vec4(newPos, 0.0, 1.0);
```


**2D rotation around a point**:

1. First displace the P away from the original point (starting point)
2. rotate equation

```
vec2 newPos = position.xy + vec2(0.0, 2.0) ;
float rot_dispx = newPos.x * cos(iTime) - newPos.y * sin(iTime);
float rot_dispy = newPos.y * cos(iTime) + newPos.x * sin(iTime);

vec2 rotate_pos = vec2(rot_dispx, rot_dispy);
gl_Position = projectionMatrix * viewMatrix * vec4(rotate_pos, 0.0, 1.0);
```


### 3D rotation
Around arbitrary vector -> **Rodrigue's rotation**

What we have: 
- original position: $\vec v$
- axis: $\vec n$
- angle

![pic1](https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/rotation-about-axis-decompose.png)

$v_{\parallel} = ( \mathbf{n} \cdot \mathbf{v} ) \cdot \mathbf{n}$
$v_{\perp} = \mathbf{v} - v_{\parallel}$

![pic2](https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/rotation-about-axis-perp-rotate.png)

We want to know prime v per , how?
First cross product $v_{\perp}$ and $\mathbf{n}$:
![pic3](https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/rotation-about-axis-perp-cross.png)

![pic4](https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/rotation-about-axis-perp-system.png)
$$
\mathbf{v}'_{\perp}
= \mathbf{v}_{\perp} * \cos\theta
+ (\mathbf{n} \times \mathbf{v}_{\perp}) * \sin\theta
$$

Then we can simply calculate v after the rotation
![pic5](https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/rotation-about-axis-final.png)
$$\mathbf{v}'
= \mathbf{v}_{\parallel}
+ \mathbf{v}'_{\perp}$$






```
vec3 rotation(vec3 pos, vec3 axis, float angle){
  axis = normalize(axis);
  vec3 p_par = dot(pos, axis) * axis;
  vec3 p_per = pos - p_par;
  vec3 prime_p_per = p_per * cos(angle) + cross(axis, p_per) * sin(angle);
  vec3 newPos = p_par + prime_p_per;
  
  return newPos;
}


void main() {
  float angle = iTime;
  vec3 axis = normalize(vec3(1.0, 1.0, 0.0));
  vec3 p0 = position.xyz + vec3(1.0, -1.0, 0.0);
  vec3 newPos = rotation(p0, axis, iTime);
  
  gl_Position = projectionMatrix * viewMatrix * vec4(newPos, 1.0);
}
```






---
### Affine transformation
Affine map = linear map +  translation


**Why 4x4?**


### Left hand Right hand
#### Right hand (Popular one)
Middle finger: +x
Index: +y
Thumb: to +z axis (point to face), so eye looking at -z

$\vec{X} \times \vec{Y} = \vec{Z}$
(the order is important)

#### Left hand
Thumb: to +z axis, so eye looking at -z
Index: +y
Middle finger: +x

$\vec{X} \times \vec{Y} = -\vec{Z}$  (here is different)
> Mathematically, cross product is based on right hand coordinate, so here is negative Z. Z point to forward
---


### Barycentric

Barycentric coordinates are fundamental in rasterization because they allow efficient interpolation of attributes such as colors, depth value and texture coordinates across triangles in 3D rendering.

![bary centric from tinyrenderer](https://haqr.eu/tinyrenderer/barycentric/2d_b.png)

$P = \alpha A + \beta B + \gamma C,$
$\alpha + \beta + \gamma = 1$

```
v0 = B - A   （从 A 指向 B）
v1 = C - A   （从 A 指向 C）
v2 = P - A   （从 A 指向 P）
```

$$ P = A + \beta(B-A) + \gamma(C-A)$$
-->  $= A + \beta v_0 + \gamma v_1$
--> $v_2 = \beta v_0 + \gamma v_1$



Then the coordinate $\alpha$ is given by the ratio of the sub-triangle $PBC$ to the total triangle $ABC$:

$$\alpha = \frac{\text{Area}(PBC)}{\text{Area}(ABC)}.$$



$$\beta = \frac{\text{Area}(PCA)}{\text{Area}(ABC)}, \quad 
\gamma = \frac{\text{Area}(PAB)}{\text{Area}(ABC)}.$$

The \href{https://en.wikipedia.org/wiki/Shoelace_formula}{shoelace formula} allows to efficiently compute these areas:

$$\text{Area}(ABC) = \frac{1}{2} \left( (B_y - A_y)(C_x + A_x) + (C_y - B_y)(A_x + B_x) + (A_y - C_y)(B_x + C_x) \right).$$


$$d00 = v_0 \cdot v_0, \quad
d01 = v_0 \cdot v_1, \quad
d11 = v_1 \cdot v_1, \quad
d20 = v_2 \cdot v_0, \quad
d21 = v_2 \cdot v_1
$$



---


## Camera


### Pinhole camera model
Pinhole camera model is the simplest possible imaging model.
- no lens distortion
- no depth of field blur, everything perfectly sharp
- perfect perspective projection (straight line stay straight)

$$(x, y, z) \quad \Rightarrow \quad \left( \frac{f x}{z}, \frac{f y}{z} \right)$$
- $f$ is the focal length (distance from pinhole to image plane)
- depth $z$ causes perspective scaling
Matrix:
$$\begin{bmatrix}  
u \\ v \\ 1  
\end{bmatrix} =
K \cdot [R \mid t] \cdot  
\begin{bmatrix}  
X \\ Y \\ Z \\ 1  
\end{bmatrix}  $$

- $K$ : intrinsic matrix, including focal length, sensor size, focal point    
- $R, t$ : camera extrinsics  (camera pose — rotation + translation)
- $X,Y,Z$ : 3D world point
- $u,v$  :2D pixel position


$$K =  
\begin{bmatrix}  
f_x & s & c_x \\  
0 & f_y & c_y \\  
0 & 0 & 1  
\end{bmatrix}  $$
- $f_x, f_y$: effective focal length in  pixel units (focal length * sensor dpi)
- $c_x, c_y$: principal point, the optical center of the sensor (near the image center)
$K$ scales and shifts points from normalized camera coordinates to actual coordinates


---


### Perspective division
![s](https://whale-app-toyuq.ondigitalocean.app/shader-learning-api/files/image/perspective-division-distance.png)


$$OUT = \begin{bmatrix}
x \\ y \\ z \\ w
\end{bmatrix} \longrightarrow
\begin{bmatrix}
x/w \\ y/w \\ z/w \\ 1
\end{bmatrix} $$
Smaller w, closer to the camera. Bigger w, far away from the camera

> Before perspective division, vertex positions exist in clip space (4D coordinate system resulting from transformations applied in the vertex shader). In the clip space, coordinates are not yet normalized and may lie outside the visible volume

> Perspective division is the fixed-function stage in the graphic pipeline


### Intrinsic / Extrinsic
**Extrinsic**: extrinsic parameters of a camera depend on its location and orientation.
- Extrinsic matrix is a transformation matrix from the world coordinate system to the camera coordinate system. (rotation matrix and translation matrix)

**Intrinsic:** intrinsic parameters of a camera depend on how it captures the images. Such as focal length, aperture, field-of-view, resolution (pixel scaling), intrinsic matrix of a camera model.
- Intrinsic matrix is a transformation matrix that converts points from the camera coordinate system to the pixel coordinate system.

![pic](https://contributor.insightmediagroup.io/wp-content/uploads/2025/03/image-123-1024x258.png)

**What is pinhole camera model? :** 
A mathematical relationship between the coordinates of a point in 3D space, and its projection onto the image plane of an ideal pinhole camera( which is camera aperture is described as a point and no lenses are used to focus light)


#### Focal length
#### Aperture
Aperture is the adjustable opening inside the lens that controls how much light enters the camera. Wider means more light, narrow means less light.
> wide: e.g. f/1.8
> narrow:  e.g. f/16

#### Field of view (FOV)
FOV is how much of the scene your camera can see. Shot focal length (e.g. 16 mm ) wide FOV. Long focal length (e.g. 200 mm), narrow FOV.

> wide aperture, blurry background
> narrow aperture, everything in focus



---



### View matrix
get the  camera transformation matrix, and inverse it 
1. Camera position and rotation vector (vec3)
2. Use them to build camera transformation matrix 
	1. Notes: GLSL is column major, while mathematically everything are row major.
3. Inverse it 

```cpp
mat4 rotateX(float a) {
  float c = cos(a);
  float s = sin(a);
  return transpose(mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0,   c,   -s, 0.0,
    0.0,  s,   c, 0.0,
    0.0, 0.0, 0.0, 1.0
  ));}

mat4 rotateY(float a){
  float c = cos(a);
  float s = sin(a);
  return transpose(mat4(
      c, 0.0,  s, 0.0,  
    0.0, 1.0, 0.0, 0.0,
      -s, 0.0,   c, 0.0,
    0.0, 0.0, 0.0, 1.0
  ));}

mat4 rotateZ(float a){
  float c = cos(a);
  float s = sin(a);
  return transpose(mat4(
      c,   -s, 0.0, 0.0, 
     s,   c, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0, 
    0.0, 0.0, 0.0, 1.0
  ));}

mat4 translate(vec3 pos){
  return transpose(mat4(
    1.0, 0.0, 0.0, pos.x,
    0.0, 1.0, 0.0, pos.y,
    0.0, 0.0, 1.0, pos.z,
    0.0, 0.0, 0.0, 1.0
  ));}
```


```
mat4 camMatrix = translate(CAMERA_POS) * rotateX(CAMERA_ROTATE.x) * rotateY(CAMERA_ROTATE.y) * rotateZ(CAMERA_ROTATE.z);

mat4 viewMatrix = inverse(camMatrix);
vec4 worldPos = modelMatrix * vec4(position, 1.0);
vec4 viewPos = projectionMatrix * viewMatrix * worldPos;
```

> When multiply matrix, order matters



### The flow in order:

```
3D model → (Model Matrix)
World Space → (View Matrix = camera)
Camera Space → (Projection Matrix: perspective OR ortho)
Clip Space  ✅

↓ divide by w

NDC Space (x,y,z ∈ [-1, 1]) ✅

↓ map to viewport

Screen Space (pixels)
```

### Clip space

after projection matrix, still homogeneous (x,y,z,w)

## Orthographic

**Orthographic Projection** → no depth scaling, all objects same size
## Perspective
**Perspective Projection** → realistic depth, far = smaller

## NDC
- **NDC** → divide by w, now in range **−1 to 1**, ready for viewport mapping
