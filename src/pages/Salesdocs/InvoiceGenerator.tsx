import React, { useState } from 'react';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';
import { useTranslation } from 'react-i18next';
import { salesDocsService } from '../../services/SalesDocsService'; // Importamos el servicio
import { useBusiness } from '../../context/BusinessContext'; // Usamos el contexto de Business
import Alert from '../UiElements/Alerts';

const InvoiceGenerator: React.FC = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [validityDate, setValidityDate] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientCUIT, setClientCUIT] = useState('');
    const [clientTaxStatus, setClientTaxStatus] = useState('Exento');
    const [paymentCondition, setPaymentCondition] = useState('Efectivo');
    const [observations, setObservations] = useState('');
    const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();
    const business = useBusiness();

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateIVA = () => {
        const net = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        return Math.round(net * 0.21 * 100) / 100;
    };

    const calculateTotal = () => {
        const net = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        return Math.round(net * 100) / 100;
    };

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const updatedItems = [...items];
        const parsedValue = name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value;
        updatedItems[index] = { ...updatedItems[index], [name]: parsedValue };
        setItems(updatedItems);
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
                customerId: 1, // Dinámico, debes obtener este ID
                state: "Borrador",
                paymentMethod: paymentCondition,
                date: invoiceDate,
                validityDate: validityDate,
                number: invoiceNumber,
                observations: observations,
                net: items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
                iva: calculateIVA(), // Cálculo del IVA como número
                amount: calculateTotal(), // Cálculo del monto total como número
            });
            setAlert({ type: 'success', message: 'Factura guardada con éxito' });
            setLoading(false);

            // Limpiar los campos después de guardar
            setInvoiceNumber('');
            setInvoiceDate('');
            setClientName('');
            setClientAddress('');
            setClientPhone('');
            setClientCUIT('');
            setClientTaxStatus('Exento');
            setPaymentCondition('Efectivo');
            setObservations('');
            setItems([{ description: '', quantity: 1, unitPrice: 0 }]);

        } catch (error: any) {
            setLoading(false);

            // Mostrar alerta de error
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
            <div>
                <label className='mb-3 block text-black dark:text-white'>Nº de Presupuesto:</label>
                <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div>
                <label className='mb-3 block text-black dark:text-white' >Fecha:</label>
                <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div>
                <label className='mb-3 block text-black dark:text-white' >Validez:</label>
                <input
                    type="date"
                    value={validityDate}
                    onChange={(e) => setValidityDate(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <h2>Cliente</h2>
            <div>
                <label className='mb-3 block text-black dark:text-white' >Razón Social:</label>
                <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div>
                <label className='mb-3 block text-black dark:text-white' >Domicilio:</label>
                <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div>
                <label className='mb-3 block text-black dark:text-white' >Teléfono:</label>
                <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div>
                <label className='mb-3 block text-black dark:text-white' >CUIT:</label>
                <input
                    type="text"
                    value={clientCUIT}
                    onChange={(e) => setClientCUIT(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div>
                <label className='mb-3 block text-black dark:text-white'>Condición de IVA:</label>
                <input
                    type="text"
                    value={clientTaxStatus}
                    onChange={(e) => setClientTaxStatus(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div>
                <label className='mb-3 block text-black dark:text-white'>Condición de venta:</label>
                <input
                    type="text"
                    value={paymentCondition}
                    onChange={(e) => setPaymentCondition(e.target.value)}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <h2>Items</h2>
            {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                    <div>
                        <label className='mb-3 text-black dark:text-white' htmlFor="description">Descripción</label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Descripción"
                            value={item.description}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 mt-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-4"
                        />
                    </div>
                    <div>
                        <label className='mb-3 text-black dark:text-white' htmlFor="quantity">Cantidad</label>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Cantidad"
                            value={item.quantity}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 mt-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-4"
                        />
                    </div>
                    <div>
                        <label htmlFor="unitPrice" className='mb-3 text-black dark:text-white'>Precio unitario</label>
                        <input
                            type="number"
                            name="unitPrice"
                            placeholder="Precio unitario"
                            value={item.unitPrice}
                            onChange={(e) => handleInputChange(index, e)}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 mt-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-4"
                        />
                    </div>
                    <div>
                        <button
                            type="button"
                            className='inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
                            onClick={() => handleRemoveItem(index)}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddItem}
                className='inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
            >
                Agregar Item
            </button>

            <h2>Total: ${calculateTotal()}</h2>

            <button
                type="button"
                onClick={generatePDF}
                className='inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
            >
                Generar PDF
            </button>

            <button
                type="button"
                onClick={guardarFactura}
                className='inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
            >
                Guardar Factura
            </button>
        </div>
    );
};

export default InvoiceGenerator;
