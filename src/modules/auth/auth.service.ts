import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";

interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

const register = async (payload: IRegisterPayload) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const data = { ...payload, password: hashPassword };
  const createUser = await prisma.user.create({ data: data });

  return createUser;
};

export const authService = {
  register,
};
