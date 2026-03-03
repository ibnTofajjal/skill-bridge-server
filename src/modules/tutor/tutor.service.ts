import { AppError } from "../../lib/AppError";
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

const setAvailability = async (payload: TutorAvailability, userId: string) => {
  const profile = await prisma.tutorProfile.findFirst({
    where: { id: payload.tutorProfileId, userId },
  });

  if (!profile)
    throw new AppError(
      "You are not authorized to set availability for this profile",
      403,
    );

  const availableTime = await prisma.availability.create({
    data: payload,
  });

  return availableTime;
};

const deleteAvailability = async (availableSlotId: string, userId: string) => {
  const slot = await prisma.availability.findFirst({
    where: { id: availableSlotId },
    include: { tutorProfile: { select: { userId: true } } },
  });

  if (!slot) throw new AppError("Availability slot not found", 404);

  if (slot.tutorProfile.userId !== userId)
    throw new AppError(
      "You are not authorized to delete this availability slot",
      403,
    );

  const deleteSlot = await prisma.availability.delete({
    where: { id: availableSlotId },
  });

  return deleteSlot;
};

const getProfile = async (userId: string) => {
  const profile = await prisma.tutorProfile.findFirst({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      subject: true,
      availabilities: true,
      receivedBookings: true,
      receivedReviews: true,
    },
  });

  if (!profile) throw new Error("Tutor profile not found");

  return profile;
};

const getMyAvailability = async (userId: string) => {
  const profile = await prisma.tutorProfile.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("Tutor profile not found");

  const slots = await prisma.availability.findMany({
    where: { tutorProfileId: profile.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return slots;
};

const getAllTutors = async (filters: {
  subjectId?: string;
  subjectName?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}) => {
  const { subjectId, subjectName, minPrice, maxPrice, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(subjectId && { subjectId }),
    ...(subjectName && { subject: { name: subjectName as any } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      pricePerHour: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  const [tutors, total] = await Promise.all([
    prisma.tutorProfile.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        subject: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tutorProfile.count({ where }),
  ]);

  return {
    tutors,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getTutorById = async (tutorProfileId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      subject: true,
      availabilities: {
        where: { isBooked: false },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
      receivedReviews: true,
    },
  });

  if (!tutor) throw new AppError("Tutor not found", 404);

  return tutor;
};

export const tutorService = {
  createProfile,
  updateProfile,
  setAvailability,
  deleteAvailability,
  getProfile,
  getMyAvailability,
  getAllTutors,
  getTutorById,
};
