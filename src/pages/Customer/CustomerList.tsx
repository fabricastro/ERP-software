import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree";
import { customerService } from "../../services/CustomerService";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Alert from '../../pages/UiElements/Alerts';
import ConfirmDialog from '../../components/ConfirmDialog';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  fiscalAddress: string;
}

const CustomerList: React.FC = () => {
  const [customer, setCustomer] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Estado para el diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; idToDelete: number | null }>({ isOpen: false, idToDelete: null });

  useEffect(() => {
    const fetchcustomers = async () => {
      try {
        const response = await customerService.getAll();
        setCustomer(response);
        setLoading(false);
      } catch (err: any) {
        setError('Error al cargar los clientes');
        setLoading(false);
      }
    };

    fetchcustomers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await customerService.deleteCustomer(id);
      setAlert({ type: 'success', message: 'Cliente eliminado con éxito' });
      setCustomer((prev) => prev.filter((customer) => customer.id !== id));
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar el cliente' });
    }
  };

  const openConfirmDialog = (id: number) => {
    setConfirmDialog({ isOpen: true, idToDelete: id });
  };

  const confirmDelete = () => {
    if (confirmDialog.idToDelete !== null) {
      handleDelete(confirmDialog.idToDelete);
      setConfirmDialog({ isOpen: false, idToDelete: null });
    }
  };

  const columns = [
    { key: "name", label: "Nombre y Apellido" },
    { key: "email", label: "Email" },
    { key: "cuit", label: "CUIT" },
    { key: "phone", label: "Teléfono" },
    { key: "fiscalAddress", label: "Dirección" },
  ];

  const handleView = (id: number) => {
    navigate(`/customer/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/customer/edit/${id}`);
  };

  const handleActions = (customer: Customer) => (
    <>
      <button onClick={() => handleView(customer.id)} className="hover:text-primary text-[25px]"><FaEye /></button>
        <button onClick={() => handleEdit(customer.id)} className="hover:text-primary text-[25px]"><FaEdit /></button>
      <button onClick={() => openConfirmDialog(customer.id)} className="hover:text-danger text-[20px]"><FaTrashAlt /></button>
    </>
  );

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} />}
      <TableThree data={customer} columns={columns} actions={handleActions} />
      
      {confirmDialog.idToDelete !== null && (
        <ConfirmDialog
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar este cliente?"
          onConfirm={confirmDelete}
          closeModal={() => setConfirmDialog({isOpen: false, idToDelete: null})}
        />
      )}
    </div>
  );
};

export default CustomerList;
