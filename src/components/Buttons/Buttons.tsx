import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  title: string;
  to?: string | (() => void);
  bgColor?: string;
  textColor?: string;
  customStyles?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode; // Ícono opcional
  iconPosition?: 'left' | 'right'; // Posición del ícono por defecto a la izquierda
  onClick?: () => void; // Nueva prop para el evento onClick directo
}

export const Buttons: FC<ButtonProps> = ({
  title,
  to,
  bgColor = 'bg-meta-3',
  textColor = 'text-white',
  customStyles = '',
  type = 'button',
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick, // Prop para el onClick directo
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled) {
      if (onClick) {
        onClick();
      } else if (typeof to === 'function') {
        to();
      } else if (typeof to === 'string') {
        navigate(to);
      }
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
        } py-3 px-6 text-center font-medium lg:px-8 xl:px-6 ${customStyles}`}
      >
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {title}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </button>
    </div>
  );
};
