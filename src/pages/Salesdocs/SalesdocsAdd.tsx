import React, { useEffect, useState } from 'react';
import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { salesDocsService } from '../../services/SalesDocsService';
import { customerService } from '../../services/CustomerService';
import Alert from '../UiElements/Alerts';
import ItemForm from './ItemForm';
import DefaultLayout from './../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSettings } from '../../context/SettingsContext';
import FormInput from './../../components/Input/input';
import Label from '../../components/Label/Label';
import { jsPDF } from 'jspdf';
import ModalComponent from '../../components/ModalComponent';
import CustomerFormFields from '../Customer/CustomerFormFields';

interface SalesdocsAddProps {
    mode: 'add' | 'edit';
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
    const [documentType, setDocumentType] = useState('presupuesto'); // Cambié este nombre para evitar el conflicto
    const { t } = useTranslation();
    const { settings } = useSettings();
    const { id } = useParams<{ id: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estados del formulario de cliente
    const [type, setType] = useState('Persona Humana'); // Mantiene el nombre 'type' para el cliente
    const [name, setName] = useState('');
    const [cuit, setCuit] = useState('');
    const [fiscalAddress, setFiscalAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [community, setCommunity] = useState('');
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('Argentina');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [web, setWeb] = useState('');

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
            setDocumentType(salesDocData.type); // Ahora usa 'documentType' en lugar de 'type'
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
        if (!Array.isArray(items) || items.length === 0) {
            return 0;
        }
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

        const pdf = new jsPDF();
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("DOCUMENTO NO VALIDO COMO FACTURA", 105, 20, null, null, "center");

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(settings.bussinessName || "Empresa", 20, 35); // Nombre de la empresa
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Razón Social: ${clientName}`, 20, 40);
        pdf.text(`Domicilio: ${clientAddress}`, 20, 45);

        pdf.setFont("helvetica", "bold");
        pdf.text("O", 160, 35); // Código del documento
        pdf.setFont("helvetica", "normal");
        pdf.text("COD. 0", 158, 40);

        pdf.setFont("helvetica", "bold");
        pdf.text("PRESUPUESTO", 180, 35);
        pdf.setFont("helvetica", "normal");
        pdf.text(invoiceNumber || "00001-00000001", 180, 40);

        pdf.setFontSize(10);
        pdf.text(`Fecha de emisión: ${invoiceDate}`, 180, 45);
        pdf.text(`CUIT: ${clientCUIT}`, 180, 50);
        pdf.text(`Ingresos Brutos: 56`, 180, 55); // Este dato parece estático, puedes cambiarlo si viene de otro lado
        pdf.text("Fecha de inicio de actividades: 29/07/2018", 180, 60); // Si este dato es dinámico, cámbialo según tu servicio
        pdf.text(`Condición frente al IVA: ${clientTaxStatus}`, 180, 65);

        pdf.line(20, 70, 200, 70); // (x1, y1, x2, y2)

        pdf.text(`Apellido y nombre / Razón Social: ${clientName}`, 20, 75);
        pdf.text(`Domicilio: ${clientAddress}`, 20, 80);
        pdf.text(`DNI: ${clientCUIT}`, 20, 85); // Si tienes un campo para DNI, cámbialo, si no usa CUIT
        pdf.text(`Condición frente al IVA: ${clientTaxStatus}`, 20, 90);
        pdf.text(`Condición de venta: ${paymentCondition} (vto pago: ${validityDate})`, 20, 95);

        pdf.line(20, 100, 200, 100);

        pdf.text("Cantidad", 20, 105);
        pdf.text("Producto / Servicio", 50, 105);
        pdf.text("Precio Unit", 120, 105);
        pdf.text("Bonif. %", 140, 105);
        pdf.text("Imp. Bonif.", 160, 105);
        pdf.text("% IVA", 180, 105);
        pdf.text("Subtotal S/IVA", 200, 105);

        let currentY = 115;
        items.forEach((item) => {
            const unitPrice = parseFloat(item.unitPrice) || 0;
            const quantity = item.quantity || 0;

            pdf.text(`${quantity} unidades`, 20, currentY);
            pdf.text(`${item.description}`, 50, currentY);
            pdf.text(`$ ${unitPrice.toFixed(2)}`, 120, currentY);
            pdf.text("0 %", 140, currentY); // Bonificación
            pdf.text("$ 0.00", 160, currentY); // Importe bonificado
            pdf.text("21 %", 180, currentY); // IVA
            pdf.text(`$ ${(unitPrice * quantity).toFixed(2)}`, 200, currentY);

            currentY += 10;
        });

        pdf.text("Importe Total:", 180, currentY + 10);
        pdf.text(`$ ${calculateTotal().toFixed(2)}`, 200, currentY + 10);

        pdf.setFontSize(8);
        pdf.text("Powered by Technodevs.", 105, 290, null, null, "center");

        pdf.save('Presupuesto.pdf');
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

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleAddCustomer = async () => {
        try {
            await customerService.addCustomer({
                type,
                name,
                cuit,
                fiscalAddress,
                postalCode,
                community,
                province,
                country,
                phone,
                email,
                web,
            });
            setAlert({ type: 'success', message: 'Cliente agregado con éxito' });
            handleCloseModal();
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al agregar el cliente. Inténtalo de nuevo.' });
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
                                <FormInput
                                    label='Selecciona un cliente:'
                                    type="select"
                                    id='customer'
                                    value={customerId || ''}
                                    options={customers.map((customer) => ({
                                        label: customer.name,
                                        value: customer.id
                                    }))}
                                    onChange={(e) => handleCustomerChange(e as React.ChangeEvent<HTMLSelectElement>)}
                                    required={true}
                                    onButtonClick={handleOpenModal}
                                    buttonLabel="Agregar"
                                />
                            </div>
                            <ModalComponent isOpen={isModalOpen} onClose={handleCloseModal} title="Agregar Cliente">
                                <CustomerFormFields
                                    type={type} setType={setType}
                                    name={name} setName={setName}
                                    cuit={cuit} setCuit={setCuit}
                                    fiscalAddress={fiscalAddress} setFiscalAddress={setFiscalAddress}
                                    postalCode={postalCode} setPostalCode={setPostalCode}
                                    community={community} setCommunity={setCommunity}
                                    province={province} setProvince={setProvince}
                                    country={country} setCountry={setCountry}
                                    phone={phone} setPhone={setPhone}
                                    email={email} setEmail={setEmail}
                                    web={web} setWeb={setWeb}
                                />
                                <button onClick={handleAddCustomer} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Guardar Cliente</button>
                            </ModalComponent>
                            <div>
                                <FormInput
                                    label="Nº de Presupuesto"
                                    type="text"
                                    id='invoiceNumber'
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    required={true}
                                    disabled={mode === 'edit'}
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-4 gap-5'>
                            <div>
                                <FormInput
                                    label='Fecha de emisión:'
                                    type="date"
                                    id='invoiceDate'
                                    value={invoiceDate}
                                    onChange={(e) => setInvoiceDate(e.target.value)}
                                    required={true}
                                />
                            </div>

                            <div>
                                <FormInput
                                    label='Fecha de validez:'
                                    type="date"
                                    id='validityDate'
                                    value={validityDate}
                                    onChange={(e) => setValidityDate(e.target.value)}
                                    required={true}
                                />
                            </div>

                            <div>
                                <FormInput
                                    label='Estado:'
                                    type="select"
                                    id='state'
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required={true}
                                    options={['Borrador', 'Enviado', 'Aprobado', 'Rechazado', 'Facturado']}
                                />

                            </div>
                        </div>

                        <h2>Cliente</h2>
                        <div className='grid grid-cols-4 gap-5'>
                            <div>
                                <FormInput
                                    label='Razon Social:'
                                    type="text"
                                    id='clientName'
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    required={true}
                                />
                            </div>

                            <div>
                                <FormInput
                                    label='Domicilio:'
                                    type="text"
                                    id='clientAddress'
                                    value={clientAddress}
                                    onChange={(e) => setClientAddress(e.target.value)}
                                    required={true}
                                />
                            </div>

                            <div>
                                <FormInput
                                    label='Telfono:'
                                    type="text"
                                    id='clientPhone'
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                    required={true}
                                />
                            </div>

                            <div>
                                <FormInput
                                    label='CUIT:'
                                    type="text"
                                    id='clientCUIT'
                                    value={clientCUIT}
                                    onChange={(e) => setClientCUIT(e.target.value)}
                                    required={true}
                                />
                            </div>

                            <div>
                                <FormInput
                                    label="Condiciones de IVA:"
                                    type="text"
                                    id='clientTaxStatus'
                                    value={clientTaxStatus}
                                    onChange={(e) => setClientTaxStatus(e.target.value)}
                                    required={true}
                                    disabled={mode === 'edit'}
                                />

                            </div>

                            <div>
                                <FormInput
                                    label='Condición de pago:'
                                    type="select"
                                    id='paymentCondition'
                                    value={paymentCondition}
                                    onChange={(e) => setPaymentCondition(e.target.value)}
                                    required={true}
                                    options={['Efectivo', 'Credito', 'Ambos']}
                                />
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
