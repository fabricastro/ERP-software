import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree";
import { providerService } from "../../services/ProviderService";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Alert from '../../pages/UiElements/Alerts';

interface Proveedor {
  id: number;
  name: string;
  email: string;
  phone: string;
  fiscalAddress: string;
}

const ProviderList: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);



  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await providerService.getAll();
        setProveedores(response);
        setLoading(false);
      } catch (err: any) {
        setError('Error al cargar los proveedores');
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este proveedor?');
    if (confirmDelete) {
      try {
        await providerService.deleteProvider(id);
        setAlert({ type: 'success', message: 'Proveedor eliminado con éxito' });
        setProveedores((prev) => prev.filter((provider) => provider.id !== id));
      } catch (error) {
        setAlert({ type: 'error', message: 'Error al eliminar el proveedor' });
      }
    }
  };

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Teléfono" },
    { key: "fiscalAddress", label: "Dirección" },
  ];
  const handleEdit = (id: number) => {
    navigate(`/provider/edit/${id}`);
  };
  const handleActions = (proveedor: Proveedor) => (
    <>
      <button onClick={() => handleEdit(proveedor.id)}
        className="hover:text-primary text-[25px]"><MdEdit /></button>
      <button onClick={() => handleDelete(proveedor.id)} className="hover:text-danger text-[20px]"><FaTrash /></button>
    </>
  );

  if (loading) return <p>Cargando proveedores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} />}
      <TableThree data={proveedores} columns={columns} actions={handleActions} />
    </div>
  );
};

export default ProviderList;
