---
title: usd
---



### Notes
(in the LOP) get the current stage from a node: 
`stage = hou.pwd().editableStage()`

`stage = Usd.Stage.CreateInMemory()`

**Sdf** : Scene Description Foundation

xxx.Define (stage, path)

Gf: Geometry Foundation

|Type|Description|Example|
|---|---|---|
|`Gf.Vec3f`, `Gf.Vec3d`, `Gf.Vec2f`|2D/3D vectors (float or double precision)|`Gf.Vec3f(1.0, 2.0, 3.0)`|
|`Gf.Matrix4d`, `Gf.Matrix3f`|3x3 or 4x4 matrices|`Gf.Matrix4d(1)` for identity|
|`Gf.Quatf`, `Gf.Quatd`|Quaternions for rotations|`Gf.Quatf(1, 0, 0, 0)`|
|`Gf.Rotation`|Combined rotation representation (can convert to/from matrices/quats)|`Gf.Rotation(Gf.Vec3d(0,1,0), 45)`|
|`Gf.Transform`|Position + rotation + scale together|`Gf.Transform(Gf.Matrix4d(1))`|
|`Gf.BBox3d`|3D bounding box|`Gf.BBox3d(Gf.Range3d(...))`|
|`Gf.Range3d`|3D range (min/max bounds)|`Gf.Range3d(Gf.Vec3d(0), Gf.Vec3d(1))`|
|`Gf.EulerRotation`|Represent rotations in Euler angles|`Gf.EulerRotation(0, 90, 0)`|


| Task            | How to do it                                  |
| --------------- | --------------------------------------------- |
| Create geometry | `UsdGeom.Cube.Define(stage, "/path")`         |
| Create material | `UsdShade.Material.Define(...)`               |
| Assign material | `UsdShade.MaterialBindingAPI(prim).Bind(mat)` |
| Save USD        | `stage.GetRootLayer().Export("file.usda")`    |

### Stage
https://openusd.org/release/api/class_usd_stage.html

Create a stage: `Usd.Stage.CreateInMemory()`
When export: `stage.GetRootLayer().Export(path)`

### Geo
Create a cube: `UsdGeom.Cube.Define(stage, "/World/Cube")`
Add Translation or scale : 
```
cube.AddTranslateOp().Set(Gf.Vec3f(0, 0, 0))
cube.AddScaleOp().Set(Gf.Vec3f(1, 1, 1))
```

### Material
Create a material: `mat = UsdShade.Material.Define(stage, "/World/Mat/ThisMat")`

Bind the material: `UsdShade.MaterialBindingAPI(prim).Bind(material)`

[UsdShadeMaterialBindingAPI class](https://openusd.org/release/api/class_usd_shade_material_binding_a_p_i.html)


### DataTypes

Basically the type of data, for example `Sdf.ValueTypeNames.Color3f`, `Sdf.ValueTypeNames.Matrix4d`,  `Sdf.ValueTypeNames.Float`
If want to set the value: `shader.CreateInput("diffuseColor", Sdf.ValueTypeNames.Color3f).Set(Gf.Vec3f(1.0, 0.0, 0.0))`, 




### Standard Material Terminal Outputs

https://openusd.org/release/api/class_usd_shade_material.html

- CreateSurfaceOutput
`mat.CreateSurfaceOutput().ConnectToSource(shader.connectableAPI(), "surface")`
- GetSurfaceOutput
