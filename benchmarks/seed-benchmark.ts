import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../server/generated/prisma/client.js";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log("Seeding benchmark data...");

  // Create benchmark test user
  const benchmarkUser = await prisma.user.upsert({
    where: { id: "bench-user-1" },
    update: {},
    create: {
      id: "bench-user-1",
      email: "bench@webcraft.test",
      name: "Benchmark Tester",
      credits: 1000,
      totalCreation: 50,
      emailVerified: true,
    },
  });

  console.log("Benchmark user created/verified:", benchmarkUser.id);

  // Check how many projects exist
  const existingCount = await prisma.websiteProject.count();
  if (existingCount < 20) {
    console.log(`Current project count: ${existingCount}. Seeding 25 sample projects...`);
    for (let i = 1; i <= 25; i++) {
      const isPub = i % 2 === 0;
      const proj = await prisma.websiteProject.create({
        data: {
          id: `bench-proj-${i}`,
          name: `Benchmark Project ${i}`,
          initial_prompt: `Create a modern landing page for enterprise AI solution number ${i}`,
          current_code: `<!DOCTYPE html><html lang="en"><head><title>Project ${i}</title><script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script></head><body class="bg-gray-900 text-white min-h-screen flex items-center justify-center"><h1 class="text-4xl font-bold">WebCraft Project ${i}</h1></body></html>`,
          current_version_index: `v1-${i}`,
          userId: benchmarkUser.id,
          isPublished: isPub,
          versions: {
            create: [
              {
                id: `v1-${i}`,
                code: `<!DOCTYPE html><html><body>Version 1 for project ${i}</body></html>`,
                description: "Initial Version",
              },
            ],
          },
          conversation: {
            create: [
              {
                role: "user",
                content: `Initial prompt for project ${i}`,
              },
              {
                role: "assistant",
                content: `I've created your website for project ${i}`,
              },
            ],
          },
        },
      });
    }
    console.log("Seeding complete.");
  } else {
    console.log(`Database already has ${existingCount} projects. Ready for benchmarking.`);
  }

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
