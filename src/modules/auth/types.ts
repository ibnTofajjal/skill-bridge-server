import { STATUS, USER_ROLE } from "../../../prisma/generated/prisma/enums";

export interface IUser {
  id: string;
  name: string;
  role: USER_ROLE;
  status: STATUS;
  email: string;
  iat: number;
  exp: number;
}
