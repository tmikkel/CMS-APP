export type HeroData = { buttonLink: string; imageUrl: string };
export type HeroFields = {
  title: string;
  subtitle: string;
  buttonText: string;
};

export type TestimonialsData = Record<string, never>;
export type TestimonialsFields = { quote: string; author: string };

export type CtaData = { buttonLink: string };
export type CtaFields = { heading: string; buttonText: string };
