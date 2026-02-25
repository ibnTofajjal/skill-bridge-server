import { prisma } from "../../lib/prisma";
import { TutorProfileCreate } from "./tutor.types";

const createProfile = async (payload: TutorProfileCreate, userId: string) => {
  const existingProfile = await prisma.tutorProfile.findFirst({
    where: { userId },
  });

  if (existingProfile) throw new Error("You already have a tutor profile");

  const profile = await prisma.tutorProfile.create({
    data: { ...payload, userId },
  });

  return profile;
};

const updateProfile = async () => {};

export const tutorService = {
  createProfile,
  updateProfile,
};
