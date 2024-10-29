import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree";
import { articleService } from "../../services/ArticleService";
import { MdEdit } from "react-icons/md";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Alert from '../../pages/UiElements/Alerts';
import { Article } from "../../interfaces/article";
import ConfirmDialog from "../../components/ConfirmDialog"; // Asegúrate de importar el componente de confirmación

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; idToDelete: string | null }>({ isOpen: false, idToDelete: null });

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {

        const response = await articleService.getAll();
        if (response) {
          setArticles(response);
        } else {
          throw new Error('Estructura de respuesta inesperada');
        }
      } catch (err: any) {
        setError('Error al cargar los artículos');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleView = (id: number) => navigate(`/article/view/${id}`);
  const handleEdit = (id: number) => navigate(`/article/edit/${id}`);

  const handleDelete = async (id: string) => {
    try {
      await articleService.deleteArticle(id);
      setAlert({ type: 'success', message: 'Artículo eliminado con éxito' });
      setArticles((prev) => prev.filter((article) => article.id !== Number(id)));
    } catch {
      setAlert({ type: 'error', message: 'Error al eliminar el artículo' });
    }
  };

  const openConfirmDialog = (id: string) => setConfirmDialog({ isOpen: true, idToDelete: id });
  
  const confirmDelete = () => {
    if (confirmDialog.idToDelete !== null) {
      handleDelete(confirmDialog.idToDelete);
      setConfirmDialog({ isOpen: false, idToDelete: null });
    }
  };

  const handleActions = (article: Article) => (
    <>
      <button onClick={() => handleView(article.id)} className="hover:text-danger text-[20px]"><FaEye /></button>
      <button onClick={() => handleEdit(article.id)} className="hover:text-primary text-[25px]"><MdEdit /></button>
      <button onClick={() => openConfirmDialog(article.id.toString())} className="hover:text-danger text-[20px]"><FaTrash /></button>
    </>
  );

  if (loading) return <p>Cargando artículos...</p>;
  if (error) return <p>{error}</p>;

  const columns = [
    { key: "type", label: "Tipo" },
    { key: "name", label: "Nombre" },
    { key: "category.name", label: "Categoría", bgColor: "category.color" },
    { key: "stock", label: "Stock" },
    { key: "unitPrice", label: "Precio Unitario" },
    { key: "description", label: "Descripción" },
  ];

  return (
    <div>
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} />}
      <TableThree data={articles} columns={columns} actions={handleActions} />
      {confirmDialog.idToDelete !== null && (
        <ConfirmDialog
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar este artículo?"
          onConfirm={confirmDelete}
          closeModal={() => setConfirmDialog({ isOpen: false, idToDelete: null })}
        />
      )}
    </div>
  );
};

export default ArticleList;
