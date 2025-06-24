---
title: Astro Starlight
date: 2025-03-01
---
Things about Astro Starlight fixes
## Markdown not rendering properly
Debug thought: 
1. Check page itself (Developer tool), find out exactly where is broken
	1. For example, after find where using `li` `ul` elements, find the style, and find which folder they come from, and find that file!
	2. For example : ``` <div class="sl-markdown-content" data-astro-source-file="/home/j/projects/digital-debris/node_modules/@astrojs/starlight/components/MarkdownContent.astro" data-astro-source-loc="6:35"> ```
2. Locate the exact file, ask AI to suggest exact what to put back, for example here we need to make bullet point work: 
		```.sl-markdown-content ul,
		.sl-markdown-content ol {
			list-style: disc !important;
			padding-left: 20px !important;}```




## Configuration
* update nodejs






---

component must be written start with capitalized letter


## Collection Entry:
在 Astro 的 Content Collections 里：  
👉 每个集合（collection）代表一组数据（比如 blog、project、docs）。  
👉 每条数据（每篇文章、每个项目）就是一个 **entry**。

`CollectionEntry` 就是 Astro 为每条数据 entry 提供的 **类型定义**，用来让 TypeScript 明确这条数据长啥样。

### from "astro:content";
👉 `astro:content` 是 Astro 提供的内置模块，用于管理和操作 Content Collections。

它里面集成了：
- `getCollection` — 获取集合数据
- `getEntryBySlug` — 按 slug 获取一条数据
- `defineCollection` — 定义集合和 schema
- `CollectionEntry` — 提供每条集合 entry 的类型


```
interface Props {
	blog: CollectionEntry<"blog">;
}
```
`interface Props { ... }`: 定义了一个 **TypeScript 接口**，它描述了某个组件或函数需要接收的参数（props）的结构。这里这个组件会接收一个叫blog的props

`blog: CollectionEntry<"blog">;`: 
- 你在 `astro.config.mjs` 或其他地方用 `defineCollection("blog", { schema: … })` 定义过 `blog` 集合。
- 每条 blog 数据的结构（字段名、类型）都基于你的 schema。
- 用 `CollectionEntry<"blog">`，TypeScript 就能知道 `blog` 这条数据有哪些字段，写代码时会有类型提示，防止写错。

