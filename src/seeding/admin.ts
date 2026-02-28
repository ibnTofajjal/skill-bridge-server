import bcrypt from "bcryptjs";
import { USER_ROLE } from "../../prisma/generated/prisma/enums";
import { prisma } from "../lib/prisma";
import config from "../config";

const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash(config.admin_password as string, 8);

  const adminData = {
    name: config.admin_name!,
    email: config.admin_email!,
    role: USER_ROLE.ADMIN!,
    password: hashedPassword!,
  };

  try {
    const isExists = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (isExists) {
      console.log("Admin already exists!!");
      return;
    }
    const admin = await prisma.user.create({
      data: adminData,
    });
    console.log("Admin created successfully!!");
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
