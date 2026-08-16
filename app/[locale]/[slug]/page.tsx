import prisma from "../../../lib/prisma";
import { notFound } from "next/navigation";
import SectionRenderer from "../../components/sections/renderer";

export default async function CmsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const upperLocale = locale.toUpperCase();

  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      translations: true,
      sections: {
        orderBy: { order: "asc" },
        include: { translations: true },
      },
    },
  });

  if (!page || page.status !== "PUBLISHED") {
    notFound();
  }

  const pageTranslation = page.translations.find(
    (t) => t.locale === upperLocale,
  );
  if (!pageTranslation) notFound();

  return (
    <main>
      <title>{pageTranslation.seoTitle ?? pageTranslation.title}</title>
      {page.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          locale={upperLocale}
        />
      ))}
    </main>
  );
}
