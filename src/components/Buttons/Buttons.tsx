import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonProps {
    title: string;
    to?: string;  
    bgColor?: string;
    textColor?: string;
    customStyles?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const Buttons: FC<ButtonProps> = ({
    title,
    to,
    bgColor = 'bg-meta-3',
    textColor = 'text-white',
    customStyles = '',
    type = 'button',
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);  
        }
    };

    return (
        <div>
            <button
                type={type}
                onClick={handleClick}
                className={`inline-flex items-center justify-center rounded-full ${bgColor} py-4 px-10 text-center font-medium ${textColor} hover:bg-opacity-90 lg:px-8 xl:px-10 ${customStyles}`}
            >
                {title}
            </button>
        </div>
    );
};
