import type { IconType } from "react-icons/lib";

export interface BlogConfig {
  title: string;
  author: string;
  description: string;
  email: string;

  hero: {
    greeting: string;
    description: string | string[];
    contacts: Contact[];
  },

  /**
   * Friends. (友链)
   */
  friends?: Friend[];

  roles?: Role[],

  projects?: Project[],
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
}

export interface Project {
  title: string;
  description: string;
  link: string;
  icon: string | React.ElementType;
  tags: string[];
  featured?: boolean;
}
