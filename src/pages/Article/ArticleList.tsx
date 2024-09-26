import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree"; // Importa la tabla reutilizable
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

const ArticleList: React.FC = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);

  // Cargar los artículos desde el localStorage
  useEffect(() => {
    const articulosGuardados = JSON.parse(localStorage.getItem("articulos") || "[]");
    setArticulos(articulosGuardados);
  }, []);

  // Definir las columnas para la tabla reutilizable
  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "precio", label: "Precio" },
    { key: "stock", label: "Stock" },
  ];

  // Opcional: Función para manejar acciones (editar, eliminar)
  const handleActions = (articulo: Articulo) => (
    <>
      <button className="hover:text-primary text-[25px]"><MdEdit /></button>
      <button className="hover:text-danger text-[20px]"><FaTrash /></button>
    </>
  );

  return (
    <div>
      <TableThree data={articulos} columns={columns} actions={handleActions} />
    </div>
  );
};

export default ArticleList;
