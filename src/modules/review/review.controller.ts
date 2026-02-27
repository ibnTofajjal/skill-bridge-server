import { Request, Response } from "express";
import { AppError } from "../../lib/AppError";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";
import { reviewService } from "./review.service";
import { reviewSchema } from "./review.types";
import getValidationMessage from "../../lib/validationError";

const createReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.STUDENT) {
      throw new AppError("You do not have permission to give review", 403);
    }

    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "failed",
        message: getValidationMessage(parsed.error),
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await reviewService.createReview(req.body, user.id);

    res.status(200).json({
      status: "success",
      message: "Successfully place the review",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode ?? 500).json({
      status: "failed",
      message: error.message,
      data: null,
    });
  }
};

const allReview = async (req: Request, res: Response) => {
  try {
    const tutorProfileId = req.params.tutorProfileId as string;

    const result = await reviewService.allReview(tutorProfileId);

    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all reviews",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode ?? 500).json({
      status: "failed",
      message: error.message,
      data: null,
    });
  }
};

export const reviewController = {
  createReview,
  allReview,
};
