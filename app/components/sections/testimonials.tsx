import { TestimonialsFields, TestimonialsData } from "../../types/sections";

export default function Testimonials({
  fields,
}: {
  data: TestimonialsData;
  fields: TestimonialsFields;
}) {
  return (
    <section style={{ padding: "3rem 2rem", textAlign: "center" }}>
      <blockquote>"{fields.quote}"</blockquote>
      <p>— {fields.author}</p>
    </section>
  );
}
