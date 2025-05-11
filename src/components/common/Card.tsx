import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={clsx(
      "p-2  rounded-xl",
      "bg-zinc-100 dark:bg-zinc-800",
      "border-2 border-transparent hover:border-zinc-200 hover:dark:border-zinc-700",
      "transition-all duration-200 ease-in-out",
      className,
    )}>
      {children}
    </div>
  );
};

export default Card;
