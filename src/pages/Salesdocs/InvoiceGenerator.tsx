import React, { useEffect, useState } from 'react';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';
import { useTranslation } from 'react-i18next';
import { salesDocsService } from '../../services/SalesDocsService';
import { customerService } from '../../services/CustomerService'; // Importar el servicio de clientes
import { useBusiness } from '../../context/BusinessContext';
import Alert from '../UiElements/Alerts';
import ItemForm from './ItemForm';

const InvoiceGenerator: React.FC = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [state, setState] = useState('Borrador');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [validityDate, setValidityDate] = useState('');
    const [customerId, setCustomerId] = useState<number | null>(null);
    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientCUIT, setClientCUIT] = useState('');
    const [clientTaxStatus, setClientTaxStatus] = useState('Exento');
    const [paymentCondition, setPaymentCondition] = useState('Efectivo');
    const [observations, setObservations] = useState('');
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);

    const { t } = useTranslation();
    const business = useBusiness();

    useEffect(() => {
        const fetchCustomersAndInvoiceNumber = async () => {
            try {
                const customerData = await customerService.getAll();
                setCustomers(customerData);

                // Obtener el último número de presupuesto del localStorage
                const lastInvoiceNumber = localStorage.getItem('lastInvoiceNumber');
                const nextInvoiceNumber = lastInvoiceNumber ? parseInt(lastInvoiceNumber, 10) + 1 : 1;
                setInvoiceNumber(`AAA${nextInvoiceNumber}`);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };
        fetchCustomersAndInvoiceNumber();
    }, []);

    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCustomerId = Number(e.target.value);
        setCustomerId(selectedCustomerId);

        const selectedCustomer = customers.find(customer => customer.id === selectedCustomerId);
        if (selectedCustomer) {
            setClientName(selectedCustomer.name);
            setClientAddress(selectedCustomer.fiscalAddress);
            setClientPhone(selectedCustomer.phone);
            setClientCUIT(selectedCustomer.cuit);
            setClientTaxStatus('Exento');
        }
    };

    const calculateIVA = () => {
        const net = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        return Math.round(net * 0.21 * 100) / 100;
    };

    const calculateTotal = () => {
        const net = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        return Math.round(net * 100) / 100;
    };

    const generatePDF = () => {
        if (!business) return;

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
                name: clientName,
                address: clientAddress,
                phone: clientPhone,
                otherInfo: clientCUIT,
            },
            invoice: {
                label: "Factura #: ",
                num: invoiceNumber,
                invDate: `Fecha: ${invoiceDate}`,
                invGenDate: `Validez: ${validityDate}`,
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

    const guardarFactura = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await salesDocsService.addSalesDoc({
                type: "presupuesto",
                customerId: customerId || 1,
                state: state,
                paymentMethod: paymentCondition,
                date: invoiceDate,
                validityDate: validityDate,
                number: invoiceNumber,
                observations: observations,
                net: items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
                iva: calculateIVA(),
                amount: calculateTotal(),
            });
            setAlert({ type: 'success', message: 'Factura guardada con éxito' });
            setLoading(false);

            // Limpiar campos
            setState('');
            setInvoiceNumber('');
            setInvoiceDate('');
            setClientName('');
            setClientAddress('');
            setClientPhone('');
            setClientCUIT('');
            setClientTaxStatus('Exento');
            setPaymentCondition('Efectivo');
            setObservations('');
            setItems([]); // Limpiar los items
        } catch (error: any) {
            setLoading(false);
            setAlert({ type: 'error', message: 'Hubo un error al guardar la factura. Por favor, inténtalo de nuevo.' });
        }
    };

    return (
        <div className="flex flex-col gap-5.5 p-6.5">
            <h1>{t('billGen')}</h1>
            {loading && <p>Cargando...</p>}
            {alert && (
                <Alert
                    type={alert.type}
                    title={alert.type === 'success' ? 'Éxito' : 'Error'}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className='grid grid-cols-2 gap-5'>
                <div>
                    <label className='mb-3 block text-black dark:text-white'>Selecciona un cliente:</label>
                    <select
                        value={customerId || ''}
                        onChange={handleCustomerChange}
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

                <div>
                    <label className='mb-3 block text-black dark:text-white'>Nº de Presupuesto:</label>
                    <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                        disabled
                    />
                </div>

                <div>
                    <label className='mb-3 block text-black dark:text-white'>Estado</label>
                    <select className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black" value={state} onChange={(e) => setState(e.target.value)}>
                        <option value="Borrador">Borrador</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
                        <option value="Facturado">Facturado</option>
                    </select>
                </div>

                <div>
                    <label className='mb-3 block text-black dark:text-white' >Fecha:</label>
                    <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>

                <div>
                    <label className='mb-3 block text-black dark:text-white' >Validez:</label>
                    <input
                        type="date"
                        value={validityDate}
                        onChange={(e) => setValidityDate(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>
            </div>
            <h2>Cliente</h2>
            <div className='grid grid-cols-2 gap-5'>
                <div>
                    <label className='mb-3 block text-black dark:text-white' >Razón Social:</label>
                    <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>

                <div>
                    <label className='mb-3 block text-black dark:text-white' >Domicilio:</label>
                    <input
                        type="text"
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>

                <div>
                    <label className='mb-3 block text-black dark:text-white' >Teléfono:</label>
                    <input
                        type="text"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>

                <div>
                    <label className='mb-3 block text-black dark:text-white' >CUIT:</label>
                    <input
                        type="text"
                        value={clientCUIT}
                        onChange={(e) => setClientCUIT(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>

                <div>
                    <label className='mb-3 block text-black dark:text-white'>Condición de IVA:</label>
                    <input
                        type="text"
                        value={clientTaxStatus}
                        onChange={(e) => setClientTaxStatus(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>

                <div>
                    <label className='mb-3 block text-black dark:text-white'>Condición de venta:</label>
                    <input
                        type="text"
                        value={paymentCondition}
                        onChange={(e) => setPaymentCondition(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                    />
                </div>
            </div>

            {/* Componente de ítems */}
            <ItemForm items={items} setItems={setItems} />

            {/* Total */}
            <div className="mt-4 flex justify-end">
                <h2 className='border p-4 mr-18'>Total: ${calculateTotal()}</h2>
            </div>

            {/* Botones para guardar y generar PDF */}
            <div className="mt-4">
                <button
                    className="px-6 py-3 bg-green-500 text-white rounded"
                    onClick={guardarFactura}
                >
                    Guardar Factura
                </button>
            </div>
        </div>
    );
};

export default InvoiceGenerator;
