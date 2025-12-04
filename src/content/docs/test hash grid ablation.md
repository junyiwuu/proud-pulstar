---
title: test hash grid ablation
---


change num levels from 16 -> 8  : relmse-25_08_11-10_59  / numLevels_8
change num level to 4: relmse-25_08_11-12_28  / numLevels_4
change num level to 2:  relmse-25_08_11-12_36  / numLevels_2

ALSO change hidden from 2 to 1 (both kd and ks) : relmse-25_08_11-11_19
(it doesnt speed up too much)

change back the hidden to 2


change the desired resolution from 4096 to 2048:  relmse-25_08_11-11_28
(not help at all, and the details lost (frame 27))


change back to 4096, change nfeatures_per_level from 2 to 1 : relmse-25_08_11-12_14



separate ks, they all run under hash grid num level 2
relmse-25_08_13-13_59:  default disable occlusion, dmtet
relmse-25_08_13-14_19: laplace scale 3000, dmtet
relmse-25_08_13-14_24: keep laplace scale 3000,  flexicube
relmse-25_08_13-14_41: show interval 20, save interval 100

enable occlusion
need to change hash grid 



relmse-25_08_15-15_20: both internal dims is 8, hidden=2
relmse-25_08_15-15_37: both internal dims is 8 , hidden=1

relmse-25_08_15-15_48: both internal dims is 4, hidden=2
relmse-25_08_15-16_02: both internal dims is 4, hidden=1

relmse-25_08_15-16_13: both internal dims is 2, hidden=2
relmse-25_08_15-16_32: both internal dims is 2, hidden=1

relmse-25_08_15-16_42: both internal dims is 16, hidden=2
relmse-25_08_15-17_13: both internal dims is 16, hidden=1

relmse-25_08_15-17_28: both internal dims is 32, hidden=1
relmse-25_08_15-17_38: both internal dims is 32, hidden=2


relmse-25_08_16-11_33: kd width 32, ks width 16, hidden=2
relmse-25_08_16-11_56: both internal dims is 64, hidden=2
relmse-25_08_16-12_21: both internal dims is 64, hidden=1


Spot_1

relmse-25_08_16-14_25: full mse, occlusion off
relmse-25_08_16-14_36: full logl1, occlusion off
relmse-25_08_16-14_47: full logl1, occlusion on

relmse-25_08_16-15_02: both relmese+mse, occlusion on
relmse-25_08_16-15_17: both logl1+smape, occlusion on 
relmse-25_08_16-15_27: both logl1+smape, occlusion off
relmse-25_08_16-15_39: kd: logl1+smape, ks:relmese+mse, occlusion on 
relmse-25_08_16-15_52: kd: logl1+smape, ks:relmese+mse, occlusion off










