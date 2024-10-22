import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree";
import { providerService } from "../../services/ProviderService";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Alert from '../../pages/UiElements/Alerts';
import { Provider } from "../../interfaces/provider";
import ConfirmDialog from "../../components/ConfirmDialog";

const ProviderList: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; idToDelete: number | null }>({ isOpen: false, idToDelete: null });


  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await providerService.getAll();
        setProviders(response);
        setLoading(false);
      } catch (err: any) {
        setError('Error loading providers');
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/provider/edit/${id}`);
  };

  // Handle view
  const handleView = (id: number) => {
    navigate(`/provider/view/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    try {
      await providerService.deleteProvider(id);
      setAlert({ type: 'success', message: 'Proveedor eliminado con éxito' });
      setProviders((prev) => prev.filter((customer) => customer.id !== id));
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar el proveedor' });
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

  // Actions for the provider table
  const handleActions = (provider: Provider) => (
    <>
      <button onClick={() => handleView(provider.id)}
        className="hover:text-primary text-[25px]"><FaEye /></button>
      <button onClick={() => handleEdit(provider.id)}
        className="hover:text-primary text-[25px]"><FaEdit /></button>
      <button onClick={() => openConfirmDialog(provider.id)} className="hover:text-danger text-[20px]"><FaTrashAlt /></button>
    </>
  );

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p>{error}</p>;

  // Table columns
  const columns = [
    { key: "name", label: "Nombre y Apellido" },
    { key: "email", label: "Email" },
    { key: "cuit", label: "CUIT" },
    { key: "phone", label: "Teléfono" },
    { key: "fiscalAddress", label: "Dirección" },
  ];

  return (
    <div>
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} onClose={() => setAlert(null)}/>}
      <TableThree data={providers} columns={columns} actions={handleActions} />

      {confirmDialog.idToDelete !== null && (
        <ConfirmDialog
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar este proveedor?"
          onConfirm={confirmDelete}
          closeModal={() => setConfirmDialog({isOpen: false, idToDelete: null})}
        />
      )}
    </div>
  );
};

export default ProviderList;
