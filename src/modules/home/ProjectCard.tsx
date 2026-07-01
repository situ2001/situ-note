import React from "react";
import * as ReactIs from "react-is";


interface CardProps {
  title: string;
  description: string;
  link?: string;
  type?: string;

  /**
   * Can be either a React component or image URL
   */
  icon?: React.ElementType | string;
}

const ProjectCard = ({ title, description, link, type, icon }: CardProps) => {
  const iconComp = (() => {
    if (typeof icon === 'string') {
      return <img
        src={icon as string}
        alt={title}
        className="h-20 w-20 object-contain"
      />;
    }

    if (typeof icon === 'function' && (icon as any).src !== undefined) {
      return <img
        src={(icon as any).src}
        alt={title}
        className="h-20 w-20 object-contain"
      />;
    }

    if (ReactIs.isValidElementType(icon)) {
      const IconComponent = icon as React.ElementType;
      return <IconComponent alt={title} size={80} className="h-20 w-20 text-zinc-600 dark:text-zinc-400" />
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
      <div className="group relative h-full overflow-hidden rounded-lg border border-transparent p-3 transition-colors duration-200 ease-in-out hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-zinc-800/30">
        <div className="pointer-events-none absolute bottom-2 right-2 flex origin-bottom-right scale-100 items-center justify-center opacity-[0.035] transition-all duration-300 ease-out group-hover:scale-110 group-hover:opacity-[0.07] dark:opacity-[0.06] dark:group-hover:opacity-[0.1]">
          {iconComp}
        </div>

        <div className="relative flex h-full flex-col">
          <h3 className="min-w-0 leading-snug">{title}</h3>
          {
            type ? (
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                {type}
              </p>
            ) : null
          }
          <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-sm transition ease-in-out duration-200 opacity-70 group-hover:opacity-90">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
