import { z } from "zod";
import { DAY_OF_WEEK } from "../../../prisma/generated/prisma/enums";

export const tutorProfileCreateSchema = z
  .object({
    bio: z.string().nullable().optional(),
    experience: z.string(),
    university: z.string(),
    pricePerHour: z.number().int().positive(),
    major: z.string(),
    age: z.number().int().positive().nullable().optional(),
    cgpa: z.number().positive(),
    subjectId: z.string().uuid(),
  })
  .strict();

export const tutorProfileUpdateSchema = z
  .object({
    bio: z.string().nullable().optional(),
    experience: z.string(),
    pricePerHour: z.number().int().positive(),
    age: z.number().int().positive().nullable().optional(),
    subjectId: z.string().uuid(),
  })
  .strict();

export const tutorAvailabilitySchema = z
  .object({
    tutorProfileId: z.string(),
    dayOfWeek: z.enum(DAY_OF_WEEK),
    startTime: z.string(),
    endTime: z.string(),
    isBooked: z.boolean().optional(),
  })
  .strict();

export type TutorProfileCreate = z.infer<typeof tutorProfileCreateSchema>;
export type TutorProfileUpdate = z.infer<typeof tutorProfileUpdateSchema>;
export type TutorAvailability = z.infer<typeof tutorAvailabilitySchema>;
