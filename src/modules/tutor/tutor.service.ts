import { prisma } from "../../lib/prisma";
import {
  TutorAvailability,
  TutorProfileCreate,
  TutorProfileUpdate,
} from "./tutor.types";

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

const updateProfile = async (
  payload: TutorProfileUpdate,
  userId: string,
  profileId: string,
) => {
  const existingProfile = await prisma.tutorProfile.findFirst({
    where: { userId },
  });

  if (!existingProfile) throw new Error("You don't have the tutor profile");

  const profileUpdate = await prisma.tutorProfile.update({
    where: { id: profileId, userId: userId },
    data: payload,
  });

  return profileUpdate;
};

const setAvailability = async (payload: TutorAvailability) => {
  const availableTime = await prisma.availability.create({
    data: payload,
  });

  return availableTime;
};

const deleteAvailability = async (
  availableSlotId: string,
  tutorProfileId: string,
) => {
  const deleteSlot = await prisma.availability.delete({
    where: {
      id: availableSlotId,
      tutorProfileId: tutorProfileId,
    },
  });

  return deleteSlot;
};

export const tutorService = {
  createProfile,
  updateProfile,
  setAvailability,
  deleteAvailability,
};
