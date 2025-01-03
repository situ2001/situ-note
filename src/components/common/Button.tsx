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
        "px-4 py-2 bg-gray-200 rounded-md",
        "hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {text}
    </button>
  );
};

export default Button;
