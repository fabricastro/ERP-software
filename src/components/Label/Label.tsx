import React from 'react';

interface LabelProps {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, required = false, children }) => {
  return (
    <label className='mb-3 block text-black dark:text-white' htmlFor={htmlFor}>
      {children} {required && <span style={{ color: 'red' }}>*</span>}
    </label>
  );
};

export default Label;
