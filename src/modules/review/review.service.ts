import { prisma } from "../../lib/prisma";
import { reviewCreate } from "./review.types";

const createReview = async (payload: reviewCreate, userId: string) => {
  const review = await prisma.review.create({
    data: {
      ...payload,
      studentId: userId,
    },
  });

  return review;
};

const allReview = async (tutorProfileId: string) => {
  const reviews = await prisma.review.findMany({
    where: { tutorProfileId },
    include: {
      student: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
};

export const reviewService = {
  createReview,
  allReview,
};
