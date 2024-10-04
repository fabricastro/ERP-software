import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { providerService } from '../../services/ProviderService';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import Alert from '../../pages/UiElements/Alerts';

const ProviderEdit = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [provider, setProvider] = useState<any | null>(null); // Estado para el proveedor
    const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null);

    
    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const data = await providerService.getById(id);
                setProvider(data);
            } catch (error) {
                console.error('Error al obtener el proveedor:', error);
            }
        };
        fetchProvider();
    }, [id]);

    // Actualizar el proveedor
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await providerService.update(id, provider);
            setAlert({ type: 'success', title: 'Éxito', message: 'Proveedor actualizado correctamente' });
            setTimeout(() => {
                navigate('/providers');
            }, 2000);
        } catch (error) {
            setAlert({ type: 'error', title: 'Error', message: 'No se pudo actualizar el proveedor' });
        }
    };

    // Manejar los cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProvider((prevProvider: any) => ({
            ...prevProvider,
            [name]: value,
        }));
    };

    if (!provider) {
        return <p>Cargando datos del proveedor...</p>;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar Proveedor" />
            <div className="flex flex-col gap-5.5 p-6.5">
                {alert && <Alert type={alert.type} title={alert.title} message={alert.message} />}
                <form onSubmit={handleUpdate}>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Nombre:</label>
                        <input
                            type="text"
                            name="name"
                            value={provider.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={provider.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Teléfono:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={provider.phone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Dirección Fiscal:</label>
                        <input
                            type="text"
                            name="fiscalAddress"
                            value={provider.fiscalAddress}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-4.5">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default ProviderEdit;
