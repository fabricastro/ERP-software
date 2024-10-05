import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuth } from '../../context/AuthContext';
import { updateUserService } from '../../services/user';

const Settings = () => {
    const { user } = useAuth();
    const [bussinessName, setBussinessName] = useState(user?.bussinessName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUserService(user.id, { bussinessName, email, phone, password });
            setSuccess('Datos actualizados correctamente');
            setError(null);
        } catch (error: any) {
            setError(error.message);
            setSuccess(null);
        }
    };

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-270">
                <Breadcrumb pageName="Configuración" />

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-5 xl:col-span-3">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">Información</h3>
                            </div>
                            <div className="p-7">
                                <form onSubmit={handleSubmit}>
                                    {error && <p className="text-red-500">{error}</p>}
                                    {success && <p className="text-green-500">{success}</p>}

                                    <div className="mb-5.5">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="bussinessName"
                                        >
                                            Nombre de Empresa
                                        </label>
                                        <input
                                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            type="text"
                                            id="bussinessName"
                                            value={bussinessName}
                                            onChange={(e) => setBussinessName(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-5.5">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="emailAddress"
                                        >
                                            Correo Electrónico
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="email"
                                                id="emailAddress"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                        <div className="w-full">
                                            <label
                                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                                htmlFor="phoneNumber"
                                            >
                                                Número de Teléfono
                                            </label>
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="text"
                                                id="phoneNumber"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Campo de cambio de contraseña */}
                                    <div className="mb-5.5">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                                            htmlFor="password"
                                        >
                                            Cambiar Contraseña
                                        </label>
                                        <input
                                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Ingresa una nueva contraseña (opcional)"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4.5">
                                        <button
                                            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                            type="button"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                            type="submit"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-span-5 xl:col-span-2">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">Imagen de Perfil</h3>
                            </div>
                            <div className="p-7">
                                <form action="#">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="h-14 w-14 rounded-full">
                                            <img src={userThree} alt="User" />
                                        </div>
                                        <div>
                                            <span className="mb-1.5 text-black dark:text-white">Edita tu imagen</span>
                                            <span className="flex gap-2.5">
                                                <button className="text-sm hover:text-primary">Borrar</button>
                                                <button className="text-sm hover:text-primary">Actualizar</button>
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Settings;
