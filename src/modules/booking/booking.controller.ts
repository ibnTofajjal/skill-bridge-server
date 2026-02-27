import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { AppError } from "../../lib/AppError";
import { USER_ROLE } from "../../../prisma/generated/prisma/enums";
import {
  bookingSchema,
  cancelBookingSchema,
  updateBookingStatusSchema,
} from "./booking.types";
import getValidationMessage from "../../lib/validationError";

const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.STUDENT) {
      throw new AppError("You do not have permission to book tutor", 403);
    }

    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "failed",
        message: getValidationMessage(parsed.error),
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await bookingService.createBooking(req.body, user.id);

    res.status(200).json({
      status: "success",
      message: "You successfully sent a booking request to a tutor",
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

const cancelBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!user?.id) throw new AppError("user not found", 403);

    console.log(user);

    if (user?.role !== USER_ROLE.STUDENT && user?.role !== USER_ROLE.TUTOR) {
      throw new AppError(
        "You do not have permission to update the booking",
        403,
      );
    }

    const parsed = cancelBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "failed",
        message: getValidationMessage(parsed.error),
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await bookingService.cancelBooking(
      req.body,
      user.id,
      id as string,
    );

    res.status(200).json({
      status: "success",
      message: "You successfully cancelled your booking",
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

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!user?.id) throw new AppError("user not found", 403);

    console.log(user);

    if (user?.role !== USER_ROLE.TUTOR) {
      throw new AppError(
        "You do not have permission to update the booking",
        403,
      );
    }

    const parsed = updateBookingStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: "failed",
        message: getValidationMessage(parsed.error),
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const result = await bookingService.updateBookingStatus(
      req.body,
      user.id,
      id as string,
    );

    res.status(200).json({
      status: "success",
      message: "You successfully update your booking status",
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

const allBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.TUTOR && user?.role !== USER_ROLE.STUDENT) {
      throw new AppError(
        "You do not have permission to see the booking list",
        403,
      );
    }

    const result = await bookingService.allBooking(user.id, user.role);

    res.status(201).json({
      status: "success",
      message: "You successfully retrived your all bookings",
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

export const bookingController = {
  createBooking,
  cancelBooking,
  updateBookingStatus,
  allBooking,
};
