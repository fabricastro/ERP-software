import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../../services/CustomerService';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import Alert from '../../pages/UiElements/Alerts';
import Loader from '../../common/Loader';
const customerEdit = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [customer, setcustomer] = useState<any | null>(null);
    const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchcustomer = async () => {
            try {
                const data = await customerService.getById(id);
                setcustomer(data);
            } catch (error) {
                console.error('Error al obtener el proveedor:', error);
            }
        };
        fetchcustomer();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await customerService.updateCustomer(id, customer);
            setAlert({ type: 'success', title: 'Éxito', message: 'Proveedor actualizado correctamente' });
            setTimeout(() => {
                navigate('/customer');
            }, 2000);
        } catch (error) {
            setAlert({ type: 'error', title: 'Error', message: 'No se pudo actualizar el proveedor' });
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setcustomer((prevcustomer: any) => ({
            ...prevcustomer,
            [name]: value,
        }));
    };

    if (!customer) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar Proveedor" />
            <div className="flex flex-col gap-5.5 p-6.5">
                {alert && <Alert type={alert.type} title={alert.title} message={alert.message} />}
                <form onSubmit={handleUpdate}>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Tipo de Proveedor:</label>
                        <select
                            name="type"
                            value={customer.type}
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
                            type="text"
                            name="name"
                            value={customer.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">CUIT:</label>
                        <input
                            type="text"
                            name="cuit"
                            value={customer.cuit}
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
                            value={customer.fiscalAddress}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Código Postal:</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={customer.postalCode}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Localidad/Comunidad:</label>
                        <input
                            type="text"
                            name="community"
                            value={customer.community}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Provincia:</label>
                        <input
                            type="text"
                            name="province"
                            value={customer.province}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">País:</label>
                        <input
                            type="text"
                            name="country"
                            value={customer.country}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Teléfono:</label>
                        <input
                            type="text"
                            name="phone"
                            value={customer.phone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Correo Electrónico:</label>
                        <input
                            type="email"
                            name="email"
                            value={customer.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Página Web:</label>
                        <input
                            type="text"
                            name="web"
                            value={customer.web}
                            onChange={handleChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <button className="mt-10 inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90" type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default customerEdit;
