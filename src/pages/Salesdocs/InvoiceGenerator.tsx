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
        console.log("Datos de negocio recibidos en InvoiceGenerator:", business);
    }, [business]);

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
        if (!business || !business.logo) {
            console.error("Faltan datos de negocio o logo.");
            return;
        }
    
        if (!clientName || !clientAddress || !clientPhone || !clientCUIT) {
            console.error("Faltan datos del cliente.");
            return;
        }
    
        if (items.length === 0) {
            console.error("No hay ítems en la factura.");
            return;
        }
    
        const tableHeaders = [
            { title: "#", style: { width: 10 } }, 
            { title: "Descripción", style: { width: 70 } }, 
            { title: "Cantidad", style: { width: 30 } }, 
            { title: "Precio unitario", style: { width: 40 } },
            { title: "Total", style: { width: 40 } }
        ];
    
        const tableRows = items.map((item, index) => [
            String(index + 1),
            String(item.description || 'Sin descripción'),
            String(item.quantity || 0),
            String(item.unitPrice || 0),
            String((item.quantity * item.unitPrice).toFixed(2))
        ]);
    
        const props = {
            outputType: "save",
            returnJsPDFDocObject: true,
            fileName: "Presupuesto",
            orientationLandscape: false,
            compress: true,
            logo: {
                src: business.logo, 
                width: 60,
                height: 20,
                margin: { top: 0, left: 0 }
            },
            business: {
                name: business.name || 'N/A',
                address: business.address || 'N/A',
                phone: business.phone || 'N/A',
                email: business.email || 'N/A',
                website: business.website || 'N/A',
            },
            contact: {
                label: "Factura emitida por:",
                name: clientName || 'N/A',
                address: clientAddress || 'N/A',
                phone: clientPhone || 'N/A',
                otherInfo: clientCUIT || 'N/A',
            },
            invoice: {
                label: "Factura #: ",
                num: invoiceNumber || 'N/A',  
                invDate: `Fecha: ${invoiceDate || 'N/A'}`,
                invGenDate: `Validez: ${validityDate || 'N/A'}`,
                headerBorder: true,
                tableBodyBorder: true,
                header: tableHeaders,
                table: tableRows,
                additionalRows: [
                    {
                        col1: 'Importe Total:',
                        col2: calculateTotal().toFixed(2),
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
    
        try {
            jsPDFInvoiceTemplate(props);
            console.log("PDF generado correctamente");
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
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
            {!business ? (
                <p>Cargando datos de negocio...</p>
            ) : (
                <>
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
                    <div className="mt-4 flex justify-start">
                        <h2 className='border p-4 mr-18'>Total: ${calculateTotal()}</h2>
                    </div>

                    {/* Botones para guardar y generar PDF */}
                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            className="px-6 py-3 bg-blue-500 text-white rounded"
                            onClick={generatePDF}
                        >
                            Generar PDF
                        </button>
                        <button
                            className="px-6 py-3 bg-green-500 text-white rounded"
                            onClick={guardarFactura}
                        >
                            Guardar Factura
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default InvoiceGenerator;
