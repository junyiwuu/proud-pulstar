---
title: Shading
---



## Phong shading
Phong doesn't consider indirect lighting. It doesn't follow the energy conservation rule

ambient * ambient strength
 \+ diffuse lighting
#### Diffuse Lighting
`diffuse = max(dot(N, L), 0.0)`

```glsl
uniform sampler2D iChannel0;
in vec3 vPos;
in vec3 vNormal;
in vec2 vUv;

void main() {
  vec3 objectColor = texture2D(iChannel0, vUv).rgb;
  vec3 fragNormal = normalize(vNormal);
  vec3 lightColor = vec3(1.0, 1.0, 0.75);
  
  float ambient = 0.2;
  vec3 lightDir = normalize(vec3(-1.0, 2.0, 2.0)-vPos);
  float diffuse = max(dot(fragNormal, lightDir), 0.0);
  
  vec3 result = lightColor *  objectColor * (ambient+diffuse);
  
  gl_FragColor = vec4(result, 1.0);
}
```


#### Specular

1. `reflectDir = reflect(lightDir, fragNormal)`
2. `spec = pow(max(dot(reflectDir, viewDir), 0.0) , shinness)`
3. `specular = spec * lightColor * specularStrength`


```
uniform sampler2D iChannel0;
in vec3 vPos;
in vec3 vNormal;
in vec2 vUv;

void main() {
  vec3 objectColor = texture2D(iChannel0, vUv).rgb;
  vec3 fragNormal = normalize(vNormal);
  
  vec3 lightColor = vec3(1.0, 1.0, 0.75);
  vec3 lightPos = vec3(-1.0, 2.0, 2.0);
  vec3 lightDir = normalize(lightPos - vPos);
  
  float ambient = 0.2;
  float diffuse = max(dot(fragNormal, lightDir), 0.0);

  vec3 viewPos = vec3(0.0, 0.0, 2.5);
  vec3 viewDir= normalize(viewPos - vPos);

  // reflect function expect an incident light
  vec3 reflectDir = reflect(-lightDir, fragNormal);
  float specular = pow(max(dot( reflectDir, viewDir), 0.0), 32.0);
  
  vec3 result = lightColor * (ambient + diffuse + specular) * objectColor;
  gl_FragColor = vec4(result, 1.0);
}
```



#### Attenuation   

`Attenuation = 1.0 / (Kc + Kl * Distance + Kq * Distance * Distance)`

- **Kc (Constant Term)** is typically set to 1.0 to ensure the denominator never gets smaller than 1, preventing an unrealistic boost in intensity at certain distances.
- **Kl (Linear Term)** is multiplied by the distance, reducing intensity linearly.
- **Kq (Quadratic Term)** is multiplied by the square of the distance, causing a quadratic decrease in intensity. This term is less significant at short distances but becomes more impactful as the distance increases.

 ```
 uniform sampler2D iChannel0;
in vec3 vPos;
in vec3 vNormal;
in vec2 vUv;

void main() {
  vec3 viewPos = vec3(0.0, 0.0, 2.5);
  
  vec3 objectColor = texture2D(iChannel0, vUv).rgb;
  vec3 fragNormal = normalize(vNormal);
  vec3 fragPos = vPos;
  
  vec3 lightColor = vec3(1.0, 1.0, 0.75) * 3.0;
  vec3 lightPos = vec3(-1.0, 2.0, 2.0);
  vec3 lightDir = normalize(lightPos - fragPos);
  
  float ambient = 0.2;
  float diffuse = max(dot(fragNormal, lightDir), 0.0);
  
  vec3 viewDir = normalize(viewPos - fragPos);
  vec3 reflectDir = reflect(-lightDir, fragNormal);  
  float specular = max(dot(viewDir, reflectDir), 0.0);
  specular = pow(specular, 32.0);

  // attenuation
  float Kc = 1.0, K1 = 0.0, Kq = 0.1;
  float distan = distance(lightPos, fragPos);
  float attn = 1.0 / (Kc+K1*distan + Kq*distan*distan);
  
  vec3 result = lightColor * (ambient + diffuse + specular) * attn * objectColor;
  
  gl_FragColor = vec4(result, 1.0);
}
 ```


#### Halfway Vector
`HalfwayDir = normalize(LightDir + viewDir)`

- **Whats the issue** (why) :  Issue with Phong Specular Reflections
When the angle between the view **V** and reflection vectors **L'** exceeds 90 degrees, the resulting dot product becomes negative. This leads to a specular factor of 0.0, creating a sharply defined border in the specular reflection area.

- **Solution:** So instead of relying on the reflection vector we can use a **halfway vector (H)**, that is a unit vector that lies exactly halfway between the view direction **V** and the light direction **L**. -==The closer this halfway vector aligns with the surface's normal **N**, the higher the specular contribution.== The angle between the halfway vector and the surface normal never exceeds 90 degrees, ensuring a smoother and more consistent specular contribution.


```
// Others remain same (as above), but use halfwayDir in specular calculation
  vec3 halfwayDir = normalize(lightDir + viewDir );
  float specular = max(dot(halfwayDir, fragNormal), 0.0);
```

Logic should follow as below:
Result = diffuse color + specular color
diffuse color = (ambient strength + diffuse) * light color * albedo map
specular color = specular strength * specular map * light color



#### Normal map
Logic: 
1. sample the normal map (which originally \[0, 1]), Then remap it to \[-1, 1]
2. Use this normal map as the normal for diffuse and specular
	1. For diffuse: `dot(Normal, lightDir)`
	2. For specular: `reflectDir = reflect(-lightDir, Normal)`
	Always with light direction!



#### SpotLight

**Attention**: use dot to compare the spot light direction and (general light to frag position) direction, be careful about this vector's direction.

```
vec3 getSpotLightDir() {
  float dx = cos(iTime) * 0.25;
  float dy = sin(iTime) * 0.25;
  return normalize(vec3(0.0, 0.0, -1.0) + vec3(dx, dy, 0.0));
}

void main() {
  vec3 viewPos = vec3(-4.0, 0.0, 2.5);
  vec3 objectColor = texture2D(iChannel0, vUv).rgb;
  vec3 objectSpecular = texture2D(iChannel1, vUv).rgb;
  vec3 fragNormal = normalize(vNormal);
  
  vec3 lightColor = vec3(1.0, 1.0, 0.75);
  vec3 lightPos = vec3(0.0, 0.0, 2.0);
  vec3 lightDir = normalize(lightPos - vPos);

  float alignment = dot(getSpotLightDir(), -lightDir);
  float cutoff = cos(radians(12.0));
  float spotArea;
  if (alignment > cutoff){
      spotArea = 1.0; }
  else{
      spotArea = 0.0; }
  
  float ambient = 0.2;
  float diffuse = max(dot(fragNormal, lightDir), 0.0);
  
  vec3 viewDir = normalize(viewPos - vPos);
  vec3 reflectDir = reflect(-lightDir, fragNormal);  
  float specular = max(dot(viewDir, reflectDir), 0.0);
  specular = pow(specular, 32.0);

  vec3 result = vec3(0.0);
  result += ambient * objectColor;
  result += diffuse * objectColor *spotArea;
  result += specular * objectSpecular*spotArea;
  result *= lightColor ;
  
  gl_FragColor = vec4(result, 1.0);
}
```






## Phong model

![pic](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Phong_components_version_4.png/960px-Phong_components_version_4.png)

## Blinn-Phong
Change the original reflection vector to halfway vector, to calculate specular





## PBR


PBR is a computer graphic technique that simulates the way light interacts with surfaces in the real world, and create more realistic images. It follows real-world physics for how light behaves.
It follows energy conservation, in PBR, a material never reflect more light than it receives.

**Equation:**  Cook-Torrance


$$f(l, v) = \frac{D(h) \cdot F(v, h) \cdot G(l, v)}{4 (n \cdot l)(n \cdot v)}  $$

| Symbol          | Meaning                                                         |
| --------------- | --------------------------------------------------------------- |
| **l**           | light direction                                                 |
| **v**           | view (camera) direction                                         |
| **h**           | half vector = normalize(l + v)                                  |
| **n**           | surface normal                                                  |
| **D(h)**        | _Normal Distribution Function_ → how micro-normals are oriented |
| **F(v, h)**     | _Fresnel term_ → how reflectivity changes by viewing angle      |
| **G(l, v)**     | _Geometry/Shadowing term_ → how much self-shadowing occurs      |
| **4(n·l)(n·v)** | normalization → ensures energy conservation                     |

> Cook–Torrance is a core PBR shading equation that models realistic reflection using microfacet theory — and it guarantees energy conservation.

### D Term
**Normal Distribution Function (NDF)**
How many microfacets are oriented in the perfect reflection direction?
Common choice:  GGX

$$D(h) = \frac{\alpha^2}{\pi \left[(n \cdot h)^2 (\alpha^2 - 1) + 1\right]^2}  $$


- α = roughness² (squared roughness)
> Sharp highlight (low roughness) → D is very concentrated
> Rough surface → D spreads out


### F Term
**Fresnel term**
How much light is reflected vs refracted, depends on view angle
Choice: Schlick's approximation(fast and accurate)
$$F(v,h) = F_0 + (1 - F_0)(1 - (v \cdot h))^5  $$
- F₀ = reflectance at 0° viewing angle (e.g. 0.04 for plastics, 1.0 for metals) (正面垂直看物体，$F_0$ 最小反射)
    
> As you look more grazing angle, reflection increases strongly → glass, water, metal edges

### G Term
**Geometry/shadowing/masking term**
Common Choice: Smith's Geometry Function (Schlick-GGX)
$$G(l,v) = G_1(l) \cdot G_1(v)  $$
$$G_1(x) = \frac{n \cdot x}{(n \cdot x)(1 - k) + k}  
\quad\text{with}\quad k = \frac{(\alpha + 1)^2}{8}  $$

Also a percentage



### BxDF
Bidirectional Scattering Distribution Function
It is a general name for any function that describes how light is scattered at surface
- **BRDF** — Bidirectional _Reflectance_ Distribution Function (light reflects off surface) (energy conserve: the material cannot reflect more light than it receives)
- **BTDF** — Bidirectional _Transmittance_ Distribution Function (light passes through surface)
- **BSDF** — Bidirectional _Scattering_ Distribution Function (umbrella term: reflection + transmission)
What requirements for a function be valiud BxDF?
1. Symmetric
2. Energy Conservation
3. Non-negative





## General question
**What is Monte Carlo**
is a numerical technique that solves problems using random sampling. especially when there is no simple exact formula, the process can be described probabilistically

In CG: Monte Carlo is using random sampling to approximate how light behaves, tracing many random light paths and averaging them.