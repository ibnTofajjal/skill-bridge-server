import { SUBJECT_NAMES } from "../../prisma/generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function main() {
  const subjects = Object.values(SUBJECT_NAMES).map((name) => ({ name }));

  await prisma.subject.createMany({
    data: subjects,
    skipDuplicates: true,
  });

  console.log(`Seeded ${subjects.length} subjects.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
