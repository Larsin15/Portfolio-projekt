/**
 * Database seeding script for portfolio projects.
 * 
 * Run with: npx tsx src/seed.ts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { projects } from "./schema";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://portfolio:portfolio_dev_password@localhost:5432/portfolio",
});

const db = drizzle(pool);

const projectsData = [
  {
    slug: "personality-miner",
    title: "Personality Miner",
    description:
      "AI-powered self-discovery tool using CBT/ACT methodologies. Generates personalized questions and creates a mirror context for self-understanding.",
    thumbnailUrl: null,
    demoType: "personality_miner",
    techStack: [
      { name: "React", iconClass: "fab fa-react" },
      { name: "Node.js", iconClass: "fab fa-node-js" },
      { name: "PostgreSQL", iconClass: "fas fa-database" },
      { name: "Docker", iconClass: "fab fa-docker" },
    ],
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: "staysphere",
    title: "StaySphere",
    description:
      "Vi är en grupp på tre som gjort vår tolkning på hur vi skulle vilja se en framtida uthyrningstjänst för hotel och privata boenden i ett. Vi ska precis påbörja frontend delen av projektet. Jag har främst ansvarat för booking samt availability delarna i listing, men annars har vi som grupp jobbat mycket tajt framförallt genom discord och code with me i IntelliJ.",
    thumbnailUrl: "/img/StaySphere.png",
    demoType: "static",
    techStack: [
      { name: "Java", iconClass: "fab fa-java" },
      { name: "PostgreSQL", iconClass: "fas fa-database" },
      { name: "JavaScript", iconClass: "fab fa-js" },
      { name: "Docker", iconClass: "fab fa-docker" },
    ],
    isFeatured: true,
    sortOrder: 2,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing projects
  await db.delete(projects);

  // Insert projects
  for (const project of projectsData) {
    await db.insert(projects).values(project);
    console.log(`  ✓ Added project: ${project.title}`);
  }

  console.log("✅ Seeding complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

