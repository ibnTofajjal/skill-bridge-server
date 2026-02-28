import { STATUS } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
};
const updateStatus = async (userId: string, status: STATUS) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status === status) {
    throw new Error(`User status is already ${status}`);
  }

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  return updateUser;
};

export const adminService = {
  getAllUsers,
  updateStatus,
};
