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
        "px-2 py-1 rounded-md",
        "text-zinc-600 dark:text-zinc-400",
        "hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200",
        className
      )}
    >
      {text}
    </button>
  );
};

export default Button;
