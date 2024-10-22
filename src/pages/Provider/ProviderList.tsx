import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree";
import { providerService } from "../../services/ProviderService";
import { MdEdit } from "react-icons/md";
import { FaEdit, FaEye, FaTrash, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Alert from '../../pages/UiElements/Alerts';
import { Provider } from "../../interfaces/provider";

const ProviderList: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  // Handle delete
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this provider?');
    if (confirmDelete) {
      try {
        await providerService.deleteProvider(id);
        setAlert({ type: 'success', message: 'Provider successfully deleted' });
        setProviders((prev) => prev.filter((provider) => provider.id !== id));
      } catch (error) {
        setAlert({ type: 'error', message: 'Error deleting the provider' });
      }
    }
  };

  // Handle edit
  const handleEdit = (id: number) => {
    navigate(`/provider/edit/${id}`);
  };

  // Handle view
  const handleView = (id: number) => {
    navigate(`/provider/view/${id}`);
  };

  // Actions for the provider table
  const handleActions = (provider: Provider) => (
    <>
      <button onClick={() => handleView(provider.id)}
        className="hover:text-primary text-[25px]"><FaEye /></button>
      <button onClick={() => handleEdit(provider.id)}
        className="hover:text-primary text-[25px]"><FaEdit /></button>
      <button onClick={() => handleDelete(provider.id)}
        className="hover:text-danger text-[20px]"><FaTrashAlt /></button>
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
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Success' : 'Error'} message={alert.message} />}
      <TableThree data={providers} columns={columns} actions={handleActions} />
    </div>
  );
};

export default ProviderList;
