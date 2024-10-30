import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../common/Loader';
import LogoDark from '/logohorizontal.png';
import Logo from '/logo-white.png';
import FormInput from '../../components/Input/input';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const isEmailValid = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.trim() !== '';

    setIsFormValid(isEmailValid && isPasswordValid);
  };

  useEffect(() => {
    validateForm();
  }, [email, password]);

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
            <div className="mb-5.5 flex justify-center">
              <img className="hidden dark:block w-[50%]" src={Logo} alt="Logo" />
              <img className="dark:hidden w-[50%]" src={LogoDark} alt="Logo" />
            </div>
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
                    {error && <p className="text-black bg-red-200 rounded-md mb-4 p-4">{error}</p>}
                    <FormInput
                        id="email"
                        type="email"
                        label="Correo electrónico"
                        placeholder="Ingresa tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FormInput
                        id="password"
                        type="password"
                        label="Contraseña"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                <div 
                  className="mb-2 relative" 
                  onMouseEnter={() => !isFormValid && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <input
                    type="submit"
                    value="Iniciar sesión"
                    disabled={!isFormValid}
                    title="Iniciar sesión"
                    className={`w-full cursor-pointer rounded-lg border font-semibold text-xl border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 ${
                      !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                  {!isFormValid && showTooltip && (
                    <div className="absolute z-999 top-[-40px] left-1/2 transform -translate-x-1/2 px-3 py-2 bg-white text-black text-sm rounded-lg shadow-lg">
                      Por favor, ingresa un correo electrónico y una contraseña
                    </div>
                  )}
                </div>
                  <p className='mt-4 text text-center'>Olvidaste tu contraseña? {''}
                    <Link to="/recovery" className="text-primary">
                      Recuperar Contraseña
                    </Link>
                  <p className='mt-6'>
                    ¿No tienes cuenta aún?{' '}
                    <Link to="/signup" className="text-primary">
                      Regístrate
                    </Link>
                  </p>
                  </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
