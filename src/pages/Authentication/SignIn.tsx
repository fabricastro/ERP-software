import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoDark from '../../images/logo/logo-dark.png';
import Logo from '../../images/logo/logo.png';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'admin@example.com' && password === 'admin123') {
      login(); 
      navigate('/');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-[100vh] items-center justify-center flex">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <Link className="mb-5.5 flex justify-center" to="/">
              <img className="hidden dark:block w-[50%]" src={Logo} alt="Logo" />
              <img className="dark:hidden w-[50%]" src={LogoDark} alt="Logo" />
            </Link>
            <p className="2xl:px-20">Todo en un solo lugar.</p>
            <span className="mt-15 inline-block">
              {/* SVG o imagen que ya estabas usando */}
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">Empieza hoy</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Inicia sesión en tu cuenta
            </h2>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                  <span className="absolute right-4 top-4">
                    {/* Icono de correo */}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6+ Caracteres, 1 Mayúscula"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                  <span className="absolute right-4 top-4">
                    {/* Icono de contraseña */}
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Iniciar Sesión"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>

            <div className="mt-6 text-center">
              <p>
                ¿No tienes cuenta aún?{' '}
                <Link to="/auth/signup" className="text-primary">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
