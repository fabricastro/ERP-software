import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Buffer } from 'buffer';

interface Settings {
    logo: string;
    bussinessName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
}

interface ClientData {
    clientName: string;
    clientAddress: string;
    clientPhone: string;
    clientCUIT: string;
}

interface Item {
    code: string;
    quantity: number;
    description: string;
    unitPrice: number | null;
    discount: number;
    iva: number;
}

export const PDFService = {

    generatePDF(
        settings: Settings,
        clientData: ClientData,
        items: Item[],
        type: 'presupuesto' | 'factura',
        invoiceNumber: number,
        invoiceDate: string,
        validityDate: string,
        observations: string,
        calculateTotal: () => number,
        sendMail?: boolean
    ): Promise<Buffer | null> {
        return new Promise((resolve, reject) => {
            if (!settings || !settings.logo) {
                console.error("Faltan datos de negocio o logo.");
                reject(new Error("Faltan datos de negocio o logo."));
                return;
            }
            if (!clientData.clientName || !clientData.clientAddress || !clientData.clientPhone || !clientData.clientCUIT) {
                console.error("Faltan datos del cliente.");
                reject(new Error("Faltan datos del cliente."));
                return;
            }
            if (items.length === 0) {
                console.error("No hay ítems en la factura.");
                reject(new Error("No hay ítems en la factura."));
                return;
            }

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Agregar leyenda en el centro superior
            if (type === 'presupuesto') {
                doc.setFontSize(8);

                // Coordenadas y dimensiones del recuadro
                const boxX = pageWidth / 2; // Ajustar según el ancho de la página
                const boxY = 8;
                const boxWidth = 10;
                const boxHeight = 10;

                // Dibujar el recuadro negro
                doc.setDrawColor(0); // Color negro
                doc.rect(boxX, boxY - 6, boxWidth, boxHeight);

                // Dibujar la "X" dentro del recuadro
                doc.line(boxX, boxY - 6, boxX + boxWidth, boxY - 6 + boxHeight); // Diagonal de arriba a abajo
                doc.line(boxX, boxY - 6 + boxHeight, boxX + boxWidth, boxY - 6); // Diagonal de abajo a arriba

                // Agregar el texto centrado en el recuadro
                doc.text("Documento no válido como factura", pageWidth / 2 + 5, boxY + boxHeight - 2, { align: "center" });
            }

            // Cargar el logo de la empresa
            const img = new Image();
            img.src = settings.logo;

            img.onload = () => {
                const originalWidth = img.width;
                const originalHeight = img.height;
                const maxWidth = 60;
                const maxHeight = 20;
                const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
                const finalWidth = originalWidth * scale;
                const finalHeight = originalHeight * scale;

                // Agregar logo al PDF
                doc.addImage(img, 'PNG', 10, 20, finalWidth, finalHeight);

                // Agregar datos de la empresa a la derecha del logo
                doc.setFontSize(16);
                const businessInfoX = pageWidth - 65;
                doc.text(settings.bussinessName || 'N/A', businessInfoX, 20);
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
                doc.text("Cliente:", 10, 50);
                doc.setFontSize(16);
                doc.text(clientData.clientName, 10, 55);
                doc.setFontSize(10);
                doc.text(`Dirección: ${clientData.clientAddress}`, 10, 60);
                doc.text(`Teléfono: ${clientData.clientPhone}`, 10, 65);
                doc.text(`CUIT: ${clientData.clientCUIT}`, 10, 70);

                // Agregar datos de la boleta
                doc.text(`${type.toUpperCase()} Nº: ${invoiceNumber}`, businessInfoX, 50);
                doc.text(`Fecha de Emisión: ${invoiceDate}`, businessInfoX, 55);
                doc.text(`Validez: ${validityDate}`, businessInfoX, 60);

                // Generar la tabla de ítems
                const tableColumn = ["Código", "Cantidad", "Descripción", "Precio Unit.", "Bonif %", "IVA %", "Subtotal"];
                const tableRows = items.map((item, index) => [
                    item.code || (index + 1).toString(),
                    item.quantity || 0,
                    item.description || 'Sin descripción',
                    Number(item.unitPrice ?? 0).toFixed(2),
                    item.discount ?? 0,
                    item.iva ?? 0,
                    (Number(item.unitPrice ?? 0) * (item.quantity || 0) * (1 - (item.discount ?? 0) / 100)).toFixed(2)
                ]);
                doc.setFontSize(10);
                doc.autoTable({
                    head: [tableColumn],
                    body: tableRows,
                    startY: 75,
                    margin: { bottom: 30, left: 10, right: 10 },
                    theme: 'striped',
                    tableWidth: pageWidth - 20,
                });

                // Agregar el total y observaciones después de la tabla
                const finalY = doc.previousAutoTable.finalY || 70;

                // Línea debajo de la tabla de items
                doc.setLineWidth(0.1);
                doc.line(10, finalY + 5, pageWidth - 10, finalY + 5);


                const { subtotalSinIVA, totalConIVA, iva } = calculateTotal();

                // Resaltar el total en la esquina inferior derecha
                doc.setFontSize(12);
                doc.setDrawColor(0);
                doc.setFillColor(255, 255, 255);
                doc.rect(pageWidth - 70, finalY + 15, 60, 10, 'F');
                // Agregar el subtotal sin IVA
                doc.autoTable({
                    head: [['Subtotal sin IVA', '$' + subtotalSinIVA.toFixed(2)]],
                    // body: [['$' + subtotalSinIVA.toFixed(2)]],
                    startY: finalY + 15, // Posición debajo de la tabla de artículos
                    margin: { left: pageWidth - 80 }, // Alineado a la derecha
                    theme: 'striped',
                    styles: { halign: 'right', fontSize: 12, cellPadding: 3 },
                    tableWidth: 70,
                });
                //iva
                doc.autoTable({
                    head: [['IVA', '$' + iva.toFixed(2)]],
                    // body: [['$' + iva.toFixed(2)]],
                    startY: finalY + 30, // Posición debajo de la tabla de artículos
                    margin: { left: pageWidth - 70 }, // Alineado a la derecha
                    theme: 'striped',
                    styles: { halign: 'right', fontSize: 12, cellPadding: 3 },
                    tableWidth: 60,
                });

                // Agregar el total con IVA
                doc.autoTable({
                    head: [['Total con IVA', '$' + totalConIVA.toFixed(2)]],
                    // body: [['$' + totalConIVA.toFixed(2)]],
                    startY: finalY + 45, // Posición debajo del subtotal
                    margin: { left: pageWidth - 70 }, // Alineado a la derecha
                    theme: 'striped',
                    styles: { halign: 'right', fontSize: 12, cellPadding: 3 },
                    tableWidth: 60,
                });

                // Numeración de las páginas
                const totalPages = doc.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    doc.setFontSize(10);
                    doc.text(`Página ${i} de ${totalPages}`, pageWidth - 30, pageHeight - 10);
                    doc.text("Hecho por PALTA.", 10, pageHeight - 10);
                }

                // Generar el PDF
                if (sendMail) {
                    const pdfOutput = doc.output('arraybuffer');
                    const buffer = Buffer.from(pdfOutput);
                    console.log(buffer);
                    resolve(buffer);  
                } else {
                    // Guardar el PDF
                    doc.save(`${type}-${clientData.clientName}.pdf`);
                    resolve(null);
                }
            };
        });
    }
};
