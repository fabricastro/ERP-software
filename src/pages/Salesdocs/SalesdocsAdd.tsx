import React, { useEffect, useState } from 'react';
import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { salesDocsService } from '../../services/SalesDocsService';
import { customerService } from '../../services/CustomerService';
import Alert from '../UiElements/Alerts';
import ItemForm from './ItemForm';
import Label from '../../components/Label/Label';
import DefaultLayout from './../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSettings } from '../../context/SettingsContext';

interface SalesdocsAddProps {
    mode: 'add' | 'edit'; // Definir el tipo de modo como una unión de strings
}

const SalesdocsAdd: React.FC<SalesdocsAddProps> = ({ mode }) => {
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
    const [type, setType] = useState('presupuesto');
    const { t } = useTranslation();
    const { settings } = useSettings();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchCustomersAndInvoiceNumber = async () => {
            try {
                const customerData = await customerService.getAll();
                setCustomers(customerData);
                if (mode === 'add') {
                    const lastInvoiceNumber = localStorage.getItem('lastInvoiceNumber');
                    const nextInvoiceNumber = lastInvoiceNumber ? parseInt(lastInvoiceNumber, 10) + 1 : 1;
                    setInvoiceNumber(`AAA${nextInvoiceNumber}`);
                } else if (mode === 'edit' && id) {
                    loadSalesDocData(Number(id));
                }
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };
        fetchCustomersAndInvoiceNumber();
    }, [mode, id]);

    const loadSalesDocData = async (docId: number) => {
        try {
            const salesDocData: any = await salesDocsService.getById(docId);
            // Asignar los datos a los estados correspondientes
            setType(salesDocData.type);
            setInvoiceNumber(salesDocData.number);
            setState(salesDocData.state);
            setInvoiceDate(salesDocData.date);
            setValidityDate(salesDocData.validityDate);
            setCustomerId(salesDocData.customerId);
            setObservations(salesDocData.observations);
            setItems(salesDocData.articles);
            setClientName(salesDocData.customer.type);
            setClientAddress(salesDocData.customer.fiscalAddress);
            setClientPhone(salesDocData.customer.phone);
            setClientCUIT(salesDocData.customer.cuit);
            setClientTaxStatus(salesDocData.customer.taxStatus);
            console.log(salesDocData);
        } catch (error) {
            console.error("Error al cargar los datos del documento:", error);
        } finally {
            setLoading(false); 
        }
    };

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
        // Verifica si items es un arreglo y tiene datos
        if (!Array.isArray(items) || items.length === 0) {
          return 0; // Retorna 0 si no hay ítems
        }
        // Realiza la reducción si items tiene elementos
        const net = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        return Math.round(net * 100) / 100;
      };
      

    const generatePDF = () => {
        if (!settings || !settings.logo) {
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
                src: settings.logo,
                width: 60,
                height: 20,
                margin: { top: 0, left: 0 }
            },
            settings: {
                name: settings.bussinessName || 'N/A',
                address: settings.address || 'N/A',
                phone: settings.phone || 'N/A',
                email: settings.email || 'N/A',
                website: settings.website || 'N/A',
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
            if (mode === 'edit' && id) {
                await salesDocsService.updateSalesDoc(Number(id), {
                    type: "presupuesto",
                    customerId: customerId,
                    state,
                    paymentMethod: paymentCondition,
                    date: invoiceDate,
                    validityDate,
                    number: invoiceNumber,
                    observations,
                    net: items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
                    iva: calculateIVA(),
                    amount: calculateTotal(),
                    articles: items
                });
                setAlert({ type: 'success', message: 'Documento actualizado con éxito' });
                setLoading(false);
            } else if (mode === 'add') {
                await salesDocsService.addSalesDoc({
                    type: "presupuesto",
                    customerId: customerId || 1,
                    state,
                    paymentMethod: paymentCondition,
                    date: invoiceDate,
                    validityDate,
                    number: invoiceNumber,
                    observations,
                    net: items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
                    iva: calculateIVA(),
                    amount: calculateTotal(),
                    articles: items
                });
                setAlert({ type: 'success', message: 'Factura guardada con éxito' });
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setAlert({ type: 'error', message: 'Hubo un error al guardar la factura. Por favor, inténtalo de nuevo.' });
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={mode === 'edit' ? t('routes.edit_salesdocs') : t('routes.add_salesdocs')} />
            <div className="flex flex-col gap-5.5">
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
                {!settings ? (
                    <p>Cargando datos de negocio...</p>
                ) : (
                    <>
                        <div className='grid grid-cols-4 gap-5'>
                            <div>
                                <Label htmlFor='customer' required={true}>Selecciona un cliente:</Label>
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
                                <Label htmlFor='invoiceNumber' required={true}>Nº de Presupuesto:</Label>
                                <input
                                    type="text"
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-4 gap-5'>
                            <div>
                                <Label htmlFor='invoiceDate' required={true} >Fecha:</Label>
                                <input
                                    type="date"
                                    value={invoiceDate}
                                    onChange={(e) => setInvoiceDate(e.target.value)}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                                />
                            </div>

                            <div>
                                <Label htmlFor='validityDate' required={true} >Validez:</Label>
                                <input
                                    type="date"
                                    value={validityDate}
                                    onChange={(e) => setValidityDate(e.target.value)}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                                />
                            </div>

                            <div>
                                <Label htmlFor='state' required={true}>Estado</Label>
                                <select className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black" value={state} onChange={(e) => setState(e.target.value)}>
                                    <option value="Borrador">Borrador</option>
                                    <option value="Enviado">Enviado</option>
                                    <option value="Aprobado">Aprobado</option>
                                    <option value="Rechazado">Rechazado</option>
                                    <option value="Facturado">Facturado</option>
                                </select>
                            </div>
                        </div>

                        <h2>Cliente</h2>
                        <div className='grid grid-cols-4 gap-5'>
                            <div>
                                <Label htmlFor='clientName' required={true} >Razón Social:</Label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                                />
                            </div>

                            <div>
                                <Label htmlFor='clientAddress' required={true} >Domicilio:</Label>
                                <input
                                    type="text"
                                    value={clientAddress}
                                    onChange={(e) => setClientAddress(e.target.value)}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                                />
                            </div>

                            <div>
                                <Label htmlFor='clientPhone' required={true} >Teléfono:</Label>
                                <input
                                    type="text"
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                                />
                            </div>

                            <div>
                                <Label htmlFor='clientCUIT' required={true} >CUIT:</Label>
                                <input
                                    type="text"
                                    value={clientCUIT}
                                    onChange={(e) => setClientCUIT(e.target.value)}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                                />
                            </div>

                            <div>
                                <Label htmlFor='clientTaxStatus' required={true}>Condición de IVA:</Label>
                                <input
                                    type="text"
                                    value={clientTaxStatus}
                                    onChange={(e) => setClientTaxStatus(e.target.value)}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black"
                                />
                            </div>

                            <div>
                                <Label htmlFor='paymentCondition' required={true}>Condición de venta:</Label>
                                <select className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black" value={paymentCondition} onChange={(e) => setPaymentCondition(e.target.value)}>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Credito">Crédito</option>
                                    <option value="Ambos">Ambos</option>
                                </select>
                            </div>
                        </div>

                        <ItemForm items={items} setItems={setItems} />

                        <div className="mt-4 flex justify-start">
                            <h2 className='border p-4 mr-18'>Total: ${calculateTotal()}</h2>
                        </div>

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
                                {mode === 'edit' ? 'Actualizar Factura' : 'Guardar Factura'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </DefaultLayout>
    );
};

export default SalesdocsAdd;
