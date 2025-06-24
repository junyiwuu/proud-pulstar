---
title: Python Notes Collection
description: python notes collection, target on completing all homework smoothly
---
## Common python things

### def Format
```python
def ceaserCipherDecription(usr: str , shift: int )  :
```


###  format
```python
print( '{:s} {:s} {:d}'.format(hello, world, 2018))  # prints “hello world 2018”
```

## Resources
[Python for Data Analysis](https://wesmckinney.com/book/)


## Numpy
`import numpy as np`

`np.array`
`.shape`
`.size` the total number of elements
`.dtype`

`.arage(10)` `np.arange(10,20)` `np.arange(1,10,2)` generate numbers
`.linspace(10,20,5)` linspace (start, stop, n-points)
`.zeros((3,3))`
`.ones((3,3))`
`.diag((3,5,4)))` diagonal matrix

**Randomness**
`np.random.rand(2,4)` the matrix shape is (2,4) (rows, columns)
`np.random.standard_normal((2,4))` randomness from standard normal distribution, default setup : mean=0, stdev=1
`np.random.randint(low=1, high=100, size=10)`
`np.random.normal(0,1,100)` mean, standard deviation, count
`np.random.randn(10000)` generate 10000 random numbers from standard normal distribution

**File**
`.genfromtxt("xxx.txt", delimiter=",")` read from, and input data is separated by commas

`np.save("output", data)` will generate output.npy
> npy format is a file format specially created for NumPy to save and load numerical arrays

`np.load("output.npy")`
`np.savetxt("output.csv", data, delimiter="," , fmt='%.5f' )` padding .00000 (five zeros) at the end of numbers, eg. 1.00000

`data2=data` not real copy, just reference

`np.savez("output", data=data, data2=data2)`
>npy only save one array, npz save multiple numpy arrays in a single file
```python
np.savez('multiple_arrays.npz', 
         first=array1,    # You give each array a name
         second=array2,   # These names are like keys
         third=array3)    # You'll use them to load specific arrays
```

`read_data["data2"]` accessing the specific array you want

---
```python
x = np.array([1,2,3,4,5],[2,0,3,1,2])

x.min()
x.max()
x.sum()
x.prod()
x.mean()
x.var()

x.min(axis=0)  #return minimum value in each column
x.min(axis=1)  #return minimum value in each row
#axis = which returns
x.sun(axis=0)  #return in row
```

`np.array(x).reshape(_ , _)` reshape into _x_ matrix
`M.reshape(0)` into one dimensional array
already one dimension, cannot turn to one dimension again

`np.newaxis` adds one more axis
```python
v = v[np.newaxis , :]  # add one more rows
v = v[: , np.newaxis]  # add one more column

None == np.newaxis  #np.newaixs equivalent to None
```


`np.vstack( (M1, M2) )` vertical stack, so number of columns between matrices should be equal
`np.hstack( (M1, M2) )` horizontal stack, rows number should match

---
**Tile** replicates the ==matrix== as a whole
**Repeat** repeats ==elements== within the matrix

`np.title(M,3)` repeat M horizontally 3 times
`np.title(M,(4,2))` repeat M horizontally 2 times, vertically 4 times (2 times on col axis,  4 times on row axis)

M---> `[ [1,2] , [3,4] ]`
`np.repeat(M, 4)` repeat each elements in M 4 times (one by one)
`np.repeat(M, 4, axis=0)` repeat along row axis (extend rows)
---> 
```
[[1 2]
 [1 2]
 [1 2] 
 [1 2] 
 [3 4] 
 [3 4] 
 [3 4] 
 [3 4]]
```
`np.repeat(M, 4, axis=1)` repeat along col axis (extend cols)
--->
```
[[1 1 1 1 2 2 2 2] 
 [3 3 3 3 4 4 4 4]]
```


**BY Default, arrays in python are handled by reference**
B=A is reference, if change anything in B, will also change A
**Real copy --> copy()**
`B = A.copy()`



```python
A = np.array([1,2,3])
B = np.array([2,2,2])
	D = np.dot(A, B.T)    # need to use .T to make them able to multiply
```

transpose: `M.P`

---
**Determinant**
* If det(M) = 0: M is singular (non-invertible)
* If det(M) != 0: M is non-singular (invertible) 
* If det(M ) = 1: special case
`np.linalg.det(M)`

**Invert matrix**
`inv_M = np.linalg.inv(M)`

**Recover identity matrix**
`np.dot(M, inv_M)`




## Matplotlib
`import matplotlib.pyplot as plt`

* python library for generating 2D and 3D plots
* can be used to draw graphs, bar charts, scatter plots, contour and surface plots etc
* formats: png, pdf, svg etc
* Don't forget Seaborn library


`plt.plot(x , y , "b", label='xxx')` plt.plot(data1, data2, color)
`plt.show()` show the plot, combine show all plot before
`plt.legend()` show labels
* `plt.legend(loc='upper left')` put legend on the upper left area of the plot
* upper left, upper right,  lower left, lower right
* right, best
* center, center left, center right, lower center, upper center

**color code**
```
'b'       blue
'g'       green
'r'       red
'c'       cyan  
'm'       magenta
'y'       yellow
'k'       black  
'w'       white
```

`plt.plot(x , y , color='blue' , linewidth=2.0 , linestyle='-')`
`linestyle = '-'` `linestyle = '--'` `linestyle = '-.'` `linestyle = ':'
or solid, dashed, dashdot, dotted
`plt.plot(x, y, 'r--')`
`plt.plot(x, y, 'g*-')`  g-. 



`plt.xlim(-5,5)` set bounds of the x-axis -5 to 5
`plt.ylim(-5,5)` set bounds of the y-axis -5 to 5

`plt.xlabel("xxx")` set x-axis label
`plt.ylabel("xxx")` set y-axis label
`plt.title("xxx")` set title of the plot


tick marks 刻度标记
set up tick marks on the plot
`plt.xticks( np.linspace(-np.pi, np.pi, 5) )` from -3.14 to 3.14, 5 intervals marks on x-axis


`plt.subplot(2, 1, 2)` plt.subplot( number of rows in the grid, number of columns in the grid, index of current subplot(counting from 1, left to right, top to bottom))
`plt.subplot(rows, cols, index)`
```python
plt.subplot(2, 1, 1) # generate one blank plot
plt.plot(x, y)       #fill in the plot that just generated
```

**Subplot Layout manager**
`fig, axes = plt.subplots(nrows=2, ncols=3)`


```python
fig, axes = plt.subplots(nrows=2, ncols=3)
for ax in axes.reshape(-1):  # flatten out
	ax.plot(x, y, "r")
	ax.set_ylabel("y axis")
	ax.set_xlabel("x axis")

fig.tight_layout()
```
`fig.tight_layout()`: make the plots more proper layout

**Adding text**
`plt.text(1, 3, "this is text", fontsize=16)` (loc.x , loc.y , text , fontsize)

**Fig Size**
`fig, axes = plt.subplots( figsize=(8,2) , dpi=100 )`
`figsize=(width, height)`
`dpi` dots per inch. 
* 72: standard web resolution
* 100: basic display
 * 300: print quality
---
### Pie Chart
```python
labels = "a", "b", "c"  #name, position match percentage
data = [10,30,60]       #percentage
explode = (0, 0.1, 0)   #this pie go out a bit
plt.pie(data, explode = explode, labels = labels, autopct='%1.1f%%', startangle=90)
# 
```
`autopct=` : 
>`%` indicates this is a format specifier
>`1` represents the minimum width of the number
>`.3` show 3 decimal places
>`f` indicates its a floating point number
>`%%` print a literal % symbol

`startangle=` : rotate the pie chart

---
### Scatter Plot
`plt.scatter(x, y)`


---
### Bar Plot
```python
labels = ['G1', 'G2', 'G3', 'G4', 'G5'] # define five groups
men_means = [20, 34, 30, 35, 27]    # each group corresponds to a value
women_means = [25, 37, 34, 27, 25]  # each group corresponds to a value

x = np.arange(len(labels)) # the location of the label  

width = 0.25 # the width of the bars
rects1 = plt.bar(x - width/2, men_means, width,label='Men')
rects2 = plt.bar(x + width/2, women_means, width,label='Women')

plt.legend()  # show label
plt.show()
```


---
### Histograms
`plt.hist(x, bins=100)`  100 bins

---
### Save to file
`fig.savefig("output.jpg")`
`fig.savefig("output.pdf", dpi=200)`

---

### 3D figure
`from mpl_toolkits.mplot3d.axes3d import Axes3D`
```python
fig = plt.figure(figsize=(8,4))

# prepare 3D data
axis=np.linspace(-5,5,100)
(X,Y) = np.meshgrid(axis,axis)    # outputs matrices X and Y storing grid of pixel coordinates
Z = np.cos(X) + np.sin(Y)        # perform some operation on the coordinate values

ax1 = fig.add_subplot(1,2,1, projection='3d') # generate an Axes3D
im = ax1.plot_surface(X,Y,Z, cmap=plt.cm.gray) 
ax2 = fig.add_subplot(1,2,2, projection='3d') # generate an Axes3D
im = ax2.plot_wireframe(X,Y,Z, rstride=10, cstride=10)
```


---
## Pandas
`import pandas as pd`

`pd.Series( [1, "abc", 3.14, -1000, "morning!"] )` 

```python
pd.Series( [1, "abc", 3.14, -1000, "morning!"] ,
	index= ["A", "C", "D", "E", "K"])
```

**Creating series from a dictionary**
```python
dic = {"A":22 , "B":99 , 100:"C"}
S = pd.Series(dic)
```

**select**
`S["A"]`
`S[["A"]]` additional information

`S[S<20]` by default find index value, show value under 20 rows
`print("A" in S)` check if an item in the series
`ser 3  = ser1 + ser2` union two series

`S.notnull()` not null value return True
`S.isnull()`  null value return True

`print(S[ S.isnull() ]` print all elements that is null values

---
### DataFrames

```python
# data is a dictionary with four keys, and a list corresponding to each key

data = {'year': [2010, 2011, 2012, 2011, 2012, 2010, 2011, 2012],
        'team': ['Bears', 'Bears', 'Bears', 'Packers', 'Packers', 'Lions', 'Lions', 'Lions'],
        'wins': [11, 8, 10, 15, 11, 6, 10, 4],
        'losses': [5, 8, 6, 1, 5, 10, 6, 12]}


football = pd.DataFrame(data, columns=['year', 'team', 'wins', 'losses']) # keys are passed as parameters
```

`pd.DataFrame(data, columns=data.keys())`
`pd.DataFrame(data)`
`del football` delete the dataframe

---
### I/O CSV files
* Import : `df = pd.read_csv("file.csv")` 
	* `pd.read_csv("file.csv", index_col=0)` 
	* `pd.read_csv("file.csv", names=["others1","others2"])`  give the headder
* Export: `df.to_csv("output.csv")`
	* save specific column: `df["column_name"].to_csv("output.csv")`
	* save without headers `df.to_csv("output.csv", header=False)`

`df.columns = [ "others1" , "others2" , "new_name" ]` change columns name


---

### I/O Excel files
need openpyxl module `pip install openpyxl`

`df.to_excel("output.xlsx", index=False` index false to avoid writing header information

`df = pd.read_excel("file.xlsx")` default name is Sheet1
`df = pd.read_excel("file.xlsx", "Sheet1")` 

**Multiple sheet Excel file**
`xlsFile = pd.ExcelFile('multi_sheets.xlsx')` read
`df_1 = pd.read_excel(xlsFile, "Sheet1")` read sheet1, default is sheet1

```python
with pd.ExcelFile('multi_sheets.xlsx') as xls:
    df_3 = pd.read_excel(xls, 'Sheet1')
    df_4 = pd.read_excel(xls, 'Sheet2')
```

```python
data = {}      # an empty dictionary

with pd.ExcelFile('multi_sheets.xlsx') as xls:
    data['Sheet1'] = pd.read_excel(xls, 'Sheet1', index_col=None, na_values=['NA'])
    data['Sheet2'] = pd.read_excel(xls, 'Sheet2', index_col=0)
```





---
## Scikit
`pip install scikit-learn`
`import sklearn`














---



---
## Scikit



```python
from sklearn import datasets
iris = datasets.load_iris()

print(dir(iris))     # use these to get more information
print(type(iris))
print(help(iris))
```

for example when executing`print(dir(iris))` we can see  `['DESCR', 'data', 'data_module', 'feature_names', 'filename', 'frame', 'target', 'target_names']`
These are variables

`iris.data[: ,0]` select all rows but first column



---

## pyAgrum
`import pyAgrum as gum`
`import pyAgrum.lib.notebook as gnb`


logic: 
1. initialize an empty bayes network
2. add label --> (variable name, description, number of status)
	* number of status: pos / neg (2 status)
3. add arc 连接两个节点的箭头，表示其依赖关系。箭头方向表示影响方向
4. set up prio P
5. set conditional possibility


code: 
1. `bn = gum.BayesNet("pregenTest")` initialize
2. `bn.add(gum.LabelizedVariable("pregnant", "is this woman pregnant?" , 2))` `bn.add(gum.LabelizedVariable("test" , "result of test" , 2))` 
	add label
	> `Rain = bn.add(gum.LabelizedVariable('Rain', 'Rain', ["No", "Yes"]))`
	> 这种属于显式定义取值标签
	> `Sprinkler = bn.add(gum.LabelizedVariable('Sprinkler', 'Sprinkler', 2))`
	> 这里属于隐式，2表示变量是binary variable, pyAgrum默认标记为0和1
3. `bn.addArc("pregnant", "test")` add arc
4. `bn.cpt("pregnant").fillWith([0.8, 0.2])` set prio
5. `bn.cpt("test")[{"pregnant": 0}] = [0.98, 0.02]` `bn.cpt("test")[{"pregnant": 1}] = [0.01, 0.99]` 
		set conditional probability
6. `gnb.showInference(bn, evs={"test" :1})` 设置evidence以及显示结果








## OS
`import os`



| command                      | description                                   |
| ---------------------------- | --------------------------------------------- |
| `os.path.join(str1, str2)`   | join two path                                 |
| `os.makedirs(path)`          | make a new folder (on this path). return None |
| `files = os.listdir(folder)` | get all files in one folder                   |
|                              |                                               |




