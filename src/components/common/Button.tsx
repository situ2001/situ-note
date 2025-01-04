import clsx from 'clsx';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const Button = ({ text, onClick, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200 rounded-md",
        "hover:shadow-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all duration-200",
        className
      )}
    >
      {text}
    </button>
  );
};

export default Button;
