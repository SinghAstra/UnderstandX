export type SiteConfig = {
  name: string;
  description: string;
  tagline: string;
  url: string;
  features: string[];
  ogImage?: string;
  links: {
    twitter: string;
    github: string;
    linkedIn: string;
  };
};
