import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const Button = ({ className = "", children, ...rest }: ButtonProps) => {
  return (
    <button
      className={`w-full bg-blue-500 text-white hover:bg-blue-700 font-semibold rounded-lg py-3 transition duration-300 cursor-pointer ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
