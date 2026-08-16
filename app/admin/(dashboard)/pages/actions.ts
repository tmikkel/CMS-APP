"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPage(formData: FormData) {
  const slug = (formData.get("slug") as string)
    ?.trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const title = (formData.get("title") as string)?.trim();

  if (!slug || !title) return;

  await prisma.page.create({
    data: {
      slug,
      status: "DRAFT",
      translations: {
        create: [{ locale: "EN", title }],
      },
    },
  });

  revalidatePath("/admin/pages");
}
