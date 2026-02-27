import z from "zod";
import { BOOKING_STATUS } from "../../../prisma/generated/prisma/enums";

export const bookingSchema = z
  .object({
    sessionTime: z.string(),
    duration: z.number(),
    tutorProfileId: z.string(),
    studentId: z.string().optional(),
  })
  .strict();

export const cancelBookingSchema = z
  .object({
    status: z.literal(BOOKING_STATUS.CANCELLED),
  })
  .strict();

export type BookingCreate = z.infer<typeof bookingSchema>;
export type BookingCancel = z.infer<typeof cancelBookingSchema>;
