import React, { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 bg-white transition focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
        {leftIcon}
        <input
          ref={ref}
          id={id}
          className={`w-full py-3 text-sm text-black placeholder:text-gray-400 bg-transparent outline-none ${className}`}
          {...props}
        />
        {rightIcon}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
