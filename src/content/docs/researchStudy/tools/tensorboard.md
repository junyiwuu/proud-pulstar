---
title: tensorboard
---





* `file_level = cfg_logging.get("file_level", 10)`
	`console_level = cfg_logging.get("console_level", 20)`: retrieve file level and console level
	* when set level = n, only show the information's level that higher than this n. For example if set level=20, will not print DEBUG information

| **Level Name** | **Value** | **Description**                        |
| -------------- | --------- | -------------------------------------- |
| DEBUG          | 10        | Most detailed logs, used for debugging |
| INFO           | 20        | General runtime information            |
| WARNING        | 30        | Warning, but the program can still run |
| ERROR          | 40        | Error, part of the program failed      |
| CRITICAL       | 50        | Severe error, the program may crash    |


* `root_logger = logging.getLogger()` : the logging top level controller
* `root_logger.handlers.clear() ` : clear all handlers, for example: `FileHandler`, `StreamHandler`, avoid repetitive log
* `root_logger.setLevel(min(file_level, console_level))`: set the minimum for root logger, anything lower than root logger will be entirely ignored, even though it been set up in handlers.


**set up handler**:
* what handler: `logging.FileHandler(logging_file_path)`
* what format of this handler: `xx_handler.setFormatter(formatter_object)`
* what level of this handler: `xx_handler.setLevel(level_number)`
* add this handler to root logger: `root_logger.addHandler(xx_handler)`

**handler**:
* write into file: `logging.FileHandler()`
* write to terminal: `logging.StreamHandler()`


**other loggers:**
* get root logger: `logging.getLogger()`
* get specific logger: `logging.getLogger("package_name")`, for example: `logging.getLogger("matplotlib")`
* set level for specific logger: `logging.getLogger("matplotlib").setLevel(logging.INFO)` 
	> logging.INFO -> number 20

