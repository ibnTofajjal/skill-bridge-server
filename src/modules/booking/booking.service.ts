import { BOOKING_STATUS } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../lib/AppError";
import { prisma } from "../../lib/prisma";
import { BookingCancel, BookingCreate } from "./booking.types";

const createBooking = async (payload: BookingCreate, userId: string) => {
  const booking = await prisma.booking.create({
    data: { ...payload, studentId: userId },
  });

  return booking;
};

const cancelBooking = async (
  payload: BookingCancel,
  userId: string,
  bookingId: string,
) => {
  const tutorProfile = await prisma.tutorProfile.findFirst({
    select: { id: true },
    where: { userId },
  });

  // Fetch the specific booking and verify ownership in one query
  const booking = await prisma.booking.findFirst({
    where: {
      id: parseInt(bookingId),
      OR: [{ studentId: userId }, { tutorProfileId: tutorProfile?.id ?? "" }],
    },
  });

  if (!booking) {
    throw new AppError(
      "Booking not found or you do not have permission to cancel it",
      403,
    );
  }

  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new AppError("Booking is already cancelled");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: payload.status },
  });

  return updatedBooking;
};

const updateBookingStatus = async (
  payload: BookingCancel,
  userId: string,
  bookingId: string,
) => {
  const tutorProfile = await prisma.tutorProfile.findFirst({
    select: { id: true },
    where: { userId },
  });

  if (!tutorProfile) {
    throw new AppError("Only tutors can update booking status", 403);
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: parseInt(bookingId),
      tutorProfileId: tutorProfile.id,
    },
  });

  if (!booking) {
    throw new AppError(
      "Booking not found or you do not have permission to update it",
      403,
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: payload.status },
  });

  return updatedBooking;
};

const allBooking = async (userId: string, role: string) => {
  if (role === "TUTOR") {
    const tutorProfile = await prisma.tutorProfile.findFirst({
      select: { id: true },
      where: { userId },
    });

    if (!tutorProfile) {
      throw new AppError("Tutor profile not found", 404);
    }

    return prisma.booking.findMany({
      where: { tutorProfileId: tutorProfile.id },
    });
  }

  return prisma.booking.findMany({
    where: { studentId: userId },
  });
};

const singleBooking = async (
  bookingId: string,
  userId: string,
  role: string,
) => {
  if (role === "TUTOR") {
    const tutorProfile = await prisma.tutorProfile.findFirst({
      select: { id: true },
      where: { userId },
    });

    if (!tutorProfile) {
      throw new AppError("Tutor profile not found", 404);
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
        tutorProfileId: tutorProfile.id,
      },
    });

    if (!booking) {
      throw new AppError(
        "Booking not found or you do not have permission to view it",
        403,
      );
    }

    return booking;
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: parseInt(bookingId),
      studentId: userId,
    },
  });

  if (!booking) {
    throw new AppError(
      "Booking not found or you do not have permission to view it",
      403,
    );
  }

  return booking;
};

export const bookingService = {
  createBooking,
  cancelBooking,
  updateBookingStatus,
  allBooking,
  singleBooking,
};
