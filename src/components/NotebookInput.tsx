import React, { forwardRef, InputHTMLAttributes } from 'react';

interface NotebookInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  helperText?: string;
  fullWidth?: boolean;
  tiltDegree?: number;
}

const NotebookInput = forwardRef<HTMLInputElement, NotebookInputProps>(
  ({ 
    label, 
    errorMessage, 
    helperText, 
    className, 
    fullWidth = true,
    tiltDegree = Math.random() * 2 - 1, // Random tilt between -1 and 1 degrees  
    ...props 
  }, ref) => {
    
    // Randomize a slight rotation for the handwritten feel
    const inputTilt = {
      transform: `rotate(${tiltDegree}deg)`
    };

    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            className="block mb-1 font-handwritten text-notebook-gray dark:text-gray-300"
            style={{ transform: `rotate(${tiltDegree * 0.7}deg)` }}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            className={`
              block
              border-b-2 border-notebook-line dark:border-gray-600
              bg-transparent
              px-1 py-1.5
              w-full
              font-handwritten
              text-notebook-gray dark:text-gray-200
              focus:outline-none focus:border-notebook-blue dark:focus:border-blue-500
              transition-all duration-200
              ${errorMessage ? 'border-notebook-red dark:border-red-600' : ''}
              ${className || ''}
            `}
            style={inputTilt}
            {...props}
          />
          
          {/* Pencil underline effect */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[2px] opacity-30 pointer-events-none"
            style={{ 
              transform: `rotate(${tiltDegree * 0.5}deg)`,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cline x1=\'0\' y1=\'50%25\' x2=\'100%25\' y2=\'50%25\' stroke=\'%234b5563\' stroke-width=\'2\' stroke-dasharray=\'1,3\' /%3E%3C/svg%3E")'
            }}
          ></div>
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <p 
            className="mt-1 text-sm text-notebook-red dark:text-red-400 font-handwritten"
            style={{ transform: `rotate(${tiltDegree * -0.5}deg)` }}
          >
            {errorMessage}
          </p>
        )}
        
        {/* Helper text */}
        {helperText && !errorMessage && (
          <p 
            className="mt-1 text-sm text-notebook-gray dark:text-gray-400 font-handwritten opacity-80"
            style={{ transform: `rotate(${tiltDegree * -0.5}deg)` }}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

NotebookInput.displayName = 'NotebookInput';

export default NotebookInput; 