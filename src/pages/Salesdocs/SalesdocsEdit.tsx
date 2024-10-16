
import React, { useEffect, useState } from 'react';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';
import { useParams, useNavigate } from 'react-router-dom';
import { salesDocsService } from '../../services/SalesDocsService';
import { customerService } from '../../services/CustomerService';
import { useBusiness } from '../../context/BusinessContext';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import Alert from '../UiElements/Alerts';
import ItemForm from './ItemForm';  
import Loader from '../../common/Loader';

const SalesDocEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const business = useBusiness();

    const [salesDoc, setSalesDoc] = useState<any | null>(null);
    const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);

    // Cargar los clientes
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customerData = await customerService.getAll();
                setCustomers(customerData);
            } catch (error) {
                console.error('Error al cargar los clientes:', error);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchSalesDoc = async () => {
            try {
                const data = await salesDocsService.getById(Number(id));
                console.log('Data del presupuesto:', data); 
                setSalesDoc(data);
                setItems(data.items || []);
            } catch (error) {
                console.error('Error al cargar el documento de venta:', error);
            }
        };
        fetchSalesDoc();
    }, [id]);
    
    

    const calculateIVA = () => {
        const net = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        return Math.round(net * 0.21 * 100) / 100;
    };

    const calculateTotal = () => {
        const net = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        return Math.round(net * 100) / 100;
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSalesDoc((prevSalesDoc: any) => ({
            ...prevSalesDoc,
            [name]: value,
        }));
    };

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const updatedItems = [...items];
        const parsedValue = name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value;
        updatedItems[index] = { ...updatedItems[index], [name]: parsedValue };
        setItems(updatedItems);
    };

    const generatePDF = () => {
        if (!business || !salesDoc) return;

        const props = {
            outputType: OutputType.Save,
            returnJsPDFDocObject: true,
            fileName: "Invoice",
            orientationLandscape: false,
            compress: true,
            logo: {
                src: business.logo,
                width: 53.33,
                height: 26.66,
            },
            business: {
                name: business.name,
                address: business.address,
                phone: business.phone,
                email: business.email,
                website: business.website,
            },
            contact: {
                label: "Factura emitida por:",
                name: salesDoc.clientName,
                address: salesDoc.clientAddress,
                phone: salesDoc.clientPhone,
                otherInfo: salesDoc.clientCUIT,
            },
            invoice: {
                label: "Factura #: ",
                num: salesDoc.number,
                invDate: `Fecha: ${salesDoc.date}`,
                invGenDate: `Validez: ${salesDoc.validityDate}`,
                table: items.map((item, index) => [
                    index + 1,
                    item.description,
                    item.quantity,
                    item.unitPrice,
                    (item.quantity * item.unitPrice).toFixed(2)
                ]),
                additionalRows: [
                    {
                        col1: 'Importe Total:',
                        col2: calculateTotal(),
                        col3: '$',
                        style: { fontSize: 14 }
                    }
                ],
            },
            footer: {
                text: "Powered by Technodevs.",
            },
            pageEnable: true,
            pageLabel: "Page ",
        };

        jsPDFInvoiceTemplate(props);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await salesDocsService.updateSalesDoc(Number(id), {
                ...salesDoc,
                items,
                net: calculateTotal(),
                iva: calculateIVA(),
                amount: calculateTotal(),
            });

            setAlert({ type: 'success', message: 'Documento de venta actualizado con éxito' });
            setTimeout(() => {
                navigate('/salesdocs');
            }, 2000);
        } catch (error: any) {
            setAlert({ type: 'error', message: 'Error al actualizar el documento' });
            setLoading(false);
        }
    };

    if (!salesDoc) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar Documento de Venta" />
            <div className="flex flex-col gap-5.5 p-6.5">
                {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} />}
                <form onSubmit={handleUpdate}>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="mb-3 block text-black dark:text-white">Nº de Documento:</label>
                            <input
                                type="text"
                                name="number"
                                value={salesDoc.number}
                                onChange={handleFieldChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Fecha del Documento:</label>
                            <input
                                type="date"
                                name="date"
                                value={salesDoc.date}
                                onChange={handleFieldChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Validez:</label>
                            <input
                                type="date"
                                name="validityDate"
                                value={salesDoc.validityDate}
                                onChange={handleFieldChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Estado:</label>
                            <select
                                name="state"
                                value={salesDoc.state}
                                onChange={handleFieldChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                            >
                                <option value="Borrador">Borrador</option>
                                <option value="Enviado">Enviado</option>
                                <option value="Aprobado">Aprobado</option>
                                <option value="Rechazado">Rechazado</option>
                                <option value="Facturado">Facturado</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">Cliente:</label>
                            <select
                                name="customerId"
                                value={salesDoc.customerId}
                                onChange={handleFieldChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                            >
                                <option value="">Seleccionar cliente</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h2>Ítems</h2>
                    <ItemForm items={items} setItems={setItems} />

                    <button type="submit" className="mt-10 inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white">
                        Guardar Cambios
                    </button>

                    <button type="button" onClick={generatePDF} className="mt-4 ml-4 inline-flex items-center justify-center rounded-full bg-secondary py-4 px-10 text-center font-medium text-white">
                        Generar PDF
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default SalesDocEdit;
