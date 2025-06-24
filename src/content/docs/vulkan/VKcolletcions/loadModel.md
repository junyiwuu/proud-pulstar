---
title: Load Model
description: how to load model by using tiny_obj_loader
---

---



```cpp
void LveModel::Builder::loadModel(const std::string &filepath){
    tinyobj::attrib_t attrib;
    std::vector<tinyobj::shape_t> shapes;
    std::vector<tinyobj::material_t>materials;
    std::string warn, err;

    if(!tinyobj::LoadObj(&attrib, &shapes, &materials, &warn, &err, filepath.c_str())){
        throw std::runtime_error(warn + err);
    }
    vertices.clear();
    indices.clear();


    for(const auto &shape : shapes){  //loop eveyrthing in the shapes, each element called shape
        for(const auto &index: shape.mesh.indices){
            Vertex vertex{};

            //position
            if(index.vertex_index >= 0){
                vertex.position = {
                    attrib.vertices[3 * index.vertex_index + 0],
                    attrib.vertices[3 * index.vertex_index + 1],
                    attrib.vertices[3 * index.vertex_index + 2],
                };

                //add color support (point color)
                auto colorIndex = 3* index.vertex_index + 2;
                if(colorIndex < attrib.colors.size()){
                    vertex.color = {
                    attrib.colors[colorIndex -2],
                    attrib.colors[colorIndex -1],
                    attrib.colors[colorIndex -00],
                    };
                }else{
                    vertex.color  = {1.f, 1.f, 1.f};  //set the default color
                }
            }

            //normal
            if(index.normal_index >= 0){
                vertex.normal = {
                    attrib.normals[3 * index.normal_index + 0],
                    attrib.normals[3 * index.normal_index + 1],
                    attrib.normals[3 * index.normal_index + 2],
                };
            }


            //uv
            if(index.texcoord_index >= 0){
                vertex.uv = {
                    attrib.texcoords[2 * index.texcoord_index + 0],
                    attrib.texcoords[2 * index.texcoord_index + 1],
                };
            }


            vertices.push_back(vertex);
        }
    }
```