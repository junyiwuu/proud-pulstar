---
title: temp2
---



Debugging an ML model is very different from debugging normal software — because **the code may be “correct”… but the _learning_ is wrong**.

So the mindset is:

> **Don’t just suspect the code — suspect the data, the optimization dynamics, and the evaluation setup.**

A good ML debugging process is layered — you eliminate potential failure sources one by one.

---

### ✅ Step-by-step ML debugging checklist

 #### **1. Sanity checks before training**

- ✅ Train on a _tiny subset (like 10 samples)_ — model should **overfit to 0 loss**  
    → If not? data preprocessing / model architecture is wrong
    
- ✅ Manually check a few training samples + labels — are they correct?
    
- ✅ Check input normalization (mean/std, shape, dtype, ranges)
    

---

#### **2. During training**

- ✅ Plot loss curves — does `train loss ↓` but `val loss ↑`? → Overfitting
    
- ✅ Loss goes to NaN / exploding? → learning rate too high / bad init
    
- ✅ Loss not decreasing at all? → LR too low / wrong labels / optimizer bug
    

---

#### **3. Evaluate per-class / per-sample**

- ✅ Compute accuracy _per class_ → is one class terrible? → data imbalance
    
- ✅ Look at **specific wrong predictions**, not just metrics → see _why_ it's failing
    
- ✅ If text/image input → **visualize inputs + model outputs**
    

---

#### **4. Data & distribution checks**

- ✅ Is val/test from **same distribution** as train?
    
- ✅ Shuffle leakage? (time series and video CANNOT be randomly shuffled)
    
- ✅ Check **train vs val accuracy gap**:
    
    - train ≪ val → underfitting
        
    - train ≫ val → overfitting
        
    - both bad → data or architecture problem
        

---

#### **5. Try controlled ablations**

- ✅ Smaller model / bigger model? do results change?
    
- ✅ Remove augmentation → model suddenly good? → augmentation too extreme
    
- ✅ Change LR / batch size — does training behavior change?
    

---

### ✅ In summary — good ML debugging thought process

```
(1) Is the data clean? → visualize → confirm labels are correct
(2) Does the model *even learn*? → overfit tiny batch test
(3) Is training stable? → loss curve smooth? any NaN?
(4) Does val performance make sense? → distribution / leakage issues?
(5) Drill down into specific wrong cases, not just metrics
```

---

Would you like next:

- ✅ a **checklist template** you can literally follow every time?
    
- ✅ **real examples** of debugging vision / NLP / time series models?
    
- ✅ or a **flowchart** of ML failure diagnosis?
    

I can go deeper depending on what kind of model you care about.








Absolutely — expanding **K** (the intrinsic camera matrix) is a very common follow-up interview question.

---
Great question — two spheres (usually) intersect in a **circle**. Here’s the clean, interview-ready method.

# Setup

Let the spheres be  
[  
|x-\mathbf{c}_1|^2=r_1^2,\qquad |x-\mathbf{c}_2|^2=r_2^2  
]  
with centers (\mathbf{c}_1,\mathbf{c}_2\in\mathbb{R}^3) and radii (r_1,r_2>0).  
Let (\mathbf{d}=\mathbf{c}_2-\mathbf{c}_1), (d=|\mathbf{d}|), and the unit direction (\mathbf{n}=\mathbf{d}/d) (when (d>0)).

# Quick intersection test (cases)

- **No intersection (separate):** (d>r_1+r_2)
    
- **No intersection (one inside the other):** (d<|r_1-r_2|)
    
- **Tangent (one point):** (d=r_1+r_2) (external) or (d=|r_1-r_2|) (internal)
    
- **Identical spheres:** (d=0) and (r_1=r_2) → infinitely many (the spheres coincide)
    
- **Otherwise:** intersection is a **circle**
    

# Circle of intersection (when it exists)

1. Distance from (\mathbf{c}_1) to the circle’s center along the line of centers:  
    [  
    a=\frac{r_1^2 - r_2^2 + d^2}{2d}  
    ]
    
2. Circle center (in 3D):  
    [  
    \mathbf{p}=\mathbf{c}_1 + a,\mathbf{n}  
    ]
    
3. Circle radius:  
    [  
    \rho=\sqrt{r_1^2 - a^2}\quad (\rho\ge 0)  
    ]
    
4. Circle’s plane:
    

- Normal: (\mathbf{n})
    
- Equation: ((x-\mathbf{p})\cdot \mathbf{n}=0)
    

# Parametric form of the circle

Choose any unit vectors (\mathbf{u},\mathbf{v}) that are orthonormal and perpendicular to (\mathbf{n}) (e.g., build (\mathbf{u}\propto \mathbf{n}\times\text{arbitrary}), then (\mathbf{v}=\mathbf{n}\times\mathbf{u})).  
Then every intersection point is  
[  
\boxed{;\mathbf{x}(\theta)=\mathbf{p}+\rho\big(\cos\theta,\mathbf{u}+\sin\theta,\mathbf{v}\big),\quad \theta\in[0,2\pi);}  
]

# Tiny numeric example

Centers (\mathbf{c}_1=(0,0,0)), (\mathbf{c}_2=(4,0,0)), radii (r_1=3), (r_2=3).

- (d=4), (\mathbf{n}=(1,0,0))
    
- (a=(3^2-3^2+4^2)/(2\cdot4)=2)
    
- (\mathbf{p}=(2,0,0))
    
- (\rho=\sqrt{3^2-2^2}=\sqrt{5})
    
- Plane: (x=2)
    
- Circle: centered at ((2,0,0)) radius (\sqrt{5}) in the (y!-!z) plane.
    

# Edge/tolerance notes

- If numerical work gives a tiny negative under the square-root (e.g., (-1e{-12})) from floating-point error, clamp to zero → tangent case.
    
- When (d=0) but (r_1\ne r_2), there is no intersection.
    

If you want, I can turn this into a quick code snippet you can drop into an interview (Python or pseudocode).


---


