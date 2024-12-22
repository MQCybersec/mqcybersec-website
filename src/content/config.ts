import { defineCollection, z } from "astro:content";

const showcase = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      image: image(),
      url: z.string().url(),
      featured: z.number().min(1).optional(),
    }),
});

const people = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      image: image().optional(),
      enrollments: z.array(z.object({
        year: z.number().int().positive(),
        role: z.string().min(1).optional()
      }))
    }),
});

const placementSchema = z.object({
  year: z.number(),
  teamName: z.string().optional(),
  globalPlacement: z.number(),
  australiaPlacement: z.number().optional(),
  totalTeams: z.number().optional(),
});

export const ctfs = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    image: z.string().optional(),
    placements: z.array(placementSchema),
  }),
});

export const collections = {
  showcase,
  people,
  ctfs
};