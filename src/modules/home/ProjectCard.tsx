import { FiExternalLink, FiBox } from 'react-icons/fi';

interface CardProps {
  title: string;
  description: string;
  link?: string;
  icon?: React.ElementType | string; // Can be either a React component or image URL
  tags?: string[];
  featured?: boolean;
}

const Card = ({ title, description, link, icon = FiBox, tags, featured = false }: CardProps) => {
  const IconComponent = typeof icon === 'function' ? icon : undefined;
  
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <div className="h-full rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-hidden hover:shadow-lg transition-shadow relative">
        {link && (
          <div className="absolute top-4 right-4 text-gray-400">
            <FiExternalLink size={14} />
          </div>
        )}
        
        <div className="flex flex-col gap-3 h-full">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {IconComponent ? (
                <IconComponent size={20} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <img 
                  src={icon as string} 
                  alt=""
                  className="w-6 h-6 object-contain"
                />
              )}
            </div>
            <h3 className="font-semibold">{title}</h3>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default Card;
