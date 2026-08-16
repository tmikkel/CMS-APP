"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  sectionSchemas,
  sectionDefaults,
  EditableSectionType,
} from "@/lib/sectionregistry";

export async function updateSectionContent(
  sectionId: string,
  pageId: string,
  type: EditableSectionType,
  data: unknown,
  fields: unknown,
) {
  const schema = sectionSchemas[type];
  const dataResult = schema.data.safeParse(data);
  const fieldsResult = schema.fields.safeParse(fields);

  if (!dataResult.success || !fieldsResult.success) {
    return { error: "Invalid section data" };
  }

  await prisma.section.update({
    where: { id: sectionId },
    data: { data: dataResult.data },
  });

  await prisma.sectionTranslation.updateMany({
    where: { sectionId, locale: "EN" },
    data: { fields: fieldsResult.data },
  });

  revalidatePath(`/admin/pages/${pageId}`);
  return { success: true };
}

export async function addSection(pageId: string, type: EditableSectionType) {
  const existing = await prisma.section.findMany({
    where: { pageId },
    orderBy: { order: "asc" },
  });

  const nextOrder = existing.length
    ? existing[existing.length - 1].order + 1
    : 0;
  const defaults = sectionDefaults[type];

  const section = await prisma.section.create({
    data: {
      pageId,
      type,
      order: nextOrder,
      data: defaults.data,
      translations: { create: [{ locale: "EN", fields: defaults.fields }] },
    },
    include: { translations: true },
  });

  revalidatePath(`/admin/pages/${pageId}`);
  return section;
}

export async function moveSection(
  pageId: string,
  sectionId: string,
  direction: "up" | "down",
) {
  const sections = await prisma.section.findMany({
    where: { pageId },
    orderBy: { order: "asc" },
  });

  const currentIndex = sections.findIndex((s) => s.id === sectionId);
  if (currentIndex === -1) return { error: "Section not found" };

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= sections.length) {
    return { error: "Already at boundary" };
  }

  const current = sections[currentIndex];
  const target = sections[targetIndex];

  await prisma.$transaction([
    prisma.section.update({
      where: { id: current.id },
      data: { order: target.order },
    }),
    prisma.section.update({
      where: { id: target.id },
      data: { order: current.order },
    }),
  ]);

  revalidatePath(`/admin/pages/${pageId}`);
  return { success: true };
}
