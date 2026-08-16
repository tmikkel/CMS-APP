import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean slate on re-runs
  await prisma.sectionTranslation.deleteMany();
  await prisma.section.deleteMany();
  await prisma.pageTranslation.deleteMany();
  await prisma.page.deleteMany();

  const homePage = await prisma.page.create({
    data: {
      slug: "home",
      status: "PUBLISHED",
      translations: {
        create: [
          {
            locale: "EN",
            title: "Home",
            seoTitle: "Welcome to My Site",
            seoDescription: "This is the homepage of my custom CMS.",
          },
          {
            locale: "DA",
            title: "Forside",
            seoTitle: "Velkommen til min side",
            seoDescription: "Dette er forsiden af mit eget CMS.",
          },
        ],
      },
    },
  });

  await prisma.section.create({
    data: {
      pageId: homePage.id,
      type: "HERO",
      order: 0,
      data: {
        buttonLink: "/contact",
        imageUrl: "/images/hero-placeholder.jpg",
      },
      translations: {
        create: [
          {
            locale: "EN",
            fields: {
              title: "Build something great",
              subtitle: "A modern CMS built on Next.js",
              buttonText: "Get in touch",
            },
          },
          {
            locale: "DA",
            fields: {
              title: "Byg noget fantastisk",
              subtitle: "Et moderne CMS bygget på Next.js",
              buttonText: "Kontakt os",
            },
          },
        ],
      },
    },
  });

  await prisma.section.create({
    data: {
      pageId: homePage.id,
      type: "TESTIMONIALS",
      order: 1,
      data: {},
      translations: {
        create: [
          {
            locale: "EN",
            fields: {
              quote: "This CMS is a breath of fresh air.",
              author: "A Happy Client",
            },
          },
          {
            locale: "DA",
            fields: {
              quote: "Dette CMS er en frisk pust.",
              author: "En Glad Kunde",
            },
          },
        ],
      },
    },
  });

  console.log("Seed complete. Homepage created with 2 sections.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
