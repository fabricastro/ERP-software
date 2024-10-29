import React, { useEffect, useState } from 'react';
import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { salesDocsService } from '../../services/SalesDocsService';
import { customerService } from '../../services/CustomerService';
import Alert from '../UiElements/Alerts';
import ItemForm from './ItemForm';
import DefaultLayout from './../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSettings } from '../../context/SettingsContext';
import FormInput from './../../components/Input/input';
import { jsPDF } from 'jspdf';
import ModalComponent from '../../components/ModalComponent';
import CustomerFormFields from '../Customer/CustomerFormFields';
import 'jspdf-autotable';

interface SalesdocsAddProps {
    mode: 'add' | 'edit';
}

const SalesdocsAdd: React.FC<SalesdocsAddProps> = ({ mode }) => {
    const navigate = useNavigate();
    const [invoiceNumber, setInvoiceNumber] = useState<number>(0);
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
    const [documentType, setDocumentType] = useState('presupuesto');
    const { t } = useTranslation();
    const { settings, fetchUpdatedSettings } = useSettings();
    const { id } = useParams<{ id: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estados del formulario de cliente
    const [type, setType] = useState('Persona Humana');
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
                    setInvoiceNumber(Number(settings?.nextBudgetId));
                    console.log("modo add", settings?.nextBudgetId);
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
            setDocumentType(salesDocData.type);
            setInvoiceNumber(salesDocData.number);
            setState(salesDocData.state);
            setInvoiceDate(salesDocData.date);
            setValidityDate(salesDocData.validityDate);
            setCustomerId(salesDocData.customerId);
            setObservations(salesDocData.observations);
            setItems(salesDocData.articles);
            setClientName(salesDocData.customer.name);
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

        const net = items.reduce((acc, item) => {
            const subtotalConBonificacion = item.unitPrice * item.quantity * (1 - item.discount / 100);
            return acc + subtotalConBonificacion;
        }, 0);

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

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Agregar leyenda en el centro superior
        doc.setFontSize(12);
        doc.text("Documento no válido como factura", pageWidth / 2, 10, { align: "center" });

        // Cargar el logo de la empresa
        const img = new Image();
        img.src = settings.logo;

        img.onload = () => {
            // Ajustar el tamaño del logo manteniendo la proporción
            const originalWidth = img.width;
            const originalHeight = img.height;
            const maxWidth = 60;
            const maxHeight = 20;
            let finalWidth = originalWidth;
            let finalHeight = originalHeight;

            if (originalWidth > maxWidth || originalHeight > maxHeight) {
                const widthRatio = maxWidth / originalWidth;
                const heightRatio = maxHeight / originalHeight;
                const scale = Math.min(widthRatio, heightRatio);
                finalWidth = originalWidth * scale;
                finalHeight = originalHeight * scale;
            }

            // Agregar logo al PDF
            doc.addImage(img, 'PNG', 10, 20, finalWidth, finalHeight);

            // Agregar datos de la empresa a la derecha del logo
            doc.setFontSize(16);
            doc.setFillColor(28, 36, 52);
            const businessInfoX = pageWidth - 80;
            doc.text(`${settings.bussinessName || 'N/A'}`, businessInfoX, 20);
            doc.setFontSize(10);
            doc.text(`Dirección: ${settings.address || 'N/A'}`, businessInfoX, 25);
            doc.text(`Teléfono: ${settings.phone || 'N/A'}`, businessInfoX, 30);
            doc.text(`Email: ${settings.email || 'N/A'}`, businessInfoX, 35);
            doc.text(`Web: ${settings.website || 'N/A'}`, businessInfoX, 40);

            // Dibujar una línea debajo del encabezado
            doc.setLineWidth(0.1);
            doc.line(10, 45, pageWidth - 10, 45);

            // Agregar datos del cliente
            doc.setFontSize(10);
            doc.text(`Cliente:`, 10, 50);
            doc.setFontSize(16);
            doc.text(`${clientName}`, 10, 55);
            doc.setFontSize(10);
            doc.text(`Dirección: ${clientAddress}`, 10, 60);
            doc.text(`Teléfono: ${clientPhone}`, 10, 65);
            doc.text(`CUIT: ${clientCUIT}`, 10, 70);

            // Agregar datos de la boleta
            doc.text(`Presupuesto Nº: ${invoiceNumber}`, businessInfoX, 50);
            doc.text(`Fecha de Emisión: ${invoiceDate}`, businessInfoX, 55);
            doc.text(`Validez: ${validityDate}`, businessInfoX, 60);

            // Generar la tabla de ítems
            const tableColumn = ["Código", "Cantidad", "Descripción", "Precio Unit.", "Bonif %", "IVA %", "Subtotal"];
            const tableRows = items.map((item, index) => [
                item.code || index + 1,
                item.quantity || 0,
                item.description || 'Sin descripción',
                Number(item.unitPrice ?? 0).toFixed(2),
                item.discount ?? 0,
                item.iva ?? 0,
                (Number(item.unitPrice ?? 0) * item.quantity * (1 - (item.discount ?? 0) / 100)).toFixed(2)
            ]);

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 75,
                margin: { bottom: 30 },
                theme: 'grid',
            });

            // Agregar el total y observaciones después de la tabla
            const finalY = doc.previousAutoTable.finalY || 70;

            // Línea debajo de la tabla de items
            doc.setLineWidth(0.1);
            doc.line(10, finalY + 5, pageWidth - 10, finalY + 5);

            // Resaltar el total en la esquina inferior derecha
            doc.setFontSize(12);
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);
            doc.rect(pageWidth - 70, finalY + 15, 60, 10, 'F'); // Rectángulo de fondo blanco para el total
            doc.autoTable({
                head: [['Total']],
                body: [['$' + calculateTotal().toFixed(2)]],
                startY: finalY + 15,
                margin: { left: pageWidth - 55 }, // Posición del total en la parte derecha
                theme: 'grid',
                styles: { halign: 'right', fontSize: 12, cellPadding: 3 },
                tableWidth: 40,
            });

            // Observaciones
            doc.setFontSize(12);
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);
            doc.autoTable({
                head: [['Observaciones']],
                body: [[observations || 'N/A']],
                startY: finalY + 60,
                margin: { left: 15 }, // Posición alineada a la izquierda
                theme: 'grid',
                styles: {
                    halign: 'left', // Alinear el texto a la izquierda dentro de la celda
                    fontSize: 10,
                    cellPadding: 2, // Añadir padding para mejorar la presentación
                },
                tableWidth: pageWidth - 30, // Ajustar el ancho de la tabla al ancho de la página
            });

            // Numeración de las páginas
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`Página ${i} de ${totalPages}`, pageWidth - 30, pageHeight - 10);
                // Footer con "Hecho por PALTA"
                doc.text("Hecho por PALTA.", 10, pageHeight - 10);
            }

            // Guardar el PDF
            doc.save(`Presupuesto_${clientName}.pdf`);
        };
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
                setTimeout(() => {
                    navigate('/salesdocs');
                }, 2000);
                await fetchUpdatedSettings();
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
            const newCustomer = await customerService.addCustomer({
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
            setIsModalOpen(false);

            const updatedCustomers = await customerService.getAll();
            setCustomers(updatedCustomers);
            setCustomerId(newCustomer.id);
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
                        <div className='grid grid-cols-3 gap-5'>
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
                            <div className='w-[40%]'>
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
                        <div className='grid grid-cols-1 gap-5'>
                            <FormInput
                                label='Observaciones:'
                                type="textarea"
                                id='observations'
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                            />
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
