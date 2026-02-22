import { Response, Request } from "express";
import { authService } from "./auth.service";
import { IUser } from "./types";

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

    res.cookie("token", result.token, {
      secure: false,
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
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

const me = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const result = await authService.me(user?.id);

    res.status(200).json({
      status: "success",
      message: "Retrieved Your Profile",
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
  me,
};
