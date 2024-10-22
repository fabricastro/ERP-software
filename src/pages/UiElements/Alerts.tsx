import React, { useEffect, useState } from 'react';
import { IoCloseCircle } from "react-icons/io5";

interface AlertProps {
  type: 'success' | 'warning' | 'error';
  title: string;
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const [exit, setExit] = useState(false);

  const alertStyles = {
    success: {
      border: 'border-[#34D399]',
      background: 'bg-[#34D399]',
      iconBackground: 'bg-[#000]',
      textColor: 'text-black dark:text-white',
      messageColor: 'text-[#000]',
    },
    warning: {
      border: 'border-warning',
      background: 'bg-warning',
      iconBackground: 'bg-warning bg-opacity-30',
      textColor: 'text-[#9D5425]',
      messageColor: 'text-[#000]',
    },
    error: {
      border: 'border-[#F87171]',
      background: 'bg-[#F87171]',
      iconBackground: 'bg-[#fc1e1e]',
      textColor: 'text-[#f7e4e4]',
      messageColor: 'text-[#000]',
    },
  };

  const style = alertStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true); 
      setTimeout(() => {
        if (onClose) {
          onClose(); 
        }
      }, 500); 
    }, 3000); 

    return () => clearTimeout(timer); 
  }, [onClose]);

  return (
    <div
      className={`fixed top-25 right-5 z-9999 max-w-xs p-4 rounded-lg shadow-lg transition-all ${
        exit ? 'alert-exit' : 'alert-enter'
      } ${style.border} ${style.background} flex items-start space-x-4`}
    >
      <div className={`h-10 w-10 flex items-center justify-center rounded-full ${style.iconBackground}`}>
        {type === 'success' && (
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
              fill="white"
              stroke="white"
            />
          </svg>
        )}
        {type === 'warning' && (
          <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.50493 16H17.5023C18.6204 16 19.3413 14.9018 18.8354 13.9735L10.8367 0.770573C10.2852 -0.256858 8.70677 -0.256858 8.15528 0.770573L0.156617 13.9735C-0.334072 14.8998 0.386764 16 1.50493 16ZM10.7585 12.9298C10.7585 13.6155 10.2223 14.1433 9.45583 14.1433C8.6894 14.1433 8.15311 13.6155 8.15311 12.9298V12.9015C8.15311 12.2159 8.6894 11.688 9.45583 11.688C10.2223 11.688 10.7585 12.2159 10.7585 12.9015V12.9298ZM8.75236 4.01062H10.2548C10.6674 4.01062 10.9127 4.33826 10.8671 4.75288L10.2071 10.1186C10.1615 10.5049 9.88572 10.7455 9.50142 10.7455C9.11929 10.7455 8.84138 10.5028 8.79579 10.1186L8.13574 4.75288C8.09449 4.33826 8.33984 4.01062 8.75236 4.01062Z"
              fill="#FBBF24"
            />
          </svg>
        )}
        {type === 'error' && (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579Z"
              fill="#ffffff"
              stroke="#ffffff"
            />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <h5 className={`mb-2 text-lg font-semibold ${style.textColor}`}>{title}</h5>
        <p className={`text-sm ${style.messageColor}`}>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-white text-2xl">
          <IoCloseCircle />
        </button>
      )}
    </div>
  );
};

export default Alert;
