import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonProps {
    title: string;
    to?: string;
    bgColor?: string;
    textColor?: string;
    customStyles?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean; // Nueva prop para deshabilitar el botón
}

export const Buttons: FC<ButtonProps> = ({
    title,
    to,
    bgColor = 'bg-meta-3',
    textColor = 'text-white',
    customStyles = '',
    type = 'button',
    disabled = false, // Valor por defecto para la prop `disabled`
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to && !disabled) {
            navigate(to);
        }
    };

    return (
        <div>
            <button
                type={type}
                onClick={handleClick}
                disabled={disabled}
                className={`inline-flex items-center justify-center rounded-full ${
                    disabled ? 'bg-gray-3 cursor-not-allowed' : `${bgColor} ${textColor} hover:bg-opacity-90`
                } py-3 px-6 text-center font-medium lg:px-8 xl:px-6 ${customStyles}` }
            >
                {title}
            </button>
        </div>
    );
};
