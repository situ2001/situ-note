import type { ImageMetadata } from "astro";

export interface BlogConfig {
  title: string;
  author: string;
  description: string;
  email: string;

  /**
   * Hero section. (首页的主体部分)
   */
  hero: {
    description: string | string[];
    contacts: Contact[];
  },

  /**
   * Navigation. (顶部导航栏)
   */
  nav: {
    items: NavigationItem[];
  }

  /**
   * Friends. (友链)
   */
  friends?: Friend[];

  projects?: Project[],
}

export interface NavigationItem {
  name: string;
  link: string;

  forceMinimal?: boolean;
  autoMinimal?: boolean;
  icon?: string;
}

export interface Contact {
  name: string;
  link: string;
  icon: ImageMetadata | string;
}

export interface Friend {
  name: string;
  link: string;
}

export interface Role {
  title: string;
  at?: string;
  icon?: string;
}

export interface Project {
  title: string;
  description: string;
  link: string;
  icon?: string;
  featured?: boolean;
  section?: "featured" | "experiment";
}
