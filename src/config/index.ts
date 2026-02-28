import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_APP_URL,
  jwt_secret: process.env.JWT_SECRET,
  admin_name: process.env.ADMIN_NAME,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
};
