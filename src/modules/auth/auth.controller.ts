import { Response, Request } from "express";
import { authService } from "./auth.service";

const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      status: "success",
      message: "You are successfully completed your Registration",
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

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);

    res.status(201).json({
      status: "success",
      message: "You are successfully Logged in",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error.message,
      data: null,
    });
  }
};

export const authController = {
  register,
  login,
};
