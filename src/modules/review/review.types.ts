import z from "zod";

export const reviewSchema = z
  .object({
    rating: z.number().min(1.0).max(5.0), // 1.0 to 5.0
    comment: z.string().max(1000).optional(), // Optional with max length
    tutorProfileId: z.string().min(1),
  })
  .strict();

export type reviewCreate = z.infer<typeof reviewSchema>;
