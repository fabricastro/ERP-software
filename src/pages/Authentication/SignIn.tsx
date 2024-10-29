import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../common/Loader';
import LogoDark from '/logohorizontal.png';
import Logo from '/logo-white.png';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Validar campos antes de enviarlos
    if (!email || !password) {
      setError('El email y la contraseña son obligatorios');
      return;
    }

    try {
      await login(email, password);
      setLoading(false);
      setError(null);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-[100vh] flex items-center justify-center">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <Link className="mb-5.5 flex justify-center" to="/">
              <img className="hidden dark:block w-[50%]" src={Logo} alt="Logo" />
              <img className="dark:hidden w-[50%]" src={LogoDark} alt="Logo" />
            </Link>
            <p className="2xl:px-20">Todo en un solo lugar.</p>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Inicia sesión en tu cuenta
            </h2>
            {loading ? <Loader /> : (
              <form onSubmit={handleSubmit}>
                {error && <p className="text-red-500">{error}</p>}  {/* Mostrar el error */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6+ Caracteres, 1 Mayúscula"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Iniciar Sesión"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                  <p className='mt-4 text text-center'>Olvidaste tu contraseña? {''}
                    <Link to="/recover" className="text-primary">
                      Recuperar Contraseña
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
          <div className="mt-6 text-center">
            <p>
              ¿No tienes cuenta aún?{' '}
              <Link to="/signup" className="text-primary">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
