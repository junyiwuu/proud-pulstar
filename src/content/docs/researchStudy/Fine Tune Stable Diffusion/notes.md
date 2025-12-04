---
title: notes
description: notes that not a full topic
---
## batch/epoch/iter

#### Batch:
One batch means a group of samples processed together in one forward/backward pass. If Batch size = 100 means this batch contains 100 images.


#### Epoch:
One epoch means a full pass through your entire training dataset
* if you have 1000 training images and batch size is 10, then batches per epoch = 100 
#### iter:
One iteration is one update of the model's weight. so it is also called "step"

**iterations per epoch** = total training samples / batch size
**total iterations** = epochs * ibatchsize

**Iteration (or “step”)**
One **iteration** is one weight update—that is:
1. take one batch of size `B`,
2. do a forward pass,
3. compute the loss,
4. do a backward pass,
5. update the weights.




