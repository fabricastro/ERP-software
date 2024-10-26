import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree";
import { salesDocsService } from "../../services/SalesDocsService";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Alert from '../../pages/UiElements/Alerts';
import { customerService } from "../../services/CustomerService";
import ConfirmDialog from "../../components/ConfirmDialog";

interface SalesDoc {
  id: number;
  type: string;
  customerId: number;
  state: string;
  paymentMethod: string;
  date: string;
  amount: number;
  customerName?: string;
}

interface Customer {
  id: number;
  name: string;
}

const SalesDocsList: React.FC = () => {
  const [salesDocs, setSalesDocs] = useState<SalesDoc[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; idToDelete: number | null }>({
    isOpen: false,
    idToDelete: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerResponse = await customerService.getAll();
        setCustomers(customerResponse);
      } catch (err) {
        setError('Error al cargar los clientes');
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchSalesDocs = async () => {
      try {
        const salesDocsResponse = await salesDocsService.getAll();

        const salesDocsWithNames = salesDocsResponse.map((doc: SalesDoc) => {
          const customer = customers.find(c => c.id === doc.customerId);

          const formattedDate = new Date(doc.date).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          return {
            ...doc,
            customerName: customer ? customer.name : 'Cliente desconocido',
            date: formattedDate
          };
        });

        setSalesDocs(salesDocsWithNames);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los documentos de ventas');
        setLoading(false);
      }
    };

    if (customers.length > 0) {
      fetchSalesDocs();
    }
  }, [customers]);


  const handleDelete = (id: number) => {
    setConfirmDialog({ isOpen: true, idToDelete: id });
  };

  // Confirmar la eliminación
  const confirmDelete = async () => {
    if (confirmDialog.idToDelete !== null) {
      try {
        await salesDocsService.deleteSalesDoc(Number(confirmDialog.idToDelete));

        setSalesDocs((prev) => prev.filter((doc) => doc.id !== confirmDialog.idToDelete));

        setAlert({ type: 'success', message: 'Documento de venta eliminado con éxito' });
        setConfirmDialog({ isOpen: false, idToDelete: null });
      } catch (error) {
        // Mostrar mensaje de error en caso de fallo
        setAlert({ type: 'error', message: 'Error al eliminar el documento de venta' });
        setConfirmDialog({ isOpen: false, idToDelete: null });
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/salesdocs/edit/${id}`);
  };

  const columns = [
    { key: "number", label: "Número" },
    { key: "type", label: "Tipo" },
    { key: "customerName", label: "Cliente" },  // Cambiado a customerName
    { key: "state", label: "Estado" },
    { key: "paymentMethod", label: "Método de Pago" },
    { key: "date", label: "Fecha" },
    { key: "amount", label: "Monto Total" },
  ];

  const handleActions = (salesDoc: SalesDoc) => (
    <>
      <button onClick={() => handleEdit(salesDoc.id)} className="hover:text-primary text-[25px]"><MdEdit /></button>
      <button onClick={() => handleDelete(salesDoc.id)} className="hover:text-danger text-[20px]"><FaTrash /></button>
    </>
  );

  if (loading) return <p>Cargando Presupuestos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} onClose={() => setAlert(null)} />}
      <TableThree data={salesDocs} columns={columns} actions={handleActions} />

      {/* Mostrar el popup de confirmación */}
      {confirmDialog.isOpen && (
        <ConfirmDialog
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar este documento de venta?"
          onConfirm={confirmDelete}
          closeModal={() => setConfirmDialog({ isOpen: false, idToDelete: null })}
        />
      )}
    </div>
  );
};

export default SalesDocsList;
