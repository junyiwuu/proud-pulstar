import { z, defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';


import { pageThemeObsidianSchema } from 'starlight-theme-obsidian/schema';




const blogs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/blogs" }),
  schema: z.object({
    title: z.string(),
    // description: z.string().max(200),
    // date: z.string().date(),
    // tags: z.array(z.string()),
    // image: z.string(),
  }),
});

// const project = defineCollection({
//   loader: file("src/data/projects.json"),
//   schema: z.object({
//     title: z.string(),
//     description: z.string().optional(),
//     image: z.string(),
//     slug: z.string(),
//     liveSiteURL: z.string(),
//     githubURL: z.string(),
//   }),
// });

// Expose your defined collection to Astro
// with the `collections` export
// const studyNotes


const docs = defineCollection({ 
	loader: docsLoader(), 
	schema: docsSchema({
		extend: pageThemeObsidianSchema
	}) 
  });


export const collections = {
	docs,
	blogs
};
