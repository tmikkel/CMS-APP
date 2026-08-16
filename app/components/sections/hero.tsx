import Image from "next/image";
import { HeroData, HeroFields } from "@/app/types/sections";

export default function Hero({
  data,
  fields,
}: {
  data: HeroData;
  fields: HeroFields;
}) {
  return (
    <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
      {data.imageUrl && (
        <div className="relative w-200 max-w-2xl mx-auto aspect-video mb-8 rounded-lg overflow-hidden">
          <Image
            src={data.imageUrl}
            alt={fields.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <h1>{fields.title}</h1>
      <p>{fields.subtitle}</p>
      <a href={data.buttonLink}>{fields.buttonText}</a>
    </section>
  );
}
