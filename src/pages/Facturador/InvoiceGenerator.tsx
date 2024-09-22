import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { OutputType } from 'jspdf-invoice-template';
import jsPDFInvoiceTemplate from 'jspdf-invoice-template';


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
    const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0).toFixed(2);
    };

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const updatedItems = [...items];
        const parsedValue = name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value;
        updatedItems[index] = { ...updatedItems[index], [name]: parsedValue };
        setItems(updatedItems);
    };

    const generatePDF = () => {
        const props = {
            outputType: OutputType.Save,
            returnJsPDFDocObject: true,
            fileName: "Invoice",
            orientationLandscape: false,
            compress: true,
            logo: {
                src: "http://localhost:5173/public/DAES_INGENIERIA.webp",
                width: 53.33,
                height: 26.66,
                margin: {
                    top: 0,
                    left: 0
                }
            },
            stamp: {
                inAllPages: true,
                src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
                width: 20,
                height: 20,
                margin: {
                    top: 0,
                    left: 0
                }
            },
            business: {
                name: "Daes Ingeniería",
                address: "LEMOS E/ 5 Y 6 LOTE 34 ",
                phone: "264-5591009",
                email: "email@example.com",
                email_1: "info@example.al",
                website: "daesingenieria.com.ar",
            },
            contact: {
                label: "Factura emitida por:",
                name: clientName,
                address: clientAddress,
                phone: clientPhone,
                email: "client@website.al",
                otherInfo: clientCUIT,
            },
            invoice: {
                label: "Factura #: ",
                num: invoiceNumber,
                invDate: `Fecha: ${invoiceDate}`,
                invGenDate: `Validez: ${validityDate}`,
                headerBorder: true,
                tableBodyBorder: true,
                header: [
                    { title: "#", style: { width: 10 } },
                    { title: "Descripción", style: { width: 80 } },
                    { title: "Cantidad" },
                    { title: "Precio Unitario" },
                    { title: "Total" }
                ],
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
                invDescLabel: "Invoice Note",
                invDesc: "Gracias por su compra. Este documento es una representación de su transacción.",
            },
            footer: {
                text: "Powered by Technodevs.",
            },
            pageEnable: true,
            pageLabel: "Page ",
        };

        jsPDFInvoiceTemplate(props);
    };

    return (
        <div className="flex flex-col gap-5.5 p-6.5">
            <h1>Generar Presupuesto</h1>
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
                <div key={index} className="flex gap-4">
                    <input
                        type="text"
                        name="description"
                        placeholder="Descripción"
                        value={item.description}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-4"
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Cantidad"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-4"
                    />
                    <input
                        type="number"
                        name="unitPrice"
                        placeholder="Precio unitario"
                        value={item.unitPrice}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-4"
                    />
                    <button className='inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10' onClick={() => handleRemoveItem(index)}>Eliminar</button>
                </div>
            ))}

            <button onClick={handleAddItem} className='inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>Agregar Item</button>
            <h2>Total: ${calculateTotal()}</h2>

            <button onClick={generatePDF} className='inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>Generar PDF</button>
        </div>
    );
};

export default InvoiceGenerator;
