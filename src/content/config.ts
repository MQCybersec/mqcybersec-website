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

const gridImages = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      image: image(),
    }),
});

const people = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      image: image().optional(),
      description: z.string().optional(),
      socials: z
        .array(
          z.object({
            platform: z.string(),
            url: z.string().url(),
            icon: z.string(),
          }),
        )
        .optional(),
      enrollments: z.array(
        z.object({
          year: z.number().int().positive(),
          role: z.string().min(1).optional(),
        }),
      ),
    }),
});

const placementSchema = z.object({
  year: z.number(),
  teamName: z.string().optional(),
  globalPlacement: z.number(),
  australiaPlacement: z.number().optional(),
  totalTeams: z.number().optional(),
});

const ctfTimeRankingSchema = z.object({
  year: z.number(),
  globalRank: z.number(),
  totalTeams: z.number().optional(),
  countryRank: z.number().optional(),
  countryName: z.string(),
  teamName: z.string(),
});

export const ctfs = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image().optional(),
      placements: z.array(placementSchema),
    }),
});

export const ctfTimeRankings = defineCollection({
  type: "data",
  schema: () =>
    z.object({
      rankings: z.array(ctfTimeRankingSchema)
    }),
});

const writeups = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    ctf: z.string().optional(),
    category: z.string().optional(),
    section: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().optional(),
    image: image().optional(),
    hidden: z.boolean().optional().default(false),
  }),
});

const sections = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    name: z.string(),
    icon: z.string().optional(),
    iconImage: image().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
  }),
});

export const collections = {
  showcase,
  people,
  ctfs,
  ctfTimeRankings,
  gridImages,
  writeups,
  sections,
};