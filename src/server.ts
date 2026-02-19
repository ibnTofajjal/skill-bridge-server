import { prisma } from "./lib/prisma";
import config from "./config";
import app from "./app";

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database ✅");

    app.listen(config.port, () => {
      console.log(
        `Example app listening on port http://localhost:${config.port}`,
      );
    });
  } catch (error: any) {
    prisma.$disconnect();
    console.log(error.message);
    throw new Error("There's Something wrong");
  }
}
main();
