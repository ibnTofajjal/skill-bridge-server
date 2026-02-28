import { Request, Response } from "express";
import { AppError } from "../../lib/AppError";
import { STATUS, USER_ROLE } from "../../../prisma/generated/prisma/enums";
import { adminService } from "./admin.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.ADMIN) {
      throw new AppError(
        "You do not have permission to access this resource",
        403,
      );
    }

    const result = await adminService.getAllUsers();

    res.status(200).json({
      status: "success",
      message: "You successfully retrived all users",
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
const updateStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) throw new AppError("user not found", 403);

    if (user?.role !== USER_ROLE.ADMIN) {
      throw new AppError(
        "You do not have permission to access this resource",
        403,
      );
    }

    const { status } = req.body;
    const { id } = req.params;
    const result = await adminService.updateStatus(
      id as string,
      status as STATUS,
    );

    res.status(200).json({
      status: "success",
      message: "You successfully updated user status",
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

export const adminController = {
  getAllUsers,
  updateStatus,
};
