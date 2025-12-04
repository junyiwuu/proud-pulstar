---
title: Debug
---

除了printf 和assert

还有什么
breakpoint debug
- use gdb

run the program using gdb : `gdb ./xxx`
(entered gdb shell)
`run`, to run the program
set the breakpoint on function: `break JDescriptorWriter::JDescriptorWriter`  (will print everywhere using this)
set the breakpoint on certain line: `break descriptor.cpp:176`

> Check the code
> check around: `list`
> check certain line: `list 176`
> check certain function: `list JDescriptorWriter::build`

**Actions**
execute next line: `next`, `n`
enter next function: `step`, `s`
continue to next breakpoint: `continue`, `c`
execute till current function return: `finish`

check where is now(in the program): `where` / `backtrace`
current frame info: `info frame`






