import React, { useEffect, useState } from 'react';
import TableThree from "../../components/Tables/TableThree";
import { categoryService } from '../../services/CategoryService';
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import Alert from '../../pages/UiElements/Alerts';
import CategoryModal from './CategoryModal';
import ModalComponent from '../../components/ModalComponent';
import { Buttons } from '../../components/Buttons/Buttons';
import ConfirmDialog from '../../components/ConfirmDialog';

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
  
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; idToDelete: number | null }>({ isOpen: false, idToDelete: null });
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response);
      } catch {
        setError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setName('');
    setColor('#ffffff');
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setName(category.name);
    setColor(category.color);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'add') {
        const newCategory = await categoryService.addCategory({ name, color });
        setCategories([...categories, newCategory]);
        setAlert({ type: 'success', message: 'Categoría agregada con éxito' });
      } else if (modalMode === 'edit' && selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, { name, color });
        setCategories(categories.map(cat => (cat.id === selectedCategory.id ? { ...cat, name, color } : cat)));
        setAlert({ type: 'success', message: 'Categoría actualizada con éxito' });
      }
      setModalOpen(false);
    } catch {
      setAlert({ type: 'error', message: 'Error al guardar la categoría' });
    }
  };

  const handleDelete = async (id: number) => {
      try {
        await categoryService.deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
        setAlert({ type: 'success', message: 'Categoría eliminada con éxito' });
      } catch {
        setAlert({ type: 'error', message: 'Error al eliminar la categoría' });
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
    { key: "name", label: "Nombre" },
    { key: "color", label: "Color", render: (value: string) => <div style={{ backgroundColor: value, width: '50px', height: '20px' }} /> },
  ];

  const handleActions = (category: Category) => (
    <>
      <button onClick={() => handleEdit(category)} className="hover:text-primary text-[25px]"><MdEdit /></button>
      <button onClick={() => openConfirmDialog(category.id)} className="hover:text-danger text-[20px]"><FaTrashAlt /></button>
    </>
  );

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} />}
      <Buttons title={'Agregar Categoria'} to={handleAdd} customStyles='mb-10 '/>
      <TableThree data={categories} columns={columns} actions={handleActions}/>
      <ModalComponent isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalMode === 'add' ? 'Agregar categoría' : 'Editar categoría'} width="500px">
        <CategoryModal
          mode={modalMode}
          color={color}
          setColor={setColor}
          name={name}
          setName={setName}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      </ModalComponent>
      {confirmDialog.idToDelete !== null && (
        <ConfirmDialog
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar esta categoría?"
          onConfirm={confirmDelete}
          closeModal={() => setConfirmDialog({isOpen: false, idToDelete: null})}
        />
      )}
    </div>
  );
};

export default CategoryList;
