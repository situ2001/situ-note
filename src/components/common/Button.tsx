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
        "px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-md",
        "hover:shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200",
        className
      )}
    >
      {text}
    </button>
  );
};

export default Button;
