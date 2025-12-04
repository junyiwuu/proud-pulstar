---
title: VScode
---

## C++
**Compile:** 
`g++ test.cpp -o test`
**Debug:**
`g++ -g test.cpp -o test`
(if using task.json), follow [this video](https://www.youtube.com/watch?v=G9gnSGKYIg4)

*if cannot see the variables in the debug, turn off the optimizaiton*
`g++ -g -O0 test.cpp -o test`