import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import config from "../../config";

interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}
interface ILoginPayload {
  email: string;
  password: string;
}

const register = async (payload: IRegisterPayload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const data = { ...payload, password: hashPassword };
  const createUser = await prisma.user.create({ data: data });

  return createUser;
};

const login = async (payload: ILoginPayload) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (!user) throw new Error("Invalid email, please provide the valid email");

  const matchPassword = await bcrypt.compare(payload.password, user.password);

  if (!matchPassword)
    throw new Error("Invalid password, please provide the valid password");

  const userData = {
    id: user.id,
    name: user.name,
    role: user.role,
    status: user.status,
    email: user.email,
  };

  const token = jwt.sign(userData, config.jwt_secret!, { expiresIn: "1d" });

  return { token, user };
};

export const authService = {
  register,
  login,
};
