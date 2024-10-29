import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree";
import { salesDocsService } from "../../services/SalesDocsService";
import { MdEdit } from "react-icons/md";
import { FaEye, FaTrash } from "react-icons/fa";
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

interface SalesdocsAddProps{
  typeSalesdocs: 'budget' | 'bill'
}

const SalesDocsList: React.FC<SalesdocsAddProps> = ({typeSalesdocs}) => {
  const [salesDocs, setSalesDocs] = useState<SalesDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; idToDelete: number | null }>({
    isOpen: false,
    idToDelete: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalesDocs = async () => {
      try {
        const filter = { type: typeSalesdocs === 'budget' ? 'presupuesto' : 'factura' };
        const order = { column: 'date', typeOrder: 'DESC' };
        const salesDocsResponse : any = await salesDocsService.findIn('salesDocs', filter, order, 1, 100);
        
        const salesDocsWithNames = salesDocsResponse.items.map((doc: SalesDoc) => {
          const formattedDate = new Date(doc.date).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          return {
            ...doc,
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
    fetchSalesDocs();
  }, [typeSalesdocs]);


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
    navigate(`/${typeSalesdocs}/edit/${id}`);
  };
  
  const handleView = (id: number) => {
    navigate(`/${typeSalesdocs}/view/${id}`);
  };

  const columns = [
    { key: "number", label: "Número" },
    { key: "customer.name", label: "Cliente" },
    { key: "state", label: "Estado" },
    { key: "paymentMethod", label: "Método de Pago" },
    { key: "date", label: "Fecha" },
    { key: "amount", label: "Monto Total" },
  ];

  const handleActions = (salesDoc: SalesDoc) => (
    <>
      <button onClick={() => handleView(salesDoc.id)} className="hover:text-primary text-[25px]"><FaEye /></button>
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
