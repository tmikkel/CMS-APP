import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PageEditor from "@/app/components/admin/pageeditor";
import { EditableSectionType, sectionFieldConfig } from "@/lib/sectionregistry";

export default async function PageDetailView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      translations: true,
      sections: {
        orderBy: { order: "asc" },
        include: { translations: true },
      },
    },
  });

  if (!page) notFound();

  const enTranslation = page.translations.find((t) => t.locale === "EN");

  const editableTypes = Object.keys(sectionFieldConfig);

  const editableSections = page.sections
    .filter((s) => editableTypes.includes(s.type))
    .map((s) => ({
      id: s.id,
      type: s.type as EditableSectionType,
      order: s.order,
      data: s.data as Record<string, unknown>,
      fields:
        (s.translations.find((t) => t.locale === "EN")?.fields as Record<
          string,
          unknown
        >) ?? {},
    }));

  return (
    <div>
      <Link
        href="/admin/pages"
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Back to Pages
      </Link>

      <div className="flex items-center justify-between mt-4 mb-6">
        <div>
          <h1 className="text-lg font-semibold">
            {enTranslation?.title ?? "Untitled"}
          </h1>
          <p className="text-sm text-zinc-500">/{page.slug}</p>
        </div>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            page.status === "PUBLISHED"
              ? "bg-green-100 text-green-700"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {page.status}
        </span>
      </div>

      <PageEditor pageId={page.id} initialSections={editableSections} />
    </div>
  );
}
