import prisma from "../lib/prisma.js";

async function seed() {
  console.log("Seeding benchmark data...");

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

  console.log("Benchmark user verified:", benchmarkUser.id);

  const existingCount = await prisma.websiteProject.count();
  console.log(`Current project count: ${existingCount}`);

  if (existingCount < 20) {
    console.log("Seeding 25 sample projects...");
    for (let i = 1; i <= 25; i++) {
      const isPub = i % 2 === 0;
      await prisma.websiteProject.create({
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
  }

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
