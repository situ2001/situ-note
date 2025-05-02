import { FiExternalLink } from 'react-icons/fi';
import Card from "../../components/common/Card";

interface CardProps {
  title: string;
  description: string;
  link?: string;
  icon?: React.ElementType | string; // Can be either a React component or image URL
  tags?: string[];
  featured?: boolean;
}

const ProjectCard = ({ title, description, link, icon, tags, featured = false }: CardProps) => {
  const IconComponent = typeof icon === 'function' ? icon : undefined;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="h-full relative">
        {link && (
          <div className="absolute top-4 right-4 text-zinc-400">
            <FiExternalLink size={14} />
          </div>
        )}

        <div className="flex flex-col gap-3 h-full">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden">
              {IconComponent ? (
                <IconComponent size={20} className="text-zinc-600 dark:text-zinc-400" />
              ) : typeof icon === 'string' ? (
                <img
                  src={icon as string}
                  alt=""
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <span className="text-zinc-600 dark:text-zinc-400 text-xl font-medium">
                  {title[0]}
                </span>
              )}
            </div>
            <h3 className="font-semibold">{title}</h3>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm">{description}</p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 dark:border dark:border-zinc-700 rounded-full text-zinc-600 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </a>
  );
};

export default ProjectCard;
