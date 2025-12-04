---
title: nvdiffrec notes
---

## issues
Brief: when downloading and using nvdiffrec repo, it requires some setup, common issue is tiny-cuda-nn [[tiny-cuda-nn]]



**use docker:**
1. go into the docker , in the docker everything works fine, so print out docker's configuration
everything works: `docker run --gpus device=0 -it --rm -v /raid:/raid -it nvdiffrec:v1 bash` 这个意思是挂在/raid到容器的/radi，所以要用自己的文件夹就要换掉第一个路径
* 要么把当前文件夹挂上去
`docker run --gpus device=0 -it --rm -v $(pwd):/workspace -it nvdiffrec:v1 bash`
* 要么把项目文件夹挂上去
`docker run --gpus device=0 -it --rm -v /home/j/projects/playground/nvdiffrec:/workspace -it nvdiffrec:v1 bash`

1. run train.py，按照readme尝试，一切运行正常
2. 打印docker configuration
	1. 尝试使用conda，有conda（`which conda`），有conda base，但是无法使用`conda activate base`-> 在docker常见，因为conda init这种设置一般在用户交互式shell里加的，docker启动时默认不加载这些配置文件。
	2. 所以要判断是conda还是pip环境
		1. 通过之前make_image.sh里面有pip install xxx -> 判断是用的pip
	3. 打印pip环境 `pip freeze > env.txt`
		1. 但是里面包含了大量docker的本地路径，无法拿出来重新build环境
		2. `pip list --format=freeze > clean_requirements.txt` 用这个可以直接让version出来
	4. 或者把所有信息全部弄出来：
```
		(   echo "=== ENV ==="
			env
			echo "=== PIP LIST ==="
			pip list
			echo "=== CONDA INFO ==="
			conda info
			conda list
			echo "=== OS INFO ==="
			cat /etc/os-release
			echo "=== GPU ==="
			nvidia-smi
		) > env_dump.txt

```

5. 创建新的conda env，按照docker configuration配置
	1. 问题：一样的python版本，但是有些包说和当前python版本不兼容
		1. 可以在docker里重建conda env，然后装一遍之前pip输出的cconfiguration然后再打印出来，就应该是过滤过的干净的dependencies
		2. docker里面没有初始化conda`source /opt/conda/etc/profile.d/conda.sh`
	2. dependency太复杂，先尝试用nvdiffrec首页的setup


6. 又是tinycuda安装问题
	1. python3.12安装一切正常，3.8会总是说找不到CUDA_HOME
		1. 可能原因pytorch检测不到CUDA runtime
		2. 虽然bashrc里面什么都有，但是新的conda可能不会检测到（存疑？）所以要创建conda自己的激活，也就是activate.d --> 依旧不行
		3. 新的env，3.12, 官网最新stable的torch，然后python setup.py install 安装tinycudann



用所有新版本的python， torch，cuda，然后尝试修复nvdiffrec
```bash
export TORCH_CUDA_ARCH_LIST="120"

export CUDA_LAUNCH_BLOCKING=1  
```


```python
import faulthandler; faulthandler.enable(all_threads=True)
```

tinycudann本身有问题？？说建议在compile的时候就设定arch=120 （先没尝试）


目前的可能解决问题：
1. 重新安装tinycudann，specify arch=120
	1. 先update git
	2. activate conda env
	3. pip uninstall tinycudann
	4. specify the architecture，export TCNN_CUDA_ARCHITECTURES=120。 搜索rtx5090 compute capability确认arch
	5. `pip install git+https://github.com/NVlabs/tiny-cuda-nn/#subdirectory=bindings/torch`

finnaly things work, 
最重要的是在pip install tinycudann之前需要先export TCNN_CUDA_ARCHITECTURES=120


然后开始运行，如果没有实时显示的，可以运行
如果需要实时显示的，
1. **OpenGL 上下文创建失败**：nvdiffrast 需要 OpenGL 进行光栅化
2. **CUDA-GL 互操作失败**：CUDA 无法访问 OpenGL 缓冲区
3. **EGL 配置问题**：在服务器或无头环境中运行时常见


```bash
export PYOPENGL_PLATFORM=egl
```
这个说是转成了opengl，但是不能解决问题，所以直接改成cuda
在train.py中`glctx = dr.RasterizeGLContext()` 改成 `glctx = dr.RasterizeCudaContext()`，然后就能跑了


总结如何跑通nvdiffrec
1. 安装python3.12, torch stable version, 以及其他页面上require的，除了tinycudann
2. export TCNN_CUDA_ARCHITECTURES=120
3.  `pip install git+https://github.com/NVlabs/tiny-cuda-nn/#subdirectory=bindings/torch`
4. 修改nvdiffrec中的一些代码：torch.cross，在最后加上dim=-1
5. 修改train.py中`glctx = dr.RasterizeGLContext()` 改成 `glctx = dr.RasterizeCudaContext()`






### 开始执行 boost 3d的normal boost的代码

1. 一些老code的问题改成`scaler = torch.cuda.amp.GradScaler(device='cuda', enabled=True) `
2. ffmpeg问题 
	1. `sudo dnf install -y epel-release`
	2. pip install imageio-ffmpeg
```
dnf -y install --nogpgcheck https://mirrors.rpmfusion.org/free/el/rpmfusion-free-release-9.noarch.rpm && \
dnf  config-manager --set-enabled crb && \
dnf -y install ffmpeg
```
3. 把repo里面的torch.cross后面都加上, dim=-1 （还挺多，说明他改动nvdiffrec其实挺多）
4. torch.cuda.amp.GradScaler是pytorch 1.x的，对torch 2.x的话改成torch.amp.GradScaler [ref](https://github.com/ultralytics/ultralytics/issues/14677#issuecomment-2250057804)
成功


---

训练加上实时display
```bash
python train.py --config configs/spot.json --display-interval 20
```






---

# nvdiffrec 完整知识框架



## 8. 技术细节

### 8.1 CUDA优化

- **自定义内核**：关键计算用CUDA加速
- **内存管理**：高效的GPU内存使用
- **并行计算**：充分利用GPU并行能力

### 8.2 可微分技术

- **梯度传播**：整个管线支持反向传播
- **数值稳定性**：避免梯度消失/爆炸
- **高效实现**：减少内存占用和计算开销

## 9. 实际应用

### 9.1 使用场景

- **逆向渲染**：从图像重建3D模型
- **材质估计**：恢复物体的材质属性
- **视图合成**：生成新视角的图像
- **3D内容创作**：快速3D模型生成

### 9.2 配置文件

- **预设配置**：各种场景的最佳参数
- **灵活配置**：支持自定义训练参数
- **多GPU支持**：分布式训练加速

## 10. 学习路径建议

### 10.1 基础知识

1. **计算机图形学**：渲染方程、光照模型、纹理映射
2. **深度学习**：PyTorch、自动求导、优化算法
3. **3D几何**：网格表示、等值面、拓扑结构





---


## training.py


**target**包含：
* img
  mv (modelView matrix) \[batch, 4, 4]
	* 针对mesh优化，会生成默认的mv, mvp相继参数
	* 针对nerf任务，就需要数据自己的camera data
* mvp (model view projection matrix) \[batch, 4, 4]
* campos (camera position) \[batch, 3]
* resolution
* others: spp, background , ...



**whole process:**
1. import
	1. import data-readers, generators
	2. import geometry trainers - DMTet / DLMesh / FlexiCubes
	3. import utils
2. create loss，根据FLAGS决定使用哪种loss
	* 返回的是lambda
	* loss有smape, mse, logl1, logl2, relmse
3. batch预处理，加上背景
	* 因为target image是RGBA模式，这个background的参数也会继续往后传
	* background会被单独的存在一个channel，train image也是已经合成了背景的
	* ==mvp, mv这些东西都是怎么写的？==
4. uv处理
	1. 将当前的mesh（用户输入的mesh）
	2. 用自动拆uv的方式得到uv
	3. 提取其他信息，再加上uv，得到新的mesh
	4. 将材质从mlp中bake回mesh的uv上（MLP中包含所有的材质，在这里有kd, ks , normal）（MLP可以表达复杂的材质细节）
	5. 通过flag得到每个材质最大最小值，然后对他们进行normalize
5. 初始化材质，要么提供了texture就用贴图，要么使用MLP
	* MLP适用没有uv的情况，直接以spatial coordinates作为输入
		* 9个channels, 3kd +3ks + 3normal
	*  如果有贴图就用贴图
		* 将贴图转成了可differentiable的torch parameters
	* 最后输出大包好的mat
6. validate
	* 单张validate
		* 先设定no grad
		* 可能对light进行相机坐标的变换 [[researchStudy/differentiable Render/nvdiffrec/code#^51f458|code]]
		* 得到当前渲染的buffer[[researchStudy/differentiable Render/nvdiffrec/code#^cfa804|code]]，将其和target并排给你看
		* 额外的设置
			* latlong展示环境贴图
			* relight
			* bsdf (比如渲染时i只输出某个BSDF例如kd, normal...)	
		* 输出result image, result dict
			* result image 是一张拼接图作为可视化
			* result dic is the dictionary contains all vairables (light, relight, kd ...) that could be visualized
	* 对整个训练集做validate
		* load in validation dataset
			* 如果是mesh没有每相机对应的target，pipeline会自己去渲染对应的target [[researchStudy/differentiable Render/nvdiffrec/code#^eebb2a|code]]
		* 准备batch，合成背景
		* 调用validate_itr(单张validate)来得到渲染结果(result image and result dict)
		* compute metrics
		* 写入每张的metric结果
		* 记录每张图
		* 计算所有metrics的平均值
			* 计算单张metric和所有平均metric都是帮助分析定位的，和模型的optimization没有关系、
7. Trainer 封装训练对象
	* optimize geometry and optimize light是两个bool， True的时候优化geometry或light，false时不参与gradient
	* self.params是只要实例是torch.nn.Module的，类型是torch.nn.Parameter的就属于。 
		* self.params包含material和light
		* self.geo_params包含geometry的
		* 要分开优化，因为类型造成尺度不同，所以他们的lr不一样，regularization也不一样。
	* forward 
		* 如果要算light，那么生成light的mipmap
		* 如果使用camera world，那么将light transform到camera world
		* geometry tick
			* dlmesh, dmtet, flexiscube都有tick function
			* 拿一个tick举例
				1. 先用render()渲染当前geometry，输出成buffer
				2. 计算loss
					1. alpha loss + rgb loss
					2. SDF的regularizer
				3. 组合所有loss
					* 包括image loss and regularizer loss
8. optimize mesh
	* 完整的训练循环，包括optimizer, scheduler, batch, loss, regularize, validate / save, ...
	* 周期性validate 并保存checkpoint
	1. set up learning rate (for geometry and material)
	2. set image loss function
	3. initiate Trainer
	4. initiate optimizer and scheduler
	5. training loop
		1. initialize loss 
		2. set up train and validation dataloader
		3. loop train dataloader
			1. batch process random background for each batch
			2. show/save image before training step
			3. Zero gradients
			4. Training, calculate image loss and regularizer loss, add them together
			5. Back propagate, got the new gradient (but scale up light gradient and scale down material gradient) 
			6. update weight （更新weight）
				* if optimize mesh, also update mesh weight
				* 默认的optimizer都是针对material和light的
			7. clamp 和normalize 保证参数合理
			8. logging
9. main
	1. load FLAGS
	2. config / logging setup
	3. display output
	4. data pipeline (distinguish input is mesh or NERF or LLFF)
	5. trainable environment light
	6. provided base mesh or not
		1. if not
			1. PASS1 : use DMTet or FlexiCubes
			2. material set up (use MLP)
			3. run optimization (input geo, mat, lgt, dataset)
			4. if validate
				1. calculate average psnr and mse (validate function)
				2. render out current and target
			5. create base mesh from the result (UV here) and bake textures from MLP to UV
			6. free cuda, clean up mat and lgt
			7. initialize DLMesh
			8. save DMTet mesh and hdri
			9. PASS2: finer adjustment
		2. if yes
			1. load obj and mtl (unless set `mtl_override`)
			2. initialize DLMesh
			3. material set up (not use MLP, just trainable texture)
			4. run optimization
	7. validate
	8. dump output






几个问题：
regularizer在哪
* 所有的regularizer都加在一起的
灯光是怎么定义的
* 是怎么生成的？
* mipmap怎么生成的？
* 

## Components
### **mesh.py**
* load mesh
* aabb
* compute_edge_to_face_mapping: 每条边分别属于mesh哪两个三角形
* 统一空间坐标，算自己的aabb，最长边缩放成2
* 参考外部的aabb，将当前的mesh对其到另一个mesh
* 算normal
* 算tangent（必须现有uv)


### **DLMesh.py**
* DLMesh class
	* constructor
		* 所有的定点都是nn.parameter
		* 输入的mesh一个当作了initial guess另一个clone一份为mesh（作为可优变量）
	* get aabb
	* 初始化mesh，设置material，计算normal和tangent
	* 进行渲染，输出buffers
*  进行train loop
	* render，得到buffer
	* 计算loss，包括
		* img loss (alpha and color part, separate calculate)
		* reg loss 
			* laplacian regularizer
			* albedo smoothness regularizer
			* visibility regularizer
			* light white balance regularizer
	



### **render.py:**
* interpolate: 用nvdiffrast根据rasterization的结果，将mesh的属性interpolate到each pixel。不可见的像素不会被interpolate到pixel中，但不会被丢掉。
	* interpolate相当于mesh和image之间的桥梁
	* mesh 顶点动了 → attr 插值 → 像素颜色变了 → loss 变了 → 反向传递梯度回来
	* 输入：
		* attr：mesh上每个vertex的attribute \[num_vertices, 属性维度]
		* rast: rasterization output \[batch, height, width, 4] 也就是, baricentric x, y, z, triangle id  --  每个像素在哪个三角形和barycentric
		* rast_db: rasterization derivative buffer -- rast的梯度，主要用于anti aliasing -- 要知道每个像素barycentric坐标相对于屏幕位置的derivative，才能在贴图/采样/shading的时候估算出合适的mip level或做anti-aliasing
		* attr_idx：triangle index，每行是\[v0, v1, v2]， `attr_idx[k] = [i, j, l]`
	* 输出：
		* 每个pixel上的属性值
* shade
	* texture lookup
		* 如果是混合材质(MLP, 或者一张图多通道)，对pos加上一点noise，这样的目的是可以知道原本的位置和加了一点点noise之后的位置变化是否剧烈。针对kd
		* 如果不是混合材质，分开采样，拿kd出来进行jitter然后算差异
		* gb_textc是每个像素对应的uv坐标(\[H, W, 2])，gb_texc_deriv是uv坐标在屏幕坐标上的梯度(\[H, W, 2, 2])
		* uv决定要要拿贴图上的哪个点，uv derivative决定用多模糊的mipmap或者多大直径的filtering
	* 算出最终的normal
	* 根据之前设置的bsdf算对应的shading模式
	* 输出: shaded, kd_grad, occlusion
* render layer
	* 把一个mesh在给定视角，光照材质条件下渲染成一组buffer（如颜色法线等）输出
	1. 处理分辨率缩放（MSAA抗锯齿）（先在高分辨率上rasterize+shading然后再downsample回原分辨率抗alias，spp是采样倍数）
	2. compute
		* position (每个像素对应的世界坐标)
		* geometry normal （几何法线，来自于三角面的cross product)
		* normal, tangent（差值定点的发现和切线，构建shading space)
		* gb_texc / gb_texc_deriv
	3. shading，参考前面的shade看输出什么
	4. 如果有MSAA，酒吧shading buffer缩放回原分辨率
	5. return buffers
* render mesh:
	* 完整渲染成一张图像
	* 从world space -> clip space
	* 用depthPeeler光栅化多个图层
	* 把所有图层做前向alpha混合
	* 输出最终buffer
* render uv
	* 生成材质的uv版本贴图
	1. 先把uv映射到clip space，拼接成4D坐标
	2. 做rasterize
	3. 用uv raster反查world space坐标，就是这个uv上的每个pixel 对应了3D表面的哪个点
	4. sample out textures from MLP
	5. 最后返回kd, ks, normal的uv texture， 还有mask去说有效uv的部分


### **texture.py**
支持： auto mipmap， 可differentiable：dr.texture，支持从图像初始化成训练参数，保存/加载mip贴图
* auto generate 下一层mipmap
	* 支持autograd
	* forward的时候downsampling 2倍，backward的时候upsampling
* texture2D主类，封装一张或多张贴图
	* 先初始化
	* sample method，用dr.texture来采样
	* get resolution / get channels / get mips
	* clamp to customized range
	* normalize mip
* transfer image to differentiable pytorch parameters.
* convert colorspace (srgb -> rgb , rgb -> srgb)
* loading
	* load mip
	* load texture
	* save mip
	* save texture


### **material.py**
* Material class: 打包整理成dict
* load mtl 
	* 提取kd, ks, bump
* save mtl
	* 把当前Material对象保存成mtl
	* 对应texture保存png
* merge materials将多个材质合并成一个大材质


### **mlptexture.py**
基于hashGrid编码+MLP的3Dtexture表示 -> texture的neural network版本
* \_MLP
	* 基础mlp构造，有input dims, output, neurons， 中间hidden layer复制多层
	* 会将gradient input用loss scale 进行缩放（通常放大保留梯度）
	* initiate weight by using kaiming
* MLPTexture3D
	* positional encoding 后创建MLP
	* sample texture at a given location
	* clamp / cleanup
	  


### l**ight.py**
* cubemap_mip class
	* similar to texture2d_mip [[researchStudy/differentiable Render/nvdiffrec/code#^8b6725|code]]
	* when forward, do down sampling by using average pooling
	* when backward, use meshgrid and interpolate texture back
	* 具体的还要再回来理解
* EnvironmentLight class
	* 主要是做split sum：
		* diffuse的话就是用最模糊的mip做积分，然后采样
		* 带specular的话就是分开算因为有fresnel的部分，预积分部分BRDF\*Li， 然后用LUT查另一部分(Fresnel, geometry term)
 $$
\text{reflectance} = \text{specularColor} \cdot F_{\text{approx}} + G_{\text{approx}}
$$
		* 根据roughness选mip，以及build mip
		* regularizer是将base和其灰度进行相减看差异
		
* load environment 
* save environment
* create random trainable environment ： 在没有提供env map的时候，随机初始化一个适中的用于训练，it will be optimized during the training, and gradually become the real environment map



### obj.py
* load object
	* give \_default_mat
	* if there is "mtllib" -> load corresponded ".mtl" file
	* if there is "mtl_override"
	* load
		* vertex -> `v`
		* texcoords -> `vt`
		* normals -> `vn`
	* usemtl是在obj文件中，usemtl这一行之后的所有面(f)都要使用指定名称的材质
* save object
	* write v, vt, vn, f (v/t/n), usemtl defaultMat
	


### renderutils
#### loss.py
* SMAPE: Symmetric Mean Absolute Percentage Error [wiki](https://en.wikipedia.org/wiki/Symmetric_mean_absolute_percentage_error)
	* 避免forecast value too small, and mess the loss
	* so very dark or very bright place can be fairly measured
* RELMSE: probably Relative Mean Squared Error
	* numerator is the squared error (which emphasizes larger differences), and denominator is the sum of squares of both inputs
* L1 loss: Mean Absolute Error
	* `L1 = mean( |A-B| )`
	* 对outlier不敏感，比如L2 （MSE）对outlier敏感因为他会把差平方 `L2 = mean((A-B)^2)`
* loss是整个图的

#### bsdf.py
* helpler functions:
	* dot / reflect / normalize 
	* bend normal : for two-side shading. output normal according to mixing geometry normal and view vector
	* perturb normal : transfer tangent space normal to world space normal
	* bsdf prepare shading normal: process normal, tangent, view vector, shading normal, etc
* calculate simple lambertian diffuse bsdf
* frostbite bsdf
* phong bsdf
* fresnel-schlick bsdf
* normal distribution function bsdf
* geometry /  masking : `bsdf_lambda_ggx` , `bsdf_masking_smith_ggx_correlated`
* Main function: `bsdf_pbr_specular`, which combined Fresnel, NDF, Geometry
* Main entry: `bsdf_pbr` combine everything。最后返回的是某个点在某光源照射下的亮度-raddiance




### regularizer.py
* image gradient
	* 输入的是buffer
	* 优化texture，防止乱跳，过度锐利常用于smoothness loss，比如 `L1(image_grad(kd))`。
* average edge length
	* mesh尺度估计
* laplacian regularizer
	* 几何结构平滑，减少抖动
* normal consistency
	* 保持相邻三角形法线连续，防止折痕




### 

regularizer 是怎么弄的

### 什么是prior先验

在统计学（尤其是贝叶斯统计）中，“先验”（prior）指的是在观察到任何数据之前，对未知量（参数、假设或模型）所持有的主观或客观信念。你可以把它看作是在实验或观测开始之前，我们对待研究对象的初步猜测、已有经验或外部信息的数学化表现。下面从几个角度来具体说明：

---

#### 1. 先验的核心含义

1. **贝叶斯框架下的“先验分布”**

   * 在贝叶斯定理中，我们希望推断某个随机变量（比如参数 θ）在给定数据 𝒟 之后的分布，即后验分布

     $$
       p(θ\mid 𝒟) \;\propto\; p(𝒟\mid θ)\;p(θ).
     $$
   * 其中，$p(θ)$ 就是先验分布（prior distribution）。它在数据出现之前，就对 θ 的可能取值范围和相对权重做出了数学描述。
   * 实际上，先验分布可以源自：

     * **专家知识或领域经验**，比如医生根据多年临床经验对某种病症发病率的初步估计；
     * **历史数据或相关研究**，比如在研究新药疗效时参考过往类似药物的实验结果；
     * **对称或无信息假设**，在真的毫无先验信息时，有时会选择“非信息先验”（uninformative prior）或“平坦先验”，让数据本身去主导推断。

2. **“先验知识”（prior knowledge）在广义上的理解**

   * 除了作为概率分布，先验还可以更宽泛地表示在建模或研究之前，已经掌握的所有背景信息。
   * 比如在图像识别中，我们知道“自然图像像素大多数时候邻近像素值相近”、“常见物体背景与前景通常会有边缘”等等，这些都可视为“先验”，并可以通过正则化、网络设计等方式融入模型。

---

#### 2. 为什么需要先验？

1. **解决样本稀缺或不稳定问题**

   * 当样本量很小或数据噪声很大时，仅靠当前观测（似然函数）往往难以得到稳定且合理的估计。这时引入合理的先验可以“平滑”估计结果，避免过度拟合。
   * 例如，一个小样本下估计概率 $p$ 时，如果完全不加先验（直接用样本频率），极容易出现波动；而用 Beta 分布之类的先验，就能在极端情况下防止估计值跌至 0 或 升至 1。

2. **将外部信息系统化**

   * 在现实问题中，我们往往已经掌握一些与研究对象相关的背景知识。把这些知识数字化地表示为先验分布，就能让模型“知其然”。
   * 例如，如果已有大量研究表明某地人口平均寿命在 70–80 岁之间，那么在新的小样本调查下，用一个集中在 70–80 的先验，就能更快收敛到合理的寿命估计。

3. **体现保守或谨慎原则**

   * 如果我们对结果不确定，就可以选择一个较为宽松、覆盖面广的先验，让后验更多由数据决定；反之，如果非常有信心，就可以用更“尖锐”（narrow）的先验，把模型往熟悉的区域“牵”过去。

---

#### 3. 先验的类型

根据实际应用和信息来源，常见的先验可分为以下几类：

1. **非信息先验（Non-informative Prior） / 弱先验（Weakly Informative Prior）**

   * 当对未知参数几乎没有任何预先认知时，为了让结果“尽量客观地”由数据驱动，可以选取平坦分布（uniform）或广义上的Jeffreys先验等。
   * 例如，对于一个概率参数 $p\in[0,1]$，可以令先验为 $\mathrm{Beta}(1,1)$（即在 \[0,1] 上均匀）；对一个均值 μ，若不知道取值范围，可以令先验为一个方差很大的正态分布 $\mathcal{N}(0,\,10^6)$。

2. **共轭先验（Conjugate Prior）**

   * 共轭先验的特点是：似然函数和先验分布同属一个分布族，使得后验分布也属于同一个分布族，从而计算解析化。
   * 举例：

     * 二项分布的参数 $p$ 的共轭先验是 Beta 分布；后验仍为 Beta。
     * 正态分布已知方差估计均值时，先验取正态分布；后验仍为正态分布。
   * 使用共轭先验的好处是能够快速计算后验，有时还能获得封闭式解。

3. **数据驱动先验（Empirical Prior）**

   * 当已有大量历史数据可以估计先验时，可以先用这些数据拟合一个概率分布，然后再用作新问题的先验。
   * 也称为经验贝叶斯（Empirical Bayes）方法：先对先验分布参数进行估计，再再下游建模。

4. **分层先验（Hierarchical Prior）**

   * 在多层模型或多任务学习场景下，不同子群体之间的参数可以共享一个更高层的“超先验”（hyper-prior），通过层次结构把信息在群体间传递。
   * 例如，若研究多个不同地区的同一种疾病发病率，可以把各地区发病率 $p_i$ 当作一层，用 Beta 作为先验；再给 Beta 分布的参数（比如 α,β）加一个更高层的先验，让模型自动学习不同地区的相似性。

---

#### 4. 具体示例：用“先验”估计二项概率

假设我们想估计某种医疗干预成功的概率 $p$。我们做了 $n$ 次试验，观察到其中 $k$ 次成功。那么似然函数是：

$$
  p(k \mid p) \;=\; \binom{n}{k} p^k (1-p)^{\,n-k}.
$$

如果我们在观察数据之前，对 $p$ 的初步猜测是它大致在 0.3–0.5 之间，可以选一个 Beta 分布：

$$
  p(p) = \mathrm{Beta}(p;\,\alpha=3,\;\beta=4),
$$

其 PDF 形状大致偏向 0.3–0.5。

* **计算后验**
  按贝叶斯定理：

  $$
    p(p \mid k) \;\propto\; p(k \mid p)\,p(p)
           = p^k (1-p)^{n-k} \times p^{\alpha-1} (1-p)^{\beta-1} 
           = p^{\,k + \alpha - 1} (1-p)^{\,n-k + \beta - 1}.
  $$

  所以后验也是 Beta 分布：

  $$
    p(p\mid k) = \mathrm{Beta}\bigl(\alpha + k,\;\beta + n - k\bigr).
  $$

  这样就把我们对干预成功率的“先验知识”（即 α=3,β=4）和观测数据 $k,n$ 结合起来，得到了一个新的“后验可信区间”。

* **当样本极少时先验的效果**
  如果 $n=2$，且 $k=0$（两次都失败），最大似然估计直接得 $ \hat p = 0$，但若加上先验 $\mathrm{Beta}(3,4)$，后验会变成 $\mathrm{Beta}(3+0,\,4+2)\approx\mathrm{Beta}(3,6)$，即估计 $p\approx \frac{3}{3+6}=0.33$ 左右，比直接的 0 要合理得多。先验发挥了“抑制过拟合”的作用。

---

#### 5. 先验在其他领域的应用

1. **机器学习中的正则化**

   * 在很多模型里，加上 $L_2$ 或 $L_1$ 正则，本质上等同于对模型参数设置了高斯或拉普拉斯的先验。例如在线性回归中，最小二乘加上 $L_2$ 正则（Ridge）可看作假设参数服从零均值、方差有限的高斯先验。

2. **深度学习中的预训练/微调**

   * 当我们用预训练模型作为新任务的初始化时，本质上也是对参数施加了一个经验先验：这些参数已经在大规模数据上训练过，代表了我们对权重分布的初始猜测。微调时，就结合了“先验知识”（预训练权重）与“新任务数据”去更新。

3. **图像重建、信号处理**

   * 例如在去噪、超分辨率、CT 断层重建等任务中，常用总变差（Total Variation）、稀疏表示、字典学习等先验，来约束解的平滑性或稀疏性。这种先验往往并不以概率分布形式出现，而是通过额外的正则化项，实现类似“先验偏好”的作用。

---

#### 6. 常见误区与注意

1. **先验并非“随意捏造”**

   * 合理的先验应该基于领域知识、历史数据或较为客观的假设。过度主观或不合适的先验可能会给后验带来严重偏差。
   * 在缺乏任何信息时，常用“非信息先验”或“弱先验”，尽量让数据本身主导。

2. **先验并不总是固定不变**

   * 在分层贝叶斯模型（hierarchical Bayesian）中，先验往往还有“超先验”（hyper-prior），模型会自动根据数据不断调整先验本身的形状。
   * 随着数据积累，有时会重新评估并更新更合理的先验（即从专家经验到经验贝叶斯，再到纯数据驱动）。

3. **对先验的敏感性分析很重要**

   * 在应用中，往往需要测试不同先验对后验结果的影响：如果后验对先验非常敏感，需要警惕样本量不足或模型过度依赖先验。

---

##### 小结

* **“先验”就是在没有看新数据之前，对未知量或参数所持有的“初步信念”或“先验知识”。**
* 在贝叶斯统计中，它以概率分布的形式存在，能与新观测数据的似然相结合，得到更稳健的后验推断。
* 先验可以来源于专家知识、历史数据或无信息假设，在许多实际问题中都有重要作用。

理解并合理地选取先验，是贝叶斯建模的关键步骤之一：它能将已有经验与新数据融合，让推断更贴近实际，也能在样本稀缺时提供有价值的“导向”。


###



###



###



###



###





> uv derivative： 屏幕空间里每进一步（x/y轴），uv空间要进多少
> 用在哪：
> 	mipmap/filtering，可微采样（自动调节采样平滑度），训练anti-aliasing
> 	


> Sample是什么
> 	根据interpolate之后的pixel attairbute去查找贴图/MLP的输出。属于材质查询texture loopup，给uv找材质贴图信息
> 	怎么sample的：
> 		1. bilinear interpolation
> 		2. mipmap/filtering
>  



> regularization:
> 在自由度非常大的优化问题里，**你只有少量 supervision（比如图片），但是你要优化很多参数（geometry、texture、light）**。这时：
> 
> 👉 你就需要用 regularization 约束解空间，否则模型会“学歪”。
> `total_loss = image_loss + λ1 * geometry_reg + λ2 * texture_reg + λ3 * light_reg`



> **split sum:**
> 它把这个积分拆成两部分：
>$$
\text{Specular} = \underbrace{\int L_i \cdot DFG(\omega_i, \omega_o, roughness)}_{\text{pre-filtered environment map}} \cdot \underbrace{F(\omega_o, \mathbf{h})}_{\text{lookup texture}}
$$
>* 第一步：**预过滤环境贴图**，根据不同 roughness 生成 mipmap → 称为 **Split Sum 的第一部分**
>* 第二步：用一个 2D lookup 表（FG LUT）去查 Fresnel 和 Geometry 项 → 第二部分
>让不同粗糙度的表面用不同模糊程度的环境贴图层，通过 `torch.where`分段映射，达到 roughness → mip index 的合理控制。是典型的 split-sum 环境光的核心逻辑。




> **到底什么是nn.Parameter:** 
> 	有weight和bias的例子：
> 		`self.linear = torch.nn.Linear(10,1)`
> 		这个是有`self.linear.weight`的
> 	优化数据本身的（没有weight和bias）：
> 		`self.base = torch.nn.Parameter(torch.rand(6, 128, 128, 3))`
> 		这里的每个随机数的本身就是参数
> 



了**让不同粗糙度的表面用不同模糊程度的环境贴图层**，通过 `torch.where` 分段映射，达到 roughness → mip index 的合理控制。是典型的 split-sum 环境光的核心逻辑。













