import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { IoMdAdd } from "react-icons/io";

interface SelectFormProps {
  label: string;
  id: string;
  value: any;
  options: any[];
  onChange: (selectedOption: any) => void;
  placeholder?: string;
  additionalClasses?: string;
  required?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  onButtonClick?: () => void;
}

const SelectForm: React.FC<SelectFormProps> = ({
  label,
  id,
  value,
  options,
  onChange,
  placeholder = 'Selecciona una opción',
  additionalClasses = '',
  required = false,
  isClearable = true,
  isDisabled = false,
  onButtonClick
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<boolean>(false);

  const validate = () => {
    if (required && !value) {
      setError('Este campo es obligatorio.');
    } else {
      setError(null);
    }
  };

  useEffect(() => {
    if (touched) {
      validate();
    }
  }, [value]);

  const handleBlur = () => {
    setTouched(true);
    validate();
  };

  return (
    <div className={`h-16 mb-5.5 ${additionalClasses}`}>
      <label htmlFor={id} className="mb-3 block text-sm font-medium text-black dark:text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative flex items-center">
        <Select
          classNames={{ control: () => 'w-full h-[52px]' }}
          options={options} // Usar la prop `options` en lugar de `loadOptions`
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          isClearable={isClearable}
          isDisabled={isDisabled}
          className="flex-grow react-select-container"
          classNamePrefix="react-select"
          noOptionsMessage={() => "No hay opciones disponibles"}
        />
        {/* Botón opcional para abrir el modal */}
        {onButtonClick && (
          <button
            type="button"
            disabled={isDisabled}
            onClick={onButtonClick}
            title="Añadir"
            className={`ml-2 text-2xl px-3 h-[52px] ${
              isDisabled ? 'bg-[#EFEFEF4D] hover:bg-[#EFEFEF4D] text-gray-500' : 'bg-blue-500 text-white'
            } rounded hover:bg-blue-600 focus:outline-none focus:ring-2 ${
              isDisabled ? 'cursor-not-allowed' : 'focus:ring-blue-500'
            }`}
          >
            <IoMdAdd />
          </button>
        )}
      </div>

      {/* Mostrar el mensaje de error */}
      {error && (
        <span className="text-red-500 text-sm mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
};

export default SelectForm;
