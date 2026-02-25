import { SUBJECT_NAME } from "../../../prisma/generated/prisma/enums";

export interface ITutorProfileRequest {
  bio: string;
  pricePerHour: number;
  experience?: string;
  subject: SUBJECT_NAME;
}
