"use server";

import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return { error: "Not found" };

  const filePath = path.join(process.cwd(), "public", media.url);
  try {
    await unlink(filePath);
  } catch {
    // File may already be gone — still remove the DB record
  }

  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
  return { success: true };
}

export async function updateAltText(id: string, alt: string) {
  await prisma.media.update({ where: { id }, data: { alt } });
  revalidatePath("/admin/media");
  return { success: true };
}
