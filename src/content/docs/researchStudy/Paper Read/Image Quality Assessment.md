---
title: "READ: Image Quality Assessment from Error Visibility to Structureal SImilarity"
---
 Objective image quality metrics:
 whether you have original image, and wich some distorted image to be compared
 * Full-reference (complete reference image is assumend to be known)
 *  No-reference (blind quality assement approach)
 *  Reduced-reference (Partially available)


Full-reference quality metric: 
* MSE (mean squared error)
* PSNR: Peak signal-to-noise ratio
But they are not very well matched to perceived visual quality
* HVS (human visual system) (modify the MSE measure so that errors are penalized in accordance with their visibility) (error-sensitivity approach) (extracting structurla information) 

widely adopted assumption: the loss of perceptual quality is directly related to the visibility of the error signal (MSE: objectively quantifies the strength of the error signal)
issue: two different images with same MSE have different types of errors, some may more visible than others



### Framework
Image quality assessment 

1. the distorted and reference signals are properly scaled and aligned
2. signal might be transformed into a color space, which is appropriate for HVS
3. QA may need to convert digital pixels values stored in memory into luminance values of pixels on the display device through pointwise nonlinear transofmrations
4.  a low-pass filter simulating the point spread function of they eye optics may be applied
5. reference and distored images  maybe modified using a nonlinear point operation to simulate light adpation

CSF filtering (contrast sensitivity function: the sensitivity og the HVS to different spatial and temporal frequencies that are present in the visual stimulus

Channel Decomposition: image sperated into channels, selective for spatial, temporal frequency , orientation
* neural responses in the primary visual cortex
* simpler transforms such as the DCT(discrete cosine transform), or separable wavelet transforms

Error Normalization:
 JND(just noticeable difference): minimum change in a stimulus that can be detected by a human observer. The smallest difference in a sensory input that a person can reliably perceive




Definition of image quality? is a fundamental problem (as some distortions may be clearly visible but not so objectionable
some study suggested that the correlation between image fidelity and the image quality is only moderate


### Main
Natural image signals are highly structured, their pixels exhibit strong dependecies.
The Minkowski error metric is based on pointwise signal differences, which are independent of the underlying signal structure