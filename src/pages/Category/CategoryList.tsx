import React, { useEffect, useState } from 'react';
import TableThree from "../../components/Tables/TableThree"; // Tabla reutilizable
import { categoryService } from '../../services/CategoryService';
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Alert from '../../pages/UiElements/Alerts';

interface Category {
  id: number;
  name: string;
  color: string;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response);
        setLoading(false);
      } catch (err: any) {
        setError('Error al cargar las categorías');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta categoría?');
    if (confirmDelete) {
      try {
        await categoryService.deleteCategory(id);
        setAlert({ type: 'success', message: 'Categoría eliminada con éxito' });
        setCategories((prev) => prev.filter((category) => category.id !== id));
      } catch (error) {
        setAlert({ type: 'error', message: 'Error al eliminar la categoría' });
      }
    }
  };

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "color", label: "Color", render: (value: string) => <div style={{ backgroundColor: value, width: '50px', height: '20px' }} /> },
  ];

  const handleEdit = (id: number) => {
    navigate(`/article/category/edit/${id}`);
  };

  const handleActions = (category: Category) => (
    <>
      <button onClick={() => handleEdit(category.id)}
        className="hover:text-primary text-[25px]"><MdEdit /></button>
      <button onClick={() => handleDelete(category.id)} className="hover:text-danger text-[20px]"><FaTrash /></button>
    </>
  );

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} />}
      <TableThree data={categories} columns={columns} actions={handleActions} />
    </div>
  );
};

export default CategoryList;
