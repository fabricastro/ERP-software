import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoDark from '/logohorizontal.png';
import Logo from '/logo-white.png';
import FormInput from '../../components/Input/input';
import Loader from '../../common/Loader';
import { resetPassword } from '../../services/user';
import { useAuth } from '../../context/AuthContext';

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const { login } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordDuplicate, setPasswordDuplicate] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            const decodedToken = JSON.parse(atob(tokenFromUrl.split('.')[1]));
            setEmail(decodedToken.email);
        } else {
            setError('Token de recuperación no encontrado en la URL.');
        }
    }, [location.search]);

    useEffect(() => {
        validateForm();
    }, [password, passwordDuplicate]);
    
    const validateForm = () => {
        const isPasswordValid = password.trim() !== '';
        const isPasswordDuplicateValid = password === passwordDuplicate;
        setIsFormValid(isPasswordValid && isPasswordDuplicateValid);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!token) {
            setError('Token no válido o no encontrado.');
            setLoading(false);
            return;
        }

        try {
            await resetPassword(token, password);
            setLoading(false);
            setSuccessMessage('Tu contraseña ha sido cambiada exitosamente.');
            await login(email, password, undefined); 
        } catch (err: any) {
            setError(err.message || 'Hubo un error al intentar cambiar la contraseña.');
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
                        <p className="2xl:px-20">Restablecimiento de contraseña.</p>
                    </div>
                </div>

                <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                    <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
                        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                            Cambiar contraseña
                        </h2>
                        {loading ? (
                            <Loader />
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {error && <p className="text-black bg-red-200 rounded-md mb-4 p-4">{error}</p>}
                                {successMessage && <p className="text-black bg-green-200 rounded-md mb-4 p-4">{successMessage}</p>}

                                <FormInput
                                    id="password"
                                    type="password"
                                    label="Nueva contraseña"
                                    placeholder="Ingresa tu nueva contraseña"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validateForm();
                                    }}
                                    required
                                />
                                
                                <FormInput
                                    id="passwordDuplicate"
                                    type="password"
                                    label="Repetir contraseña"
                                    placeholder="Vuelve a ingresar tu nueva contraseña"
                                    value={passwordDuplicate}
                                    onChange={(e) => {
                                        setPasswordDuplicate(e.target.value);
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
                                        value="Cambiar Contraseña"
                                        disabled={!isFormValid}
                                        title="Cambiar Contraseña"
                                        className={`w-full cursor-pointer rounded-lg border font-semibold text-xl border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    />
                                    {!isFormValid && showTooltip && (
                                        <div className="absolute z-999 top-[-40px] left-1/2 transform -translate-x-1/2 px-3 py-2 bg-white text-black text-sm rounded-lg shadow-lg">
                                            Asegúrate de que ambas contraseñas coincidan.
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

export default ResetPassword;