---
title: Technical Report
---
## Introduction
* **Overview**: Fine Tune UNet part of Stable Diffusion model
* **Goal**: Use Beauty image to infer Albedo image 
	* Beauty: usually refer to the final render image from 3D software, which including lighting condition, textures, PBR shaders
	* Albedo: the texture only contain color information
* Other info:
	* Based on Marigold project [this commit](https://github.com/prs-eth/Marigold/tree/62413d56099d36573b2de1eb8c429839734b7782)
	* Pipeline code referred from [paper's code](https://github.com/snowflakewang/PBR_Boost_3DGen/blob/main/albedo_mesh_gen/MonoAlbedo/albedo_pipeline.py)


## Core Idea

VAE encode -> latent -> unet -> transformer -> unet -> VAE decode

What is VAE, difference between autoencoder
What is unet
What is transformer and attention blocks inside, math equation and where is the text embeddings


## Process 

这里写在做什么，然后令开一个文档，放代码 ，这样文字和代码对上。主要是思路必须是顺畅的

start the training
    ↓
loop each epoch
    ↓
    loop each batch
        ↓
        1. Forward
        2. Loss
        3. Backward propagate
        4. update parameters(Optimizer.step)
        ↓
        every certain steps → call: \_train_step_callback()
                            ↓
                        check if need：
                        - save checkpoint (save_period)
                        - do validation (val_period)
                        - do visualization (vis_period)
                    -
**Seed:** 
Three different seed applied
* training seed
* validation seed
* dataloader seed
### Dataset
**Overview**: Dataset is the place where you load your training data. I apply the normalization here (while others prefer to separate it)


Constructor: 
When preparing the training dataset, a "filename_list" file is created, containing the paired dataset information (which beauty file -> which albedo file)
In the constructor, training data/images are read according to the "filename_list". 

In `__getitem__` method :
Here we retrieves the corresponding beauty and albedo image paths, loads the image using PIL and then converts them to tensors. All tensors been normalized to \[-1, 1\]


Other info:
* valid mask: just set all 1, inherit from Marigold





### Training starter

Overview: training.py, where to start the training. Here has all configurations set up for training process. (read from config)

* parser
* initialization (TBC)
* logging settings(TBC)
* device [[code#^da8c7d]]
	* check if cuda available
	* logging device information
* snapshot(TBC)
* set "effective batch size", "accumulation steps" [[code#^b70a62]]
* seed (TBC)
* load dataset  [[code#^d2fd95]]
	* here we have validation dataset and training dataset same
* Models [[code#^438ba0]]
	* load models (unet, vae, scheduler, text encoder, tokenizer)
	* put all models together
* continue training if stop in middle (not check yet TBC)
	* load check point



### Training 
Major Goal: Concatenate beauty image and noise (represent albedo), modify the input for unet


The input channels for unet must be 8 channels, because we have 4 channels for beauty and 4 channels for noise/albedo


#### \_replace_unet_conv_in
[[code#_replace_unet_conv_in]]
==Modify the input convolution layer for unet, allow input 8 channels==

* double the weight and bias
#### \_train_step_callback
[[code#^6c41d6]]
* save checkpoint
* validation [[Technical Report#validate]]
* save checkpoint 
* visualization  [[Technical Report#visualize]]


#### validate / visualize

##### validate
for loop dataloader
1. set the dataset name
2. set the metric dictionary


##### visualize
save the validation image, which is also visualization image. this calls "validate_single_dataset"

##### validate_single_dataset
[[code#^03be56]]
overview: load validation dataloader -> use pipeline to predict -> calculate metrics -> save the result as image
1. set it to `torch.no_grad()` -> doesn't need to update parameters
2. move model to device, reset metrics
3. generate seed
4. loop in validation dataloader
	1. load in beauty and albedo, valid mask
	2. random generator
	3. got predicted albedo numpy and PIL from MaterialOutput



---

**batch size:** how many training data will be used in one iteration
**effective batch size:** When GPU cannot fit "batch size" in one go, so split into several "effective batch size". For example "batch size" is 64, and it can be spitted into 4 "effective batch size"=16.
* do forward -> loss -> backward -> accumulate the gradient, every "effective batch size" (not "batch size)
* after 4 round of "effective batch size" -> update gradient `optimizer.step()` -> zero gradients
The whole process called **gradient accumulation**


#### train loop
1. move all to "device"
2. if not finish last time, continue evaluation
3. reset train metrics
4. for epoch loop
5. for dataloader/batch loop
	1. set the model training mode (training mode has Dropout and BatchNorm layers)
	2. generate seed 
		* first generate local seed
		* second generate torch seed by using torch.Generator
	3. get data [[code#^getdata]]
		* beauty from dataloader
		* albedo from dataloader (as target)
	4. mask [[code#^validmask]]
	5. set batch_size = loader batch size
	6. 




### Config






### Pipeline
* \_\_call__
* \_encode_empty_text
* \_single_infer
* \_encode_rgb
* \_decode_albedo
* \_ensemble_albedo
* \_resize_max_res
* \_find_batch_size



#### \_\_call__
return `MaterialOutput`

1. check if the input is Image or tensor
2. infer albedo
	1. duplicate albedo "ensemble_size" times 
	2. put them into a dataloader
	3. loop the dataloader, infer everytime
	4. collect all inferred albedo
3. ensemble = average all inferred result
4. resize back to the target size
5. transfer from tensor to numpy
