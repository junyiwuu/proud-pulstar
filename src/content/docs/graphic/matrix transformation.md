---
title: matrix transformation
---

Random rotation
```
def random_rotation_translation(t):
    m = np.random.normal(size=[3, 3])
    m[1] = np.cross(m[0], m[2])
    m[2] = np.cross(m[0], m[1])
    m = m / np.linalg.norm(m, axis=1, keepdims=True)
    m = np.pad(m, [[0, 1], [0, 1]], mode='constant')
    m[3, 3] = 1.0
    m[:3, 3] = np.random.uniform(-t, t, size=[3])
    return m
```

even  though the final result will be like```
array([[ 0.95118943, -0.21477809, 0.22160561, -2.26626204], 
		[ 0.99950015, 0.01651253, 0.0269591 , -2.94786707], 
		[ 0.36434273, -0.19739848, 0.91010341, 2.30332461], 
		[ 0.         , 0.         , 0.         , 1.     ]])```

it doesn't look similar to 

```
[[ cosθ,  0, sinθ, 0],
 [    0,  1,    0, 0],
 [-sinθ, 0, cosθ, 0],
 [    0,  0,    0, 1]]
```
it still can do the random rotation, because **只要矩阵满足正交性 + 行列式 = 1，它就是一个合法的旋转矩阵，不会产生缩放。**

