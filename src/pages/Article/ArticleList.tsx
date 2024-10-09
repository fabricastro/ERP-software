import React, { useEffect, useState } from "react";
import TableThree from "../../components/Tables/TableThree"; // Importa la tabla reutilizable
import { articleService } from "../../services/ArticleService";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Alert from '../../pages/UiElements/Alerts';

interface Article {
  id: number;
  type: string;
  name: string;
  stock: number;
  unitPrice: number;
  description: string;
}

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Cargar los artículos
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await articleService.getAll();
        setArticles(response);
        setLoading(false);
      } catch (err: any) {
        setError('Error al cargar los artículos');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este artículo?');
    if (confirmDelete) {
      try {
        await articleService.deleteArticle(id);
        setAlert({ type: 'success', message: 'Artículo eliminado con éxito' });
        setArticles((prev) => prev.filter((article) => article.id !== Number(id)));
      } catch (error) {
        setAlert({ type: 'error', message: 'Error al eliminar el artículo' });
      }
    }
  };

  const columns = [
    { key: "type", label: "Tipo" },
    { key: "name", label: "Nombre" },
    { key: "stock", label: "Stock" },
    { key: "unitPrice", label: "Precio Unitario" },
    { key: "description", label: "Descripción" },
  ];

  const handleEdit = (id: number) => {
    navigate(`/article/edit/${id}`);
  };

  const handleActions = (article: Article) => (
    <>
      <button onClick={() => handleEdit(article.id)} className="hover:text-primary text-[25px]"><MdEdit /></button>
      <button onClick={() => handleDelete(article.id.toString())} className="hover:text-danger text-[20px]"><FaTrash /></button>
    </>
  );

  if (loading) return <p>Cargando artículos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {alert && <Alert type={alert.type} title={alert.type === 'success' ? 'Éxito' : 'Error'} message={alert.message} />}
      <TableThree data={articles} columns={columns} actions={handleActions} />
    </div>
  );
};

export default ArticleList;
