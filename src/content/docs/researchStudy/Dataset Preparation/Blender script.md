---
title: Blender script
---
**Purpose:** using megascan library assets --> rendering in blender, with various HDRI, various camera angle, full PBR material --> output: one full material image, one only with Albedo, one only with Normal 

**Common setup:**  LOD2 

notes:
* **render pass*:
	* view layer is where you will export all layers (diff, normal etc, also aov)
	* only one view layer can be activated at the momemt
	* view layer is inside render layer node, multiple render layer nodes  can set as different view layer seperately, but they won't able to export at the same time (at least mine doesn't work) 
		* (for example renderLayer1 use viewLayer1, this will output Beauty, and renderLayer2 use viewLayer2, viewLayer2 set material override, and will output new Beauty. I can't make material override work)
	* `file_output_node.file_slots.new("Beauty")` does return this file_slots object, you  have to `beauty_slot = file_output_node.file_slots.new("Beauty")`
	* This slot can setup output format for example exr
	* Default diffuse pass (png) doesn't have alpha, can use `CompositorNodeSetAlpha` node to borrow alpha channel from Alpha (render layer node default output), and input diffuse pass, then output from this `CompositorNodeSetAlpha` node will go to output file slot
* **shader**:
	* if want to export aov, instead of `ShaderNodeOutputMaterial` node for BSDF(for example), use `ShaderNodeOutputAOV` node, remember must set `aov_name` same as the aov name in the view layer (`apv.name`)
*


## How to find the nodes name (from Blender)
In console:
`node = bpy.context.active_object.active_material.node_tree.nodes.active`
`node.bl_idname`


## Modules


- [Context Access (`bpy.context`)](https://docs.blender.org/api/current/bpy.context.html)
- [Data Access (`bpy.data`)](https://docs.blender.org/api/current/bpy.data.html):
	* `bpy.data.objects`
	*  `bpy.data.materials`
	*  `bpy.data.meshes`
- [Message Bus (`bpy.msgbus`)](https://docs.blender.org/api/current/bpy.msgbus.html)
- [Operators (`bpy.ops`)](https://docs.blender.org/api/current/bpy.ops.html)
- [Types (`bpy.types`)](https://docs.blender.org/api/current/bpy.types.html)
- [Utilities (`bpy.utils`)](https://docs.blender.org/api/current/bpy.utils.html)
- [Path Utilities (`bpy.path`)](https://docs.blender.org/api/current/bpy.path.html)
- [Application Data (`bpy.app`)](https://docs.blender.org/api/current/bpy.app.html)
- [Property Definitions (`bpy.props`)](https://docs.blender.org/api/current/bpy.props.html)




## world
**world setup with HDRI**(?存疑，一定如此吗？)
```python
# create world
world = bpy.data.worlds.new("Simple_World")

# set current context --> world
bpy.context.scene.world = world

# setup background color
world.color = (0.05, 0.05, 0.05)  # 深灰色背景
```


## HDRI
How to link:

```python
    node_env = nodes.new(type = "ShaderNodeTexEnvironment")
    node_bg = nodes.new(type="ShaderNodeBackground")
    node_out = nodes.new(type="ShaderNodeOutputWorld")
    node_env.image = bpy.data.images.load(hdri_path) # load image
    # link everything
    # env(with image).color --> bg.color --> bg.background(output) -> out.surface (world input)
    links.new(node_env.outputs["Color"] , node_bg.inputs["Color"])
    links.new(node_bg.outputs["Background"] , node_out.inputs["Surface"])
```

env(with image).color --> bg.color --> bg.background(output) -> out.surface (world input)



## Object
[`bpy.types.Object`](https://docs.blender.org/api/current/bpy.types.Object.html)

**Setup Normal map color space very important**: `normal_map_node.image.colorspace_settings.name = 'Non-Color'`



## View Layers
Decide what you can see or cannot render in the layer