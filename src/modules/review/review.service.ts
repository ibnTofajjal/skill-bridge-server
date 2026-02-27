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

export const reviewService = {
  createReview,
};
