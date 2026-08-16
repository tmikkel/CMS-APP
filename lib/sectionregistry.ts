import { z } from "zod";
import { ComponentType } from "react";
import Hero from "@/app/components/sections/hero";
import Testimonials from "@/app/components/sections/testimonials";
import CTA from "@/app/components/sections/cta";

export type FieldWidget = "text" | "textarea" | "url" | "image";

export type FieldConfig = {
  key: string;
  label: string;
  widget: FieldWidget;
};

export type SectionFieldConfig = {
  data: FieldConfig[];
  fields: FieldConfig[];
};

// This is now the single source of truth — add a new section type here,
// and its validation, defaults, and form all follow automatically.
export const sectionFieldConfig = {
  HERO: {
    fields: [
      { key: "title", label: "Title", widget: "text" },
      { key: "subtitle", label: "Subtitle", widget: "text" },
      { key: "buttonText", label: "Button text", widget: "text" },
    ],
    data: [
      { key: "buttonLink", label: "Button link", widget: "url" },
      { key: "imageUrl", label: "Image", widget: "image" },
    ],
  },
  TESTIMONIALS: {
    fields: [
      { key: "quote", label: "Quote", widget: "textarea" },
      { key: "author", label: "Author", widget: "text" },
    ],
    data: [],
  },
  CTA: {
    fields: [
      { key: "heading", label: "Heading", widget: "text" },
      { key: "buttonText", label: "Button text", widget: "text" },
    ],
    data: [{ key: "buttonLink", label: "Button link", widget: "url" }],
  },
} as const satisfies Record<string, SectionFieldConfig>;

export type EditableSectionType = keyof typeof sectionFieldConfig;

// --- Everything below is derived, not hand-written ---

function buildSchema(fields: readonly FieldConfig[]) {
  const shape: Record<string, z.ZodString> = {};
  for (const field of fields) {
    shape[field.key] = z.string();
  }
  return z.object(shape);
}

export const sectionSchemas = Object.fromEntries(
  Object.entries(sectionFieldConfig).map(([type, config]) => [
    type,
    { data: buildSchema(config.data), fields: buildSchema(config.fields) },
  ]),
) as Record<
  EditableSectionType,
  { data: z.ZodObject<any>; fields: z.ZodObject<any> }
>;

export const sectionDefaults: Record<
  EditableSectionType,
  { data: Record<string, unknown>; fields: Record<string, unknown> }
> = {
  HERO: {
    data: { buttonLink: "/", imageUrl: "" },
    fields: {
      title: "New headline",
      subtitle: "New subtitle",
      buttonText: "Learn more",
    },
  },
  TESTIMONIALS: {
    data: {},
    fields: { quote: "New testimonial", author: "Author name" },
  },
  CTA: {
    data: { buttonLink: "/contact" },
    fields: { heading: "Ready to get started?", buttonText: "Contact us" },
  },
};

export const sectionTypeLabels: Record<EditableSectionType, string> = {
  HERO: "Hero",
  TESTIMONIALS: "Testimonials",
  CTA: "Call to Action",
};

export const sectionComponents: Record<
  EditableSectionType,
  ComponentType<{ data: any; fields: any }>
> = {
  HERO: Hero,
  TESTIMONIALS: Testimonials,
  CTA: CTA,
};
