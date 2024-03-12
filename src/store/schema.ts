import { z } from 'astro:content';

export const contentSchema = z.object({
  ContentID: z.number().optional(), // Autoincremented in DB, optional in schema
  ContentType: z.enum(['article', 'study', 'tweet']),
  Title: z.string(),
  AuthorID: z.number().optional(), // Optional because the foreign key can be null if not linked
  PublicationDate: z.string(), // SQLite DATE as string (YYYY-MM-DD)
  Content: z.string().optional(), // Content might be optional depending on your use case
});

export type ContentSchema = z.infer<typeof contentSchema>;

export const AuthorSchema = z.object({
  AuthorID: z.number().optional(), // Autoincremented in DB, optional in schema
  Name: z.string(),
  Affiliation: z.string().optional(),
});

export type AuthorSchema = z.infer<typeof AuthorSchema>;

export const ArticleDetailsSchema = z.object({
  ContentID: z.number(),
  Source: z.string(),
  URL: z.string().url(),
  CategoryID: z.number(),
});

export type ArticleDetailsSchema = z.infer<typeof ArticleDetailsSchema>;

export const StudyDetailsSchema = z.object({
  ContentID: z.number(),
  Abstract: z.string(),
  Keywords: z.array(z.string()), // Consider using z.array(z.string()) if you want to store keywords as an array
  Publication: z.string(),
  DOI: z.string(),
});

export type StudyDetailsSchema = z.infer<typeof StudyDetailsSchema>;

export const TweetDetailsSchema = z.object({
  ContentID: z.number(),
  ThreadID: z.string(), // Assuming ThreadID could be a string to accommodate various formats
  Likes: z.number().int(), // Integer value
  Retweets: z.number().int(), // Integer value
});

export type TweetDetailsSchema = z.infer<typeof TweetDetailsSchema>;
