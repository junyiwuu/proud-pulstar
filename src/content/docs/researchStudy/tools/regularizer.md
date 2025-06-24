---
title: Regularization
---
1. **Total Variation (TV) Regularization**    
    - A classic smoothness prior that penalizes the sum of absolute image gradients, encouraging piece-wise constant regions.
    - Wikipedia: [https://en.wikipedia.org/wiki/Total_variation_denoising](https://en.wikipedia.org/wiki/Total_variation_denoising)
    - Original paper: Rudin, Osher & Fatemi (1992), “Nonlinear total variation based noise removal algorithms.”
        
2. **Edge-Aware Total Variation Regularization**
    - A variant of TV that weights the gradient penalty by an edge strength term, so that true geometric or color edges are preserved while suppressing noise elsewhere.   
    - Example method: “Weighted TV” or “Anisotropic TV” with per-pixel weights derived from guide images. 
    - Tutorial/discussion: [https://dsp.stackexchange.com/questions/12227/what-is-edge-aware-total-variation-smoothing](https://dsp.stackexchange.com/questions/12227/what-is-edge-aware-total-variation-smoothing)

3. **Laplacian (Mesh) Regularization**
    - Penalizes the discrete Laplace operator on either vertex positions (geometry) or texture values, encouraging each value to be close to the average of its neighbors.
    - Wikipedia: [https://en.wikipedia.org/wiki/Laplacian_smoothing](https://en.wikipedia.org/wiki/Laplacian_smoothing)
    - Often called “Laplacian smoothing” or “umbrella operator” in geometry processing.
        
4. **Visibility / Occlusion Regularization**
    - A data-driven term that penalizes textures in regions rarely seen or always occluded, to avoid fitting noise in those unseen areas.
    - Not a standard name, but generally just an “Occlusion-based Smoothness” term.