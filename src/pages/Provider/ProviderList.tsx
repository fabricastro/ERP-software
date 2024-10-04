import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree";
import { providerService } from "../../services/ProviderService";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

  // Columnas de la tabla
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
      <button className="hover:text-danger text-[20px]"><FaTrash /></button>
    </>
  );

  if (loading) return <p>Cargando proveedores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <TableThree data={proveedores} columns={columns} actions={handleActions} />
    </div>
  );
};

export default ProviderList;
