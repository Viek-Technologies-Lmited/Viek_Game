import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const Button = ({ className = "", children, ...rest }: ButtonProps) => {
  return (
    <button
      className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
