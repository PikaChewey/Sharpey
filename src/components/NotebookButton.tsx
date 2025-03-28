import React, { ButtonHTMLAttributes, ReactNode, useMemo } from 'react';

interface NotebookButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  handDrawn?: boolean;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  rotationDegree?: number; // Allow custom rotation
}

const NotebookButton: React.FC<NotebookButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  handDrawn = true,
  className = '',
  icon,
  iconPosition = 'left',
  rotationDegree,
  ...props
}) => {
  // Calculate a deterministic rotation based on the button text
  const rotation = useMemo(() => {
    if (rotationDegree !== undefined) return rotationDegree;
    
    // If children is a string, generate a consistent rotation based on its content
    if (typeof children === 'string') {
      const hash = children.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      return (hash % 3) - 1; // Between -1 and 1 degrees
    }
    
    // Default fallback rotation
    return 0.5;
  }, [children, rotationDegree]);

  // Calculate secondary border rotation (slightly different from main rotation)
  const borderRotation = rotation * 0.7;

  // Base styles for all buttons
  const baseStyles = `
    relative
    font-handwritten
    inline-flex items-center justify-center
    transition-all duration-200
    ${fullWidth ? 'w-full' : ''}
    focus:outline-none
    active:translate-y-0.5
  `;

  // Size variations
  const sizeClasses = {
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2.5',
  };

  // Style variations with improved dark mode support
  const variantClasses = {
    primary: 'bg-notebook-blue hover:bg-blue-700 text-white border-2 border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 dark:border-blue-500',
    secondary: 'bg-notebook-gray hover:bg-gray-700 text-white border-2 border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-500',
    outline: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-notebook-gray dark:text-gray-300 border-2 border-notebook-line dark:border-notebook-dark-line',
    danger: 'bg-notebook-red hover:bg-red-700 text-white border-2 border-red-700 dark:bg-red-700 dark:hover:bg-red-600 dark:border-red-500',
    success: 'bg-notebook-green hover:bg-green-700 text-white border-2 border-green-700 dark:bg-green-700 dark:hover:bg-green-600 dark:border-green-500',
  };

  // Hand-drawn styles with deterministic rotation
  const handDrawnClasses = handDrawn 
    ? `
      transform rotate-[${rotation}deg]
      before:content-[''] before:absolute before:inset-0 before:border-2 before:border-current before:opacity-20 
      before:transform before:rotate-[${borderRotation}deg] before:rounded-md
      shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]
      hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] dark:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)]
      active:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] dark:active:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.4)]
      `
    : '';

  // Combine all the styles
  const buttonClasses = `
    ${baseStyles}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${handDrawnClasses}
    ${className}
    rounded-md
  `;

  return (
    <button
      className={buttonClasses}
      style={{ filter: 'url(#pencil-effect)'}}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
      
      {/* Sketchy border effect */}
      <span 
        className="absolute inset-0 border-2 rounded-md opacity-30 pointer-events-none"
        style={{ 
          transform: `scale(1.02) rotate(${borderRotation}deg)`, 
          borderStyle: 'solid',
          borderColor: 'currentColor'
        }}
      ></span>
    </button>
  );
};

export default NotebookButton; 