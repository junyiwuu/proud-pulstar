---
title: glsl
---
```glsl
layout (location = 0) in vec2 position;
//tell GPU to read position data from location 0 of the vertex buffer

layout (location = 1) in vec3 color;
//in : 从vertex buffer读入位置数据

layout (location = 0) out vec3 fragColor;
//out : 输出到fragment shader, fragment shader中会有对应的in vec3 fragColor来接收这个数据
```

---
gl_VertextIndex: contains the index of the current vertext for each time our main function run

**`layout(location=0) out vec4 outColor;

> **layout(location=0):**
layout qualifier. Specifies the location index of this output variable. currently return 0, meaning this variable will be linked to the first framebuffer


>**in**:
>means this is input data coming into shader
>
> **out**:
this variable is an output of the fragment shader. fragment shader produce color values for each pixel, this is where the color will be stored

>**outColor:**
the name of output variable




OVERALL:
a output variable , name is "outColor"-- fragment shader, location is 0, vec4


