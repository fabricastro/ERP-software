import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '/logohorizontal.png';
import Logo from '/logo-white.png';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../common/Loader';
import FormInput from '../../components/Input/input';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const isEmailValid = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isBusinessNameValid = name.trim() !== '';
    const isPhoneValid = phone.trim() !== '';

    setIsFormValid(isEmailValid && isBusinessNameValid && isPhoneValid);
  };

  useEffect(() => {
    validateForm();
  }, [email, name, phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const message = await register({ name, email, phone });
      setLoading(false);
      setSuccessMessage(message);
      setError(null);
      navigate('/auth/confirmemail');
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      setSuccessMessage(null);
    }
  };

  return (
    <>
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
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              {loading ? (
                <Loader />
              ) : (
                <>
                  <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Registrate Ahora
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <FormInput
                        id="name"
                        type="text"
                        label="Nombre o Razón Social"
                        placeholder="Ingresa tu nombre o razón social"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <FormInput
                        id="email"
                        type="email"
                        label="Correo Electrónico"
                        placeholder="Ingresa tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <FormInput
                        id="phone"
                        type="text"
                        label="Teléfono"
                        placeholder="Ingresa tu número de celular"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    {error && <p className="text-black bg-red-200 rounded-md mb-4 p-4">{error}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}

                    <div
                      className="mb-4 relative"
                      onMouseEnter={() => !isFormValid && setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <input
                        type="submit"
                        value="Crear cuenta"
                        disabled={!isFormValid}
                        title="Crear cuenta"
                        className={`w-full cursor-pointer rounded-lg border  font-semibold text-xl border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 ${
                          !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                      {!isFormValid && showTooltip && (
                        <div className="absolute z-999 top-[-40px] left-1/2 transform -translate-x-1/2 px-3 py-2 bg-white text-black text-sm rounded-lg shadow-lg">
                          Por favor, completa los campos obligatorios
                        </div>
                      )}
                    </div>

                    <div className="mt-6 text-center">
                      <p>
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/signin" className="text-primary">
                          Iniciar Sesión
                        </Link>
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
