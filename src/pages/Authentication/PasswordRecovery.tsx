import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoDark from '/logohorizontal.png';
import Logo from '/logo-white.png';
import FormInput from '../../components/Input/input';
import Loader from '../../common/Loader';

const PasswordRecovery: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const validateForm = () => {
        const isEmailValid = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setIsFormValid(isEmailValid);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Simulación de llamada a la API de recuperación de contraseña
        try {
            if (!email) throw new Error('El campo de correo electrónico es obligatorio.');
            // Llamada a la API para enviar el enlace de recuperación
            // Ejemplo: await sendPasswordRecoveryEmail(email);
            setLoading(false);
            setSuccessMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        } catch (err: any) {
            setError(err.message || 'Hubo un error al intentar enviar el correo de recuperación.');
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
                        <p className="2xl:px-20">Recupera tu acceso en pocos pasos.</p>
                    </div>
                </div>

                <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                    <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
                        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                            Recupera tu Contraseña
                        </h2>
                        {loading ? (
                            <Loader />
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {error && <p className="text-black bg-red-200 rounded-md mb-4 p-4">{error}</p>}
                                {successMessage && <p className="text-black bg-green-200 rounded-md mb-4 p-4">{successMessage}</p>}

                                <FormInput
                                    id="email"
                                    type="email"
                                    label="Correo electrónico"
                                    placeholder="Ingresa tu correo electrónico"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        validateForm();
                                    }}
                                    required
                                />

                                <div
                                    className="mb-2 relative"
                                    onMouseEnter={() => !isFormValid && setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <input
                                        type="submit"
                                        value="Recuperar Contraseña"
                                        disabled={!isFormValid}
                                        title="Recuperar Contraseña"
                                        className={`w-full cursor-pointer rounded-lg border font-semibold text-xl border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    />
                                    {!isFormValid && showTooltip && (
                                        <div className="absolute z-999 top-[-40px] left-1/2 transform -translate-x-1/2 px-3 py-2 bg-white text-black text-sm rounded-lg shadow-lg">
                                            Por favor, ingresa un correo electrónico válido
                                        </div>
                                    )}
                                </div>

                                <p className='mt-4 text text-center'>
                                    <Link to="/signin" className="text-primary">
                                        Volver al inicio de sesión
                                    </Link>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordRecovery;
