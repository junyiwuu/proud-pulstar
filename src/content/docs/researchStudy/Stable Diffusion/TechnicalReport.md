---
title: Technical Report
---


## Abstract

This paper walk investigates the method present in the paper [<Boosting 3D Object Generation through PBR Materials>](https://arxiv.org/abs/2411.16080) . Stable Diffusion model and its components has been discussed, then this report walks through implement details of Fine-tune Stable Diffusion model, UNet particularly, to predict Albedo layer from Beauty render image.

---
## Literatures / Resources
* Understand convolution layers, neural networks, positional encoding etc. : [Deep Learning Specialization](https://www.coursera.org/specializations/deep-learning?utm_medium=sem&utm_source=gg&utm_campaign=b2c_emea_deep-learning_deeplearning-ai_ftcof_specializations_cx_dr_bau_gg_sem_pr_gb_en_m_hyb_25-05_x&campaignid=22614386396&adgroupid=175449925890&device=c&keyword=deep%20learning%20coursera&matchtype=p&network=g&devicemodel=&creativeid=755072260035&assetgroupid=&targetid=kwd-340393147827&extensionid=&placement=&gad_source=1&gad_campaignid=22614386396&gclid=Cj0KCQjwxo_CBhDbARIsADWpDH4G0c-ajtx4dLiDrpapUR1XWqTl7TVmDEc7tmOAXxrromn3kgkduSEaAtV6EALw_wcB)
* Brief on Diffusion models with code: [How Diffusion Models Work](https://learn.deeplearning.ai/courses/diffusion-models/lesson/xb8aa/introduction)
* Understand Autoencoder and VAE : [From Autoencoder to Beta-VAE](https://lilianweng.github.io/posts/2018-08-12-vae/)
* Attention mechanism: [Attention in Transformers: Concepts and Code in PyTorch](https://learn.deeplearning.ai/courses/attention-in-transformers-concepts-and-code-in-pytorch/lesson/han2t/introduction)
* DIffusion models with annotations and code: [Diffusion Models](https://nn.labml.ai/diffusion/index.html)
* DDPM equation: [DDPM youtube](https://www.youtube.com/watch?v=zEZOYZeIPUs)
extra: 
* Understand GAN and many other loss functions, latent space, data agumentation etc. Broaden knowledge and compare GAN with SD for better understanding. GAN network is easier coding, familiar with PyTorch [GAN Specialization](https://www.coursera.org/specializations/generative-adversarial-networks-gans#courses)

---

## Introduction
If we want to implement the idea from the paper, understand Stable Diffusion model is a must.

### Text Encoder
(deep learning specialization coursework)

### VAE (Variational Autoencoder)

#### Autoencoder
Autoencoder is a neural network designed to learn an identity function in an unsupervised way to reconstruct the original input while compressing the data in the process so as to discover a more efficient and compressed representation. 

It consists of two networks:
- _Encoder_ network: It translates the original high-dimension input into the latent low-dimensional code. The input size is larger than the output size.
- _Decoder_ network: The decoder network recovers the data from the code, likely with larger and larger output layers.

(from [Lil' Blog](https://lilianweng.github.io/posts/2018-08-12-vae/))



#### VAE
Mapping the input to a distribution.

Compare to autoencoder, two more features have been added to VAE:
1. Probabilistic latent space
2. KL divergence loss (The KL divergence loss encourages the learned distribution N(μ, σ²) to be close to a standard normal distribution )

Instead of outputing a z vector from the encoder, it outputs a distribution which consists of : mean vector $\mu$ and standard deviation vector $\sigma$ .
Then sample the latent vector $z$ from this distribution.


### UNet
encoder - bottleneck - decoder



### Scheduler



---

## Data Preparation
### Megascan Synthetic data

**blender script**
One script that automatically read in Megascan data, load into blender, automatically link Albedo, Roughness and Normal map. The environment light is implemented, the camera and HDRI are randomly rotate spherically.
The output are one final render image, which is called Beauty, one Albedo image, which only contains color information of the asset, one Normal image, which represent the object normal of the asset (mention: the paper seems using world normal, TBC distinguish the difference)

**batch process**
Set up the folder where contains all raw data, HDRI path, and output directory.


### HyperSim dataset



---

## Methodologies
For this study,I based on the [training code](https://github.com/prs-eth/Marigold/blob/62413d56099d36573b2de1eb8c429839734b7782/train.py) from [Marigold](https://github.com/prs-eth/Marigold/tree/62413d56099d36573b2de1eb8c429839734b7782), and [pipeline code](https://github.com/snowflakewang/PBR_Boost_3DGen/blob/main/albedo_mesh_gen/MonoAlbedo/albedo_pipeline.py) from [Paper](https://arxiv.org/abs/2411.16080)'s [code](https://github.com/snowflakewang/PBR_Boost_3DGen).


```
cat_latents = torch.cat([noisy_latents, beauty_latent], dim=1
```



---


## Analysis, Testing and Results



---


## Conclusion