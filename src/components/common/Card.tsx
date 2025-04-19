import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={clsx(
      "border p-4 rounded-lg",
      "border-zinc-200 dark:border-zinc-600",
      "shadow-sm-zinc-300 dark:shadow-sm-zinc-600",
      "transition-shadow-sm hover:shadow-sm-md",
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
