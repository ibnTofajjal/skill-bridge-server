import { NextFunction, Request, Response } from "express";
import { STATUS, USER_ROLE } from "../../prisma/generated/prisma/enums";
import jwt from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { IUser } from "../modules/auth/types";

export const auth = (...roles: USER_ROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) throw new Error("Token Not Found");
      const decodedUser = jwt.verify(token, config.jwt_secret!) as IUser;

      // Check the db, that the provided user is in the db or just a fake req
      const userData = await prisma.user.findUnique({
        select: { email: true, role: true, status: true },
        where: {
          email: decodedUser.email,
        },
      });
      if (!userData) throw new Error("Unauthorized");

      // is the given role include in the token or not, if so then should allow for the req if not throw the error.
      if (userData.status === STATUS.BAN) {
        throw new Error("You are Banned");
      } else if (roles.length && !roles.includes(decodedUser.role)) {
        throw new Error("Unauthorized");
      }

      req.user = decodedUser;

      next();
    } catch (error: any) {
      next(error);
    }
  };
};
