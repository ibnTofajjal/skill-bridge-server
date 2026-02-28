import { STATUS } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.user.count(),
  ]);

  return {
    users,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
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

const getAllBookings = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
      skip,
      take: limit,
      include: { student: true, tutor: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.count(),
  ]);

  return {
    bookings,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getAnalytics = async () => {
  const [
    totalUsers,
    bannedUsers,
    totalStudents,
    totalTutors,
    subjects,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { status: "BAN" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TUTOR" } }),
    prisma.subject.findMany({
      include: {
        tutorProfiles: {
          select: {
            id: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
  ]);

  return {
    users: {
      total: totalUsers,
      active: totalUsers - bannedUsers,
      banned: bannedUsers,
      students: totalStudents,
      tutors: totalTutors,
    },
    subjects: {
      total: subjects.length,
      data: subjects.map((subject) => ({
        id: subject.id,
        name: subject.name,
        tutors: subject.tutorProfiles.map((profile) => ({
          id: profile.user.id,
          tutorProfileId: profile.id,
          name: profile.user.name,
          email: profile.user.email,
        })),
        tutorCount: subject.tutorProfiles.length,
      })),
    },
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
    },
  };
};

export const adminService = {
  getAllUsers,
  updateStatus,
  getAllBookings,
  getAnalytics,
};
