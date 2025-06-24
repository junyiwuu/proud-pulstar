---
title: Compile cpp file
description: how to compile c++ file
layout: ../../layout/mainPageLayout.astro
---


## when conflict happen

like cmakecache doesnt match: remove *build* file , start again
`rm -rf build`

  

**add_executable how to include all c++ file**:

1. `file(GLOB SOURCES "*.cpp")` searching for current folder, adding all c++ file into SOURCES variable and then `add_executable(vulkanTest ${SOURCES})`. Therefore collect all c++ under current directory
but if add more c++ files later, need to cmake again
2. manually add all c++ files name here





## extra: Fast simple compile cpp

in this case can use g++
`g++ test.cpp -o test && ./test`
* `-o test` :specify the output executable name is test
* `&&` and
* `./test` run the compiled file


**Simple Start**
```cpp
#include <iostream>
using namespace std;
int main() {

	cout << "Hello, World!" << endl;
	return 0;
}
```

**Multiple entry**
```cpp
void entry1(){
	std::cout<<"entry point"<<std::endl;
}

int main() {
	entry1();
	return 0;
}
```