import { sectionComponents, EditableSectionType } from "@/lib/sectionregistry";

type SectionWithTranslation = {
  id: string;
  type: string;
  order: number;
  data: unknown;
  translations: { locale: string; fields: unknown }[];
};

export default function SectionRenderer({
  section,
  locale,
}: {
  section: SectionWithTranslation;
  locale: string;
}) {
  const translation = section.translations.find((t) => t.locale === locale);
  if (!translation) return null;

  const Component = sectionComponents[section.type as EditableSectionType];
  if (!Component) return null;

  return <Component data={section.data} fields={translation.fields} />;
}
