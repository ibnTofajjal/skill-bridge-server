import { Request, Response } from "express";
import { tutorService } from "./tutor.service";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../lib/AppError";

const createProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.TUTOR) {
      throw new AppError(
        "You do not have permission to create tutor profile",
        403,
      );
    }

    const result = await tutorService.createProfile(req.body, user?.id);

    res.status(201).json({
      status: "success",
      message: "You successfully created your Tutor Profile",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error.messgae,
      data: null,
    });
  }
};

const updateProfile = async (req: Request, res: Response) => {};

export const tutorController = {
  createProfile,
  updateProfile,
};
