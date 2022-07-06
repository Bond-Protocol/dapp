import type { ButtonHTMLAttributes, FC } from 'react';

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={`px-2 border-2 ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
