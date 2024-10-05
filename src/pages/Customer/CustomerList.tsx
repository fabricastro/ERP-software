import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree"; // Importa la tabla reutilizable
import { customerService } from "../../services/CustomerService";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Alert from '../../pages/UiElements/Alerts';

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

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (confirmDelete) {
      try {
        await customerService.deleteCustomer(id);
        setAlert({ type: 'success', message: 'Cliente eliminado con éxito' });
        setCustomer((prev) => prev.filter((customer) => customer.id !== id));
      } catch (error) {
        setAlert({ type: 'error', message: 'Error al eliminar el cliente' });
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
    navigate(`/customer/edit/${id}`);
  };
  const handleActions = (customer: Customer) => (
    <>
      <button onClick={() => handleEdit(customer.id)}
        className="hover:text-primary text-[25px]"><MdEdit /></button>
      <button onClick={() => handleDelete(customer.id)} className="hover:text-danger text-[20px]"><FaTrash /></button>
    </>
  );

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} />}
      <TableThree data={customer} columns={columns} actions={handleActions} />
    </div>
  );
};

export default CustomerList;
