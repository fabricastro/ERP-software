import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { providerService } from '../../services/ProviderService';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import Alert from '../../pages/UiElements/Alerts';
import Loader from '../../common/Loader';

const ProviderEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState<any | null>(null);
    const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await providerService.updateProvider(id, provider);
            setAlert({ type: 'success', title: 'Éxito', message: 'Proveedor actualizado correctamente' });
            setTimeout(() => {
                navigate('/provider');
            }, 2000);
        } catch (error) {
            setAlert({ type: 'error', title: 'Error', message: 'No se pudo actualizar el proveedor' });
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProvider((prevProvider: any) => ({
            ...prevProvider,
            [name]: value,
        }));
    };

    if (!provider) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar Proveedor" />
            <div className="flex flex-col gap-5.5 p-6.5">
                {alert && <Alert type={alert.type} title={alert.title} message={alert.message} />}
                <form onSubmit={handleUpdate}>
                    <div className='grid grid-cols-1 gap-15 md:grid-cols-2'>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">Tipo de Proveedor:</label>
                            <select
                                name="type"
                                value={provider.type}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            >
                                <option value="Persona Humana">Persona Humana</option>
                                <option value="Persona Jurídica">Persona Jurídica</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Nombre:</label>
                            <input
                                placeholder='Ingrese el nombre del proveedor'
                                type="text"
                                name="name"
                                value={provider.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">CUIT:</label>
                            <input
                                placeholder='Ingrese el CUIT'
                                type="text"
                                name="cuit"
                                value={provider.cuit}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Dirección Fiscal:</label>
                            <input
                                placeholder='Ingrese la dirección fiscal'
                                type="text"
                                name="fiscalAddress"
                                value={provider.fiscalAddress}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Código Postal:</label>
                            <input
                                placeholder='Ingrese el Código Postal'
                                type="text"
                                name="postalCode"
                                value={provider.postalCode}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Localidad/Comunidad:</label>
                            <input
                                placeholder='Ingrese la localidad/comunidad'
                                type="text"
                                name="community"
                                value={provider.community}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Provincia:</label>
                            <input
                                placeholder='Ingrese la provincia'
                                type="text"
                                name="province"
                                value={provider.province}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">País:</label>
                            <input
                                placeholder='Ingrese el país'
                                type="text"
                                name="country"
                                value={provider.country}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Teléfono:</label>
                            <input
                                placeholder='Ingrese el número de teléfono'
                                type="text"
                                name="phone"
                                value={provider.phone}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Correo Electrónico:</label>
                            <input
                                placeholder='Ingrese el correo electronico'
                                type="email"
                                name="email"
                                value={provider.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Página Web:</label>
                            <input
                                placeholder='Ingrese la página web'
                                type="text"
                                name="web"
                                value={provider.web}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>
                    </div>
                    <button className="mt-10 inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90" type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default ProviderEdit;
