// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import starlightThemeObsidian from 'starlight-theme-obsidian'

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import vercel from '@astrojs/vercel';
// import rehypeMathjax from 'rehype-mathjax';




// https://astro.build/config
export default defineConfig({
  markdown: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
      // rehypePlugins: [rehypeMathjax],
	  },

  integrations: [
      starlight({
          plugins: [starlightThemeObsidian()],
          title: 'My Study Notes',
          social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/junyiwuu' }],


          sidebar: [
              {slug: 'study_notes' },  // no captilized letter for this single entry


              // {
              // 	label: 'Guides',
              // 	items: [
              // 		// Each item here is one entry in the navigation menu.
              // 		{ label: 'Example Guide', slug: 'guides/example' },
              // 	],
              // },

              {	label: 'Cpp',
                  autogenerate: { directory: 'Cpp' },	collapsed: true,},

              
              {	label: 'Linux',
                  autogenerate: { directory: 'linux' },	collapsed: true,},

              {	label: 'Virtual Environment',
                  autogenerate: { directory: 'virtual environment' },	collapsed: true,},
              
              {	label: 'Vulkan',
                  autogenerate: {directory: "vulkan"}, 	collapsed: true,},


              {	label: 'Blog',
                  autogenerate: {directory: "blog"}, collapsed: true,},


              {	label: 'Python',
                  autogenerate: { directory: 'python' },	collapsed: true,},

              {	label: 'Reference',
                  autogenerate: { directory: 'reference' },  collapsed: true,},

              {	label: 'Research Study',
                  autogenerate: { directory: 'researchStudy' }, collapsed: true,},


          ],
      }),
	],

  adapter: vercel(),
});