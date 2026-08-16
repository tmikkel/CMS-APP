import { CtaData, CtaFields } from "@/app/types/sections";

export default function CTA({
  data,
  fields,
}: {
  data: CtaData;
  fields: CtaFields;
}) {
  return (
    <section className="py-16 px-8 text-center bg-zinc-900 text-white rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">{fields.heading}</h2>
      <a
        href={data.buttonLink}
        className="inline-block rounded-md bg-white text-zinc-900 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 transition-colors"
      >
        {fields.buttonText}
      </a>
    </section>
  );
}
