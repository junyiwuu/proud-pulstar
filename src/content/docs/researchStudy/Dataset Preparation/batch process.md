---
title: Batch Process
---

* Pay attention , need space between commands (for example `--output dir xxx/xxx `

```python
 subprocess.run(
                ["bash", "-c",  command],
                timeout=300,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
```