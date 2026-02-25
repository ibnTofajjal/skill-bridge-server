import { NextFunction, Request, Response } from "express";
import { STATUS, USER_ROLE } from "../../prisma/generated/prisma/enums";
import jwt from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { IUser } from "../modules/auth/types";
import { AppError } from "../lib/AppError";

export const auth = (...roles: USER_ROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) throw new AppError("Token not found", 401);

      const decodedUser = jwt.verify(token, config.jwt_secret!) as IUser;

      const userData = await prisma.user.findUnique({
        select: { email: true, role: true, status: true },
        where: { email: decodedUser.email },
      });

      if (!userData) throw new AppError("Unauthorized", 401);

      if (userData.status === STATUS.BAN) {
        throw new AppError("Your account has been banned", 403);
      }

      if (roles.length && !roles.includes(decodedUser.role)) {
        throw new AppError("You do not have permission to access this resource", 403);
      }

      req.user = decodedUser;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError("Your session has expired, please log in again", 401));
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError("Invalid token", 401));
      }
      next(error);
    }
  };
};
