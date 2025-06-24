---
title: Keyboard Movement
description: using GLFW
---
Libraries: GLFW ,SDL2, Qt

## GLFW

[GLFW keyboard key tokens](https://www.glfw.org/docs/3.3/group__keys.html)


**First** create a struct, mapping the keyboard to variables
```cpp
class KeyboardMovementsController{

	public:
	struct KeyMappings{
		int moveLeft = GLFW_KEY_A;
		int moveRight = GLFW_KEY_D;
		int moveForward = GLFW_KEY_W;
		int moveBackward = GLFW_KEY_S;
		int moveUp = GLFW_KEY_Q;
		int moveDown = GLFW_KEY_E;
		int lookLeft = GLFW_KEY_LEFT;
		int lookRight = GLFW_KEY_RIGHT;
		int lookUp = GLFW_KEY_UP;
		int lookDown = GLFW_KEY_DOWN;
	};
	
	void moveInPlaneXZ (GLFWwindow *window , float dt, LveGameObject& gameObject);
	
	KeyMappings keys{}; //create a member variable and initialize it
	float moveSpeed{3.f};
	float lookSpeed{1.5f};

};
```

**Then Implement it**
```cpp
	void KeyboardMovementsController::moveInPlaneXZ (GLFWwindow *window , float dt, LveGameObject& gameObject){
	
	glm::vec3 rotate{0}; //initialize the rotate as 0
	
	if (glfwGetKey(window, keys.lookRight) == GLFW_PRESS ) rotate.y += 1.f;
	if (glfwGetKey(window, keys.lookLeft) == GLFW_PRESS ) rotate.y -= 1.f;
	if (glfwGetKey(window, keys.lookUp) == GLFW_PRESS ) rotate.x += 1.f;
	if (glfwGetKey(window, keys.lookDown) == GLFW_PRESS ) rotate.x -= 1.f;
	
	if (glm::dot(rotate, rotate) > std::numeric_limits<float>::epsilon()){
		gameObject.transform.rotation += lookSpeed * dt * glm::normalize(rotate);
	}
	
	gameObject.transform.rotation.x = glm::clamp(gameObject.transform.rotation.x , -1.5f, 1.5f);
	gameObject.transform.rotation.y = glm::mod(gameObject.transform.rotation.y , glm::two_pi<float>()); 
	
	float yaw = gameObject.transform.rotation.y;
	const glm::vec3 forwardDir{sin(yaw), 0.f, cos(yaw)};
	const glm::vec3 rightDir{forwardDir.z , 0.f, -forwardDir.x}; //the vector perpendicular t o forward direction
	const glm::vec3 upDir{0.f, -1.f, 0.f};
}
```

`glm::two_pi<float>()` return constant,  the value of 2π
`std::numeric_limits<float>::epsilon()` return constant. The value is typically very small (around 1.19209e-07 for 32-bit floats). 
`epsilon()`: The difference between 1.0 and the next representable value
* for example, the next representable value after 1.0 is 1.00000011920928955078125
* so epsilon() is 1.00000011920928955078125 - 1.0 = 0.00000011920928955078125