import { isPlainObject } from "es-toolkit";
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
        alt=""
        className="w-6 h-6 object-contain"
      />;
    }

    if (typeof icon === 'function') {
      const IconComponent = icon as any;

      if (IconComponent.src !== undefined) {
        return <img
          src={IconComponent.src}
          alt={IconComponent.alt}
          className="w-6 h-6 object-contain"
        />;
      }

      return <IconComponent size={20} className="text-zinc-600 dark:text-zinc-400" />
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
      <Card className="h-full relative group">
        <div className="flex flex-col gap-3 h-full">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded-lg overflow-hidden">
              {iconComp}
            </div>

            <h3 className="">{title}</h3>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm transition ease-in-out duration-200 opacity-50 group-hover:opacity-75">{description}</p>
        </div>
      </Card>
    </a>
  );
};

export default ProjectCard;
