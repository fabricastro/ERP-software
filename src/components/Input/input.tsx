import React, { useState, useEffect } from "react";

interface FormInputProps {
  label: string;
  type?: string;
  id: string;
  name?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  placeholder?: string;
  additionalClasses?: string;
  required?: boolean;
  disabled?: boolean;
  options?: string[] | { label: string; value: string | number }[];
  add?: string;
  onButtonClick?: () => void;
  buttonLabel?: string;
  className?: string;
}


const FormInput: React.FC<FormInputProps> = ({
  label,
  type = "text",
  id,
  value,
  onChange,
  placeholder = "",
  additionalClasses = "",
  required = false,
  disabled = false,
  options = [],
  onButtonClick, // Nueva propiedad
  buttonLabel = "Agregar" // Nueva propiedad con un valor por defecto
}) => {
  // Estado para manejar el error
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<boolean>(false);

  const validate = () => {
    let errorMessage = null;

    if (required && String(value).trim() === "") {
      errorMessage = "Este campo es obligatorio.";
    } else if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        errorMessage = "Por favor, ingrese un correo electrónico válido.";
      }
    } else if (type === "number") {
      if (isNaN(Number(value))) {
        errorMessage = "Por favor, ingrese un número válido.";
      }
    }

    setError(errorMessage);
  };

  useEffect(() => {
    if (touched) {
      validate();
    }
  }, [value, type]);

  return (
    <div className={`mb-5.5 ${additionalClasses}`}>
      <label
        className="mb-3 block text-sm font-medium text-black dark:text-white"
        htmlFor={id}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative h-16 flex flex-col">
        <div className="flex w-full">
          {/* Verificamos si es un select o input */}
          {options && options.length > 0 ? (
            <select
              className={`w-full rounded border border-stroke py-3 px-4.5 h-[52px] text-black focus:border-primary 
            focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary 
            ${disabled ? 'bg-[#f0f3f6] dark:bg-[#313d4a] dark:text-white' : 'bg-white dark:bg-meta-4'}`}
              id={id}
              value={value}
              onChange={(e) => {
                onChange(e as React.ChangeEvent<HTMLSelectElement>);
                setError(null); // Limpiar el error al cambiar el valor
              }}
              disabled={disabled}
              onBlur={() => {
                setTouched(true);
                validate();
              }}
            >
              <option value="">Selecciona una opción</option>
              {options.map((option, idx) =>
                typeof option === 'string' ? (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ) : (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                )
              )}
            </select>
          ) : (
            <input
              className="w-full rounded border h-[52px] border-stroke py-3 px-4.5 text-black focus:border-primary 
            focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type={type}
              id={id}
              value={value}
              onChange={(e) => {
                onChange(e as React.ChangeEvent<HTMLInputElement>);
                setError(null); // Limpiar el error al cambiar el valor
              }}
              placeholder={placeholder}
              disabled={disabled}
              onBlur={() => {
                setTouched(true);
                validate();
              }}
              onFocus={() => setTouched(true)}
            />
          )}

          {/* Botón opcional */}
          {onButtonClick && (
            <button
              type="button"
              onClick={onButtonClick}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {buttonLabel}
            </button>
          )}
        </div>
        <div className="text-left items-start">

          {/* Mensaje de error */}
          <span
            className={`text-red-500 text-sm transition-opacity duration-300 ${error ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
          >
            {error}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormInput;