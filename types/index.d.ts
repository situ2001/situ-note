import type { CarbonIconType } from "@carbon/icons-react";
import type { IconType } from "react-icons/lib";

export interface BlogConfig {
  title: string;
  author: string;
  description: string;
  email: string;

  /**
   * Hero section. (首页的主体部分)
   */
  hero: {
    greeting: string;
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
  icon?: IconType | CarbonIconType;

  /**
   * Used for replacing greeting in the hero section.
   */
  greeting?: string;
}

export interface Contact {
  name: string;
  link: string;
  icon: ImageMetadata | IconType;
}

export interface Friend {
  name: string;
  link: string;
}

export interface Role {
  title: string;
  at?: string;
  icon?: React.ElementType | string;
}

export interface Project {
  title: string;
  description: string;
  link: string;
  icon?: string | React.ElementType;
  featured?: boolean;
}
