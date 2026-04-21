import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-5 py-2.5 rounded-[10px] font-medium text-[13px] transition-opacity disabled:opacity-40 disabled:pointer-events-none active:opacity-85';
  
  const variants = {
    primary: 'bg-[#1A1AFF] text-white',
    secondary: 'bg-[#F5F5F7] text-[#111111] border border-[#E0E0E0]',
    destructive: 'bg-[#FFEBEE] text-[#D32F2F]',
    ghost: 'bg-transparent text-[#555555]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
