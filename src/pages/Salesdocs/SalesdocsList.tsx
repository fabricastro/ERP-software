import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree"; // Tabla reutilizable
import { salesDocsService } from "../../services/SalesDocsService";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Alert from '../../pages/UiElements/Alerts';

interface SalesDoc {
    id: number;
    type: string;
    customerId: number;
    state: string;
    paymentMethod: string;
    date: string;
    amount: number;
}

const SalesDocsList: React.FC = () => {
    const [salesDocs, setSalesDocs] = useState<SalesDoc[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalesDocs = async () => {
            try {
                const response = await salesDocsService.getAll();
                setSalesDocs(response);
                setLoading(false);
            } catch (err: any) {
                setError('Error al cargar los documentos de ventas');
                setLoading(false);
            }
        };

        fetchSalesDocs();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este documento de venta?');
        if (confirmDelete) {
            try {
                await salesDocsService.delete(id);
                setAlert({ type: 'success', message: 'Documento de venta eliminado con éxito' });
                setSalesDocs((prev) => prev.filter((doc) => doc.id !== id));
            } catch (error) {
                setAlert({ type: 'error', message: 'Error al eliminar el documento de venta' });
            }
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/salesdocs/edit/${id}`);
    };

    const columns = [
        { key: "type", label: "Tipo" },
        { key: "customerId", label: "ID Cliente" },
        { key: "state", label: "Estado" },
        { key: "paymentMethod", label: "Método de Pago" },
        { key: "date", label: "Fecha" },
        { key: "amount", label: "Monto Total" },
    ];

    const handleActions = (salesDoc: SalesDoc) => (
        <>
            <button onClick={() => handleEdit(salesDoc.id)}
                className="hover:text-primary text-[25px]"><MdEdit /></button>
            <button onClick={() => handleDelete(salesDoc.id)} className="hover:text-danger text-[20px]"><FaTrash /></button>
        </>
    );

    if (loading) return <p>Cargando documentos de ventas...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} onClose={() => setAlert(null)} />}
            <TableThree data={salesDocs} columns={columns} actions={handleActions} />
        </div>
    );
};

export default SalesDocsList;
