---
title: Compile GLSL to SPIR-V
---
### compile GLSL to SPIR-V

we need to compile the shader code into intermediate binary formate (SPIR-V). like compile in c++
* -o specifiy our compiled output file's name, int his caser we use the same name
---
**compile.sh**
.sh file is the shell file, we create compile.sh: 

`/usr/bin/glslc shaders/simple_shader.vert -o shaders/simple_shader.vert.spv`

`/usr/bin/glslc shaders/simple_shader.frag -o shaders/simple_shader.frag.spv`

---
In Terminal: `chmod +x compile.sh` make this file executable



