import { Request, Response } from "express";
import { tutorService } from "./tutor.service";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../lib/AppError";
import {
  tutorAvailabilitySchema,
  tutorProfileCreateSchema,
  tutorProfileUpdateSchema,
} from "./tutor.types";
import getValidationMessage from "../../lib/validationError";

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

    const parsed = tutorProfileCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "failed",
        message: getValidationMessage(parsed.error),
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await tutorService.createProfile(parsed.data, user.id);

    res.status(201).json({
      status: "success",
      message: "You successfully created your Tutor Profile",
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

const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.params.id;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.TUTOR) {
      throw new AppError(
        "You do not have permission to access this resource",
        403,
      );
    }

    const parsed = tutorProfileUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "failed",
        message: getValidationMessage(parsed.error),
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await tutorService.updateProfile(
      parsed.data,
      user.id,
      profileId as string,
    );

    res.status(200).json({
      status: "success",
      message: "You successfully updated your Tutor Profile",
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

const setAvailability = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.TUTOR) {
      throw new AppError(
        "You do not have permission for accessing this resource",
        403,
      );
    }

    const parsed = tutorAvailabilitySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "failed",
        message: getValidationMessage(parsed.error),
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await tutorService.setAvailability(parsed.data, user.id);

    res.status(201).json({
      status: "success",
      message: "Availability slot created successfully",
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

const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const availableSlotId = req.params.id;
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.TUTOR) {
      throw new AppError(
        "You do not have permission for accessing this resource",
        403,
      );
    }

    const result = await tutorService.deleteAvailability(
      availableSlotId as string,
      user.id,
    );

    res.status(200).json({
      status: "success",
      message: "Availability slot deleted successfully",
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

const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.TUTOR) {
      throw new AppError(
        "You do not have permission to access this resource",
        403,
      );
    }

    const result = await tutorService.getProfile(user.id);

    res.status(200).json({
      status: "success",
      message: "Tutor profile fetched successfully",
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

const getMyAvailability = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.TUTOR) {
      throw new AppError(
        "You do not have permission to access this resource",
        403,
      );
    }

    const result = await tutorService.getMyAvailability(user.id);

    res.status(200).json({
      status: "success",
      message: "Availability slots fetched successfully",
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

export const tutorController = {
  createProfile,
  updateProfile,
  setAvailability,
  deleteAvailability,
  getProfile,
  getMyAvailability,
};
