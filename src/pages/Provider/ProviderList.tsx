import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree"; // Importa la tabla reutilizable

interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

const ProviderList: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  // Cargar los proveedores desde el localStorage
  useEffect(() => {
    const proveedoresGuardados = JSON.parse(localStorage.getItem("proveedores") || "[]");
    setProveedores(proveedoresGuardados);
  }, []);

  // Definir las columnas para la tabla reutilizable
  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    { key: "direccion", label: "Dirección" },
  ];

  // Opcional: Función para manejar acciones (editar, eliminar)
  const handleActions = (proveedor: Proveedor) => (
    <>
      <button className="hover:text-primary">Editar</button>
      <button className="hover:text-danger">Eliminar</button>
    </>
  );

  return (
    <div>
      <TableThree data={proveedores} columns={columns} actions={handleActions} />
    </div>
  );
};

export default ProviderList;
