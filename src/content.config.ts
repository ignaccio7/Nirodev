import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file, glob } from "astro/loaders";

const projectsCollection = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    slug: z.string(),
    category: z.enum(["general", "maquetacion", "proyectosjs"]),
    title: z.string(),
    description: z.string(),
    url: z.string().optional(),
    code: z.string(),
    image: z.string(),
    dev: z.boolean(),
    images: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          device: z.enum(["mobile", "desktop"]),
          width: z.number(),
          height: z.number(),
        }),
      )
      .optional(),
    // tag: z.string()
  }),
});

const categoriesCollection = defineCollection({
  loader: file("src/content/categories.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
  }),
});

export const collections = {
  projects: projectsCollection,
  categories: categoriesCollection,
};
