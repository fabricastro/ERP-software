import React, { useState, useEffect } from "react";

// Definimos la interfaz de las props
interface FormInputProps {
  label: string;
  type?: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  additionalClasses?: string;
  required?: boolean;
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
}) => {
  // Estado para manejar el error
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<boolean>(false);

  // Función para validar los campos según el tipo
  const validate = () => {
    let errorMessage = null;

    // Verificamos que el campo no esté vacío si es requerido
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
    } else if (type === "password") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(String(value))) {
        errorMessage =
          "Debe tener al menos 8 caracteres, incluyendo letras y números.";
      }
    }

    setError(errorMessage);
  };

  // Ejecutar validación cuando el valor o el tipo cambian si ha sido tocado
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
      <div className="relative h-16">
        <input
          className="w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary 
          focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          type={type}
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e);
            setError(null); // Limpiar el error al cambiar el valor
          }}
          placeholder={placeholder}
          onBlur={() => {
            setTouched(true); // Marca el input como tocado al perder el foco
            validate();
          }}
          onFocus={() => setTouched(true)} // Marca el input como tocado al obtener el foco
        />
        <span
          className={`text-red-500 text-sm transition-opacity duration-300 ${
            error ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {error}
        </span>
      </div>
    </div>
  );
};

export default FormInput;
