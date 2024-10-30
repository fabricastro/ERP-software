import React, { useEffect, useState } from 'react';
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
import ModalComponent from '../../components/ModalComponent';
import CustomerFormFields from '../Customer/CustomerFormFields';
import 'jspdf-autotable';
import { PDFService } from '../../services/PDFService';
import { Buttons } from '../../components/Buttons/Buttons';
import SelectForm from '../../components/Input/select';
import { OptionType } from '../../interfaces/optionType';
import { Customer } from '../../interfaces/customer';
import { mailService } from '../../services/MailService';
import { Buffer } from 'buffer';

interface SalesdocsAddProps {
    mode: 'add' | 'edit' | 'view';
    typeSalesdocs: 'presupuesto' | 'factura';
}

const SalesdocsAdd: React.FC<SalesdocsAddProps> = ({ mode, typeSalesdocs }) => {
    const navigate = useNavigate();
    const [invoiceNumber, setInvoiceNumber] = useState<number>(0);
    const [state, setState] = useState('Borrador');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [validityDate, setValidityDate] = useState('');
    const [customerId, setCustomerId] = useState<OptionType | null>(null);
    const [clientName, setClientName] = useState<string | undefined>('');
    const [clientAddress, setClientAddress] = useState<string | undefined>('');
    const [clientPhone, setClientPhone] = useState<string | undefined>('');
    const [clientEmail, setClientEmail] = useState<string | undefined>('');
    const [clientCUIT, setClientCUIT] = useState<string | undefined>('');
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

    const handleSendMail = async () => {
        const pdfUint8Array = await generatePDF(true);
        console.log(pdfUint8Array);
        if (!pdfUint8Array) {
            console.error("No se pudo generar el PDF");
            return;
        }
        const pdfBase64 = Buffer.from(pdfUint8Array);

        // Detalles del correo
        const to = clientEmail;
        const subject = "Factura Adjunta";
        const text = "Adjunto encontrará su factura.";
        const html = "<p>Adjunto encontrará su factura en formato PDF.</p>";
        const attachments = [
            {
                filename: "factura.pdf",
                content: pdfBase64,
                contentType: "application/pdf",
            },
        ];

        try {
            await mailService.sendMail(to, subject, text, html, attachments);
            setAlert({ type: 'success', message: 'Correo enviado exitosamente' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al enviar el correo' });
        }
    };

    useEffect(() => {
        const fetchInvoiceNumber = async () => {
            try {
                if (mode === 'add') {
                    setInvoiceNumber(Number(typeSalesdocs === 'presupuesto' ? settings?.nextBudgetId : settings?.nextBillId));
                    console.log("modo add", settings?.nextBudgetId);
                } else if (mode === 'edit' && id) {
                    loadSalesDocData(Number(id));
                }
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };
        fetchInvoiceNumber();
    }, [mode, id]);

    const loadCustomers = async (inputValue: string): Promise<OptionType[]> => {
        try {
            const fetchedCustomers = await customerService.getAll();
            const filteredCustomers = fetchedCustomers
                .filter((customer) =>
                    customer.name.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((customer) => ({
                    value: customer.id as number,
                    address: customer.fiscalAddress as string,
                    label: customer.name as string,
                    phone: customer.phone as string,
                    cuit: customer.cuit as string,
                    clientEmail: customer.email as string
                }));
            setCustomers(filteredCustomers);
            return filteredCustomers;
        } catch (error) {
            console.error("Error al cargar los proveedores:", error);
            return [];
        }
    };

    useEffect(() => {
        loadCustomers('');
    }, []);

    const loadSalesDocData = async (docId: number) => {
        try {
            const salesDocData: any = await salesDocsService.getById(docId);
            setDocumentType(salesDocData.type);
            setInvoiceNumber(salesDocData.number);
            setState(salesDocData.state);
            setInvoiceDate(salesDocData.date);
            setValidityDate(salesDocData.validityDate);
            setCustomerId(salesDocData.customerId);
            setCustomerId(
                salesDocData.customerId && salesDocData.customer
                    ? { value: salesDocData.customerId, label: salesDocData.customer.name }
                    : null
            );
            setObservations(salesDocData.observations);
            setItems(salesDocData.articles);
            setClientName(salesDocData.customer.name);
            setClientAddress(salesDocData.customer.fiscalAddress);
            setClientPhone(salesDocData.customer.phone);
            setClientCUIT(salesDocData.customer.cuit);
            setClientEmail(salesDocData.customer.email);
            console.log(salesDocData);
        } catch (error) {
            console.error("Error al cargar los datos del documento:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerChange = (selectedOption: OptionType | null) => {
        setCustomerId(selectedOption);
        setClientName(selectedOption?.label);
        setClientAddress(selectedOption?.address);
        setClientPhone(selectedOption?.phone);
        setClientCUIT(selectedOption?.cuit);
        setClientEmail(selectedOption?.clientEmail);
    };

    const calculateIVA = () => {
        const net = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        return Math.round(net * 0.21 * 100) / 100;
    };

    const calculateTotal = () => {
        if (!Array.isArray(items) || items.length === 0) {
            return { subtotalSinIVA: 0, totalConIVA: 0, iva: 0 };
        }

        // Calcular subtotal sin IVA
        const subtotalSinIVA = items.reduce((acc, item) => {
            const subtotalConBonificacion = item.unitPrice * item.quantity * (1 - item.discount / 100);
            return acc + subtotalConBonificacion;
        }, 0);

        // Calcular total con IVA
        const totalConIVA = items.reduce((acc, item) => {
            const subtotalConBonificacion = item.unitPrice * item.quantity * (1 - item.discount / 100);
            const subtotalConIVA = subtotalConBonificacion * (1 + item.iva / 100);
            return acc + subtotalConIVA;
        }, 0);

        // Calcular IVA aplicando la diferencia entre total y subtotal
        const iva = Math.round((totalConIVA - subtotalSinIVA) * 100) / 100;

        return {
            subtotalSinIVA: Math.round(subtotalSinIVA * 100) / 100,
            totalConIVA: Math.round(totalConIVA * 100) / 100,
            iva
        };
    };

    const generatePDF = (sendMail: boolean): Promise<Buffer | null> => {
        if (!settings || !settings.logo || !clientName || !clientAddress || !clientPhone || !clientCUIT || items.length === 0) {
            console.error("Faltan datos necesarios para generar el PDF.");
            return Promise.resolve(null);
        }

        return PDFService.generatePDF(
            settings,
            { clientName, clientAddress, clientPhone, clientCUIT },
            items,
            typeSalesdocs,
            invoiceNumber,
            invoiceDate,
            validityDate,
            observations,
            calculateTotal,
            sendMail
        );
    };

    const saveSalesDocs = async () => {
        setLoading(true);

        try {
            if (mode === 'edit' && id) {
                await salesDocsService.updateSalesDoc(Number(id), {
                    type: typeSalesdocs,
                    customerId: customerId?.value,
                    state,
                    paymentMethod: paymentCondition,
                    date: invoiceDate,
                    validityDate,
                    number: invoiceNumber,
                    observations,
                    net: items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
                    iva: calculateIVA(),
                    amount: totalConIVA,
                    articles: items
                });
                setAlert({ type: 'success', message: 'Documento actualizado con éxito' });
                setLoading(false);
            } else if (mode === 'add') {
                await salesDocsService.addSalesDoc({
                    type: typeSalesdocs,
                    customerId: customerId?.value,
                    state,
                    paymentMethod: paymentCondition,
                    date: invoiceDate,
                    validityDate,
                    number: invoiceNumber,
                    observations,
                    net: items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
                    iva: calculateIVA(),
                    amount: totalConIVA,
                    articles: items
                });
                setAlert({ type: 'success', message: 'Factura guardada con éxito' });
                setTimeout(() => {
                    if (typeSalesdocs === 'factura')
                        navigate('/bill');
                    else
                        navigate('/budget');
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
            const newCustomer: Customer = await customerService.addCustomer({
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
                id: 0
            });

            setAlert({ type: 'success', message: 'Cliente agregado con éxito' });
            setIsModalOpen(false);
            setCustomerId({ value: newCustomer.id, label: newCustomer.name });
            setCustomers(prevCustomers => [
                ...prevCustomers,
                { value: newCustomer.id, label: newCustomer.name }
            ]);

            setName('');
            setCuit('');
            setFiscalAddress('');
            setPostalCode('');
            setCommunity('');
            setProvince('');
            setCountry('Argentina');
            setPhone('');
            setEmail('');
            setWeb('');

            handleCloseModal();
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al agregar el cliente. Inténtalo de nuevo.' });
        }
    };
    const { subtotalSinIVA, totalConIVA, iva } = calculateTotal();
    return (
        <DefaultLayout>
            <Breadcrumb
                pageName={
                    mode === 'edit'
                        ? t(`routes.edit_${typeSalesdocs === 'presupuesto' ? 'budget' : 'bill'}`)
                        : t(`routes.add_${typeSalesdocs === 'presupuesto' ? 'budget' : 'bill'}`)
                }
            />
            <div className="flex flex-col gap-5.5">
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <SelectForm
                                    label="Proveedor"
                                    id="customerId"
                                    value={customerId}
                                    options={customers}
                                    onChange={handleCustomerChange}
                                    placeholder="Selecciona un proveedor"
                                    required
                                    onButtonClick={handleOpenModal}
                                    isDisabled={mode === 'view'}
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
                            <div className="w-full md:w-[40%]">
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

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            <div>
                                <FormInput
                                    label='Razon Social:'
                                    type="text"
                                    id='clientName'
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    disabled
                                />
                            </div>

                            <div>
                                <FormInput
                                    label='Domicilio:'
                                    type="text"
                                    id='clientAddress'
                                    value={clientAddress}
                                    onChange={(e) => setClientAddress(e.target.value)}
                                    disabled
                                />
                            </div>

                            <div>
                                <FormInput
                                    label='Teléfono:'
                                    type="text"
                                    id='clientPhone'
                                    value={clientPhone}
                                    onChange={(e) => setClientPhone(e.target.value)}
                                    disabled
                                />
                            </div>

                            <div>
                                <FormInput
                                    label='CUIT:'
                                    type="text"
                                    id='clientCUIT'
                                    value={clientCUIT}
                                    onChange={(e) => setClientCUIT(e.target.value)}
                                    disabled
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

                        <div className="flex flex-col md:flex-row justify-between gap-3">
                            <div className="w-full md:w-[50%]">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Observaciones</label>
                                <textarea
                                    title='Observaciones:'
                                    id='observations'
                                    placeholder='Escriba sus observaciones...'
                                    className='w-full h-[80%] p-2 text-sm border border-stroke bg-[#F9F9F9] rounded focus:outline-none focus:ring-0 focus:border-primary'
                                    value={observations}
                                    onChange={(e) => setObservations(e.target.value)}
                                />
                            </div>
                            <table className="table-auto w-full md:w-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left flex flex-col dark:bg-meta-4 md:mr-24 border border-border-stroke">
                                        <th className="w-full py-2 px-2 font-medium text-black dark:text-white">
                                            <td className="border-b w-full border-[#000] py-2 px-4 dark:border-strokedark">Subtotal</td>
                                            <td className="border-b w-full border-[#000] py-2 px-4 dark:border-strokedark">${subtotalSinIVA}</td>
                                        </th>
                                        <th className="w-full py-2 px-2 font-medium text-black dark:text-white">
                                            <td className="border-b w-full border-[#000] py-2 px-4 dark:border-strokedark">IVA</td>
                                            <td className="border-b w-full border-[#000] py-2 px-4 dark:border-strokedark">${iva}</td>
                                        </th>
                                        <th className="w-full py-2 px-2 font-medium text-black dark:text-white">
                                            <td className="w-full py-2 px-4 dark:border-strokedark">Total</td>
                                            <td className="w-full py-2 px-4 dark:border-strokedark">${totalConIVA}</td>
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        <div className="mt-4 flex flex-col md:flex-row justify-end gap-3 mr-0 md:mr-24">
                            <Buttons title='Enviar PDF por Correo' bgColor='bg-primary' onClick={handleSendMail}></Buttons>
                            <Buttons title='Generar PDF' bgColor='bg-primary' onClick={generatePDF}></Buttons>
                            <Buttons title={mode === 'edit' ? 'Actualizar Factura' : 'Guardar Factura'} onClick={saveSalesDocs}></Buttons>
                        </div>
                    </>
                )}
            </div>
        </DefaultLayout >
    );
};

export default SalesdocsAdd;
