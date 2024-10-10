import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { salesDocsService } from '../../services/SalesDocsService';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import Alert from '../../pages/UiElements/Alerts';
import Loader from '../../common/Loader';

const SalesDocEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [salesDoc, setSalesDoc] = useState<any | null>(null);
    const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSalesDoc = async () => {
            try {
                const data = await salesDocsService.getById(Number(id));
                setSalesDoc(data);  // Actualiza el estado con los datos obtenidos
            } catch (error) {
                console.error('Error al obtener el documento de venta:', error);
            }
        };
        fetchSalesDoc();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await salesDocsService.updateSalesDoc(Number(id), salesDoc);
            setAlert({ type: 'success', title: 'Éxito', message: 'Documento de venta actualizado correctamente' });
            setTimeout(() => {
                navigate('/salesdocs');
            }, 2000);
        } catch (error) {
            setAlert({ type: 'error', title: 'Error', message: 'No se pudo actualizar el documento de venta' });
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSalesDoc((prevSalesDoc: any) => ({
            ...prevSalesDoc,
            [name]: name === "net" || name === "iva" || name === "amount" ? Number(value) : value,
        }));
    };

    if (!salesDoc) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar Documento de Venta" />
            <div className="flex flex-col gap-5.5 p-6.5">
                {alert && <Alert type={alert.type} title={alert.title} message={alert.message} />}
                <form onSubmit={handleUpdate}>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Tipo de Documento:</label>
                        <select
                            name="type"
                            value={salesDoc.type || ''}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        >
                            <option value="presupuesto">Presupuesto</option>
                            <option value="factura">Factura</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">ID del Cliente:</label>
                        <input
                            type="number"
                            name="customerId"
                            value={salesDoc.customerId || ''}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Estado:</label>
                        <select
                            name="state"
                            value={salesDoc.state || ''}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        >
                            <option value="Borrador">Borrador</option>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Método de Pago:</label>
                        <select
                            name="paymentMethod"
                            value={salesDoc.paymentMethod || ''}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        >
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta">Tarjeta</option>
                            <option value="Transferencia">Transferencia</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Fecha del Documento:</label>
                        <input
                            type="date"
                            name="date"
                            value={salesDoc.date || ''}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Fecha de Validez:</label>
                        <input
                            type="date"
                            name="validityDate"
                            value={salesDoc.validityDate || ''}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Número de Documento:</label>
                        <input
                            type="text"
                            name="number"
                            value={salesDoc.number || ''}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Observaciones:</label>
                        <textarea
                            name="observations"
                            value={salesDoc.observations || ''}
                            onChange={handleChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Neto:</label>
                        <input
                            type="number"
                            name="net"
                            value={salesDoc.net || 0}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">IVA:</label>
                        <input
                            type="number"
                            name="iva"
                            value={salesDoc.iva || 0}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Monto Total:</label>
                        <input
                            type="number"
                            name="amount"
                            value={salesDoc.amount || 0}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <button
                        className="mt-10 inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default SalesDocEdit;
