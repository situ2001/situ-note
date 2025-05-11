import React from "react";
import * as ReactIs from "react-is";
import Card from "../../components/common/Card";


interface CardProps {
  title: string;
  description: string;
  link?: string;

  /**
   * Can be either a React component or image URL
   */
  icon?: React.ElementType | string;
}

const ProjectCard = ({ title, description, link, icon }: CardProps) => {
  const iconComp = (() => {
    if (typeof icon === 'string') {
      return <img
        src={icon as string}
        alt={title}
        className="w-12 h-12 p-3 object-contain"
      />;
    }

    if (typeof icon === 'function' && (icon as any).src !== undefined) {
      return <img
        src={(icon as any).src}
        alt={title}
        className="w-12 h-12 p-3 object-contain"
      />;
    }

    if (ReactIs.isValidElementType(icon)) {
      const IconComponent = icon as React.ElementType;
      return <IconComponent alt={title} size={20} className="w-12 h-12 p-3 text-zinc-600 dark:text-zinc-400" />
    }

    return <span className="text-zinc-600 dark:text-zinc-400 text-xl font-medium">
      {title[0]}
    </span>;
  })();

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="h-full group flex flex-row gap-4">
        <div className="shrink-0 my-auto flex items-center justify-center overflow-hidden">
          {iconComp}
        </div>

        <div className="flex flex-col h-full">
          <h3>{title}</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm transition ease-in-out duration-200 opacity-50 group-hover:opacity-75">
            {description}
          </p>
        </div>
      </Card>
    </a>
  );
};

export default ProjectCard;
