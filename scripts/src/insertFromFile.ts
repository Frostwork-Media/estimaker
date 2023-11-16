import { readFileSync } from "fs";
import { getProject, prisma } from "db";

type P = Omit<Awaited<ReturnType<typeof getProject>>, "id">;

// Inserts a file into the database
// expects the DATABASE_URL environment variable to be set in the environment
// and expect the file to be passed as the first argument
async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("No file path provided");
    process.exit(1);
  }

  // load json
  const fileContents = readFileSync(filePath, "utf8");
  const { ownerId, projectEstimate, state, name } = JSON.parse(
    fileContents
  ) as P;

  // Delete project 7b45913f-9147-4da6-82b3-14300139dcac
  // await prisma.project.delete({
  //   where: {
  //     id: "fe3e3211-0798-46e3-aab5-c0181e9ba6d0",
  //   },
  // });

  // insert into database
  await prisma.project.create({
    data: {
      name,
      ownerId,
      state,
      projectEstimate: {
        create: [
          ...projectEstimate.map((pe) => ({
            estimate: {
              create: {
                id: pe.estimate.id,
                ownerId,
                description: pe.estimate.description,
                value: pe.estimate.value,
              },
            },
          })),
        ],
      },
    },
  });
}

main();
