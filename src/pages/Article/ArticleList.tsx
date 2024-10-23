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

  // Estados para paginación y orden
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(100); // Fijamos el límite a 100 como en el ejemplo
  const [order, setOrder] = useState<{ column: string; typeOrder: 'ASC' | 'DESC' }>({
    column: 'name',
    typeOrder: 'ASC',
  });

  // Cargar los artículos
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await articleService.findArticles(page, limit);
  
        console.log('Respuesta completa de la API:', response);
  
        if (response && response.items) {
          setArticles(response.items);
        } else {
          throw new Error('Estructura de respuesta inesperada');
        }
  
        setLoading(false);
      } catch (err: any) {
        console.error('Error en la solicitud:', err); // Registro de error para depuración
        setError('Error al cargar los artículos');
        setLoading(false);
      }
    };
  
    fetchArticles();
  }, [page, limit]);
  



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
