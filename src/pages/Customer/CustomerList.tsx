import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree"; // Importa la tabla reutilizable

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

const CustomerList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Cargar los clientes desde el localStorage
  useEffect(() => {
    const clientesGuardados = JSON.parse(localStorage.getItem("clientes") || "[]");
    setClientes(clientesGuardados);
  }, []);

  // Definir las columnas para la tabla reutilizable
  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    { key: "direccion", label: "Dirección" },
  ];

  // Opcional: Función para manejar acciones (editar, eliminar)
  const handleActions = (cliente: Cliente) => (
    <>
      <button className="hover:text-primary">Editar</button>
      <button className="hover:text-danger">Eliminar</button>
    </>
  );

  return (
    <div>
      <TableThree data={clientes} columns={columns} actions={handleActions} />
    </div>
  );
};

export default CustomerList;
