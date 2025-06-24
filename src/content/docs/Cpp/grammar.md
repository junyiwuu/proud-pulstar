---
title: C++ study notes collection
description: Here only  collect something that I atm feel I want to knowledge backup
---
## Static
```cpp
// Example 1: Normal function
int getNumber() {
    int count = 0; 
    return count++;  // count always starts at 0
}

// Example 2: Static variable in function
int getNumber() {
    static int count = 0;  // Only initialized once
    return count++;  // count remembers its value between calls
}

int main() {
    cout << getNumber(); // prints 0
    cout << getNumber(); // prints 1
    cout << getNumber(); // prints 2
}
```



understand below:
```cpp
static LveGameObject createGameObject()
```
* `static`: can be called without an instance
* `LveGameObject`: data type
* `createGameObject()` : function name



## Template
`<  > ` are used for templates. and template can actually accept multiple template parameters, not just one.

For example: 
```cpp
std::pair<int, std::string> person(42, "John");
```

### example: `std::pair`
```cpp
int main() {
	std::pair<int , std::string>person(22, "kk");
	std::cout<<person.second<<std::endl;
	return 0;
	}
```
output: `kk`

'


## Class
```cpp
class AA{
	public:
	struct A_struct{
		int xx = 10;
		int yy = 20;
	}
	float member1{0.f};
	float member2{1.f};
}
```

when instance AA , for example `AA AA_object{}` , It initialize, but nothing to do with struct, only initialize members


If auto-initialize the struct, the class would have a struct-initialize-member inside
```cpp
class AA{
	public:
	struct A_struct{
		int xx = 10;
		int yy = 20;
	}
	float member1{0.f};
	float member2{1.f};
	A_struct BB{};   //after adding this, when instance, struct will be initialized
}
```


---

## Unordered Map

```cpp
#include <unordered_map> std::unordered_map<string, int> scores;  // Key type is string, value type is int 

scores["Alice"] = 100; 
scores["Bob"] = 95; 
scores["Charlie"] = 88;`
```
Unordered_map is a container that stores key-value pairs
* It uses hash table internally
* Elements are not stored in any particular order
* O(1) compared to `map` which is O(log n)
* But use more memory than `map` due to hash table structure
* needs to handle collision


---
## Preprocessor
The preprocessor is a tool that runs before your source code is compiled. Its main functions include:
- **Processing Directives:** It handles instructions that start with `#`, such as `#include`, `#define`, and `#ifdef`.
	-These directives tell the preprocessor to include other files, define macros, or conditionally compile parts of your code.
- **Macro Expansion:** It replaces macros with their defined values or code snippets.
- **File Inclusion:** It inserts the content of header files into your source code when you use `#include`.