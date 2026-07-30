import { z } from "zod";

// Only a plain filename (no path separators) is allowed, since it is resolved
// against the dedicated images folder next to the links config file.
const imageFilenameSchema = z
  .string()
  .min(1)
  .regex(/^[^/\\]+$/, "image must be a plain filename without path separators")
  .refine((value) => value !== "." && value !== "..", {
    message: "image must not be '.' or '..'",
  });

export const LinkConfigEntrySchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: imageFilenameSchema.optional(),
  category: z.string().optional(),
  adminOnly: z.boolean().default(false),
});

export const LinksConfigSchema = z.object({
  links: z.array(LinkConfigEntrySchema).default([]),
});

export type LinkConfigEntry = z.infer<typeof LinkConfigEntrySchema>;
export type LinksConfig = z.infer<typeof LinksConfigSchema>;
