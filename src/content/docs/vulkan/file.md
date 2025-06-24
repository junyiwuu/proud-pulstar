---
title: File relative
description: how to read file, how to handle file
---


## **How to read the file**

* `std::ifstream` input stream, for reading files
* `file()` file function, ( filepath ,bit flags(open mode))
* `std::ios::ate` at the end, this mean once the file open we seek the end immediately
* `std::ios::binary` open the file in binary mode, raw stream of bytes, avoid any unwanted text transformations
* `std::ios::ate | std::ios::binary` we want both gpointer o to end the file (so can use tellg()) , and read as binary

  

why {} instead of ():

1. uniform initialization. so we tell this is object definition, not function declaration.

2. strict type checking, prevent implicit type conversion

  
  

**Open file error check**

```cpp
if (!file.is_open()){
	throw std::runtime_error("fail to open file: " + filepath)
	//filepath is incorrect or no permission to open the file
	}
```

  

**File size**

***the last of file***

file.tellg() return `std::streampos`data, means the pointer's location in the file

```cpp

size_t filesize = static_cast<size_t>(file.tellg());

```

> other example:

 ```cpp
double value = 3.14;
int intValue = static_cast<int>(value); // transfer to >integer
std::cout << intValue; // output: 3
```

***the first of the file***

```cpp
file.seekg(0); //move the pointer to the beginning
```

**Create buffer**

  

file.read(buffer.data(), fileSize);

file.close();

return buffer;
