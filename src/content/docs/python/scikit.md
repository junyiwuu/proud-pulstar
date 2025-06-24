---
title: Scikit
---
## Linear regression

|                     |                                            |                  |
| :------------------ | :----------------------------------------- | ---------------- |
| create model        | `linreg = linear_model.LinearRegression()` |                  |
| fit data into model | `linreg.fit(x_train, y_train)`             |                  |
| predict             | `predicted = linreg.predict(x_test)`       |                  |
| calculate score     | `score = linreg.score(x_test, y_test)`     | linreg是已经训练好的模型， |

R²分数的计算公式是：
`R² = 1 - SS_res / SS_tot`
其中：
- SS_res 是残差平方和：Σ(y_真实 - y_预测)²
- SS_tot 是总平方和：Σ(y_真实 - y_平均)²

---

## KNN

| numpy操作                   |                                 |     |
| :------------------------ | :------------------------------ | --- |
| 将任意维度的数组展平成一堆数组           | `xx.ravel()`                    |     |
| column-wise concatenation | `np.c_[xx.ravel(), yy.ravel()]` |     |
|                           |                                 |     |

```python
knn = KNeighborsClassifier()
knn.fit(x, y)
Z = knn.predict(np.c_[xx.ravel(),yy.ravel()])
Z = Z.reshape(xx.shape)

plt.figure()
plt.pcolormesh(xx, yy, Z, cmap = cmap_light, shading="auto")
plt.show()
```

---
## SVM

`from sklearn import svm`



|                                       |                                                                | notes                                                                                         |
| :------------------------------------ | :------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| svc                                   | `svc = svm.SVC(kernel='linear'.fit(x,y)`                       | [what kernel can use](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html) |
|                                       | kernel: `linear`, `poly` , `sigmoid` , `rbf` , (`precomputed`) |                                                                                               |
| poly通过改变degree来改变复杂度                  | `svc = svm.SVC(kernel="poly", C=1.0, degree=2).fit(x,y)`       |                                                                                               |
| rbf， gamma控制decision boundary的复杂度和灵活度 | `svc = svm.SVC(kernel="rbf", C=1.0, gamma=2).fit(x,y)`         |                                                                                               |
|                                       |                                                                |                                                                                               |

- **linear**: 线性核，适用于线性可分的数据，核函数为 K(x, y) = x·y
- **poly**: 多项式核，可以处理非线性数据，核函数为 K(x, y) = (γx·y + r)^degree，其中 degree 是多项式的次数
- **rbf**: 径向基函数核，也是最常用的核函数之一，适用于大多数类型的数据，尤其是非线性数据。核函数为 K(x, y) = exp(-γ||x-y||²)
- **sigmoid**: Sigmoid核，来源于神经网络，核函数为 K(x, y) = tanh(γx·y + r)
- **precomputed**: 当你已经计算好了核矩阵，可以直接使用此选项


---

## Others
#### 快速查看数据
```
# 加载数据集
diabetes = datasets.load_diabetes()

# 直接转换成DataFrame
diabetes_df = pd.DataFrame(data=diabetes.data, columns=diabetes.feature_names)

# 添加目标变量
diabetes_df['target'] = diabetes.target

# 显示前5行
print(diabetes_df.head())
# 显示随机的6行
print(diabetes_df.sample(6))
```


#### Normalization
normalization是怎么做到的，对于每个feature的列，计算该列的mean和std，然后对于每个数据，执行`(x - mean) / std`


