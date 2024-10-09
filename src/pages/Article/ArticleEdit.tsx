import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../../services/ArticleService';
import { categoryService } from '../../services/CategoryService';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import Alert from '../../pages/UiElements/Alerts';
import Loader from '../../common/Loader';

const ArticleEdit = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [article, setArticle] = useState<any | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const articleData = await articleService.getById(Number(id));
                setArticle(articleData);

                const categoryData = await categoryService.getAllCategories();
                setCategories(categoryData);
            } catch (error) {
                setAlert({ type: 'error', title: 'Error', message: 'No se pudo cargar el artículo' });
            }
        };
        fetchArticle();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await articleService.updateArticle(Number(id), article);
            setAlert({ type: 'success', title: 'Éxito', message: 'Artículo actualizado correctamente' });
            setTimeout(() => {
                navigate('/article');
            }, 2000);
        } catch (error) {
            setAlert({ type: 'error', title: 'Error', message: 'No se pudo actualizar el artículo' });
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const parsedValue = e.target.type === 'number' ? Number(value) : value; // Convierte los números
        setArticle((prevArticle: any) => ({
            ...prevArticle,
            [name]: parsedValue,
        }));
    };

    useEffect(() => {
        if (article?.internalCost && article?.profitability) {
            const newPrice = (article.internalCost * (1 + article.profitability / 100)).toFixed(2);
            setArticle((prevArticle: any) => ({
                ...prevArticle,
                unitPrice: Number(newPrice),
            }));
        }
    }, [article?.internalCost, article?.profitability]);

    if (!article) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar Artículo" />
            <div className="flex flex-col gap-5.5 p-6.5">
                {alert && <Alert type={alert.type} title={alert.title} message={alert.message} />}
                <form onSubmit={handleUpdate}>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Tipo de Artículo:</label>
                        <select
                            name="type"
                            value={article.type}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        >
                            <option value="Producto">Producto</option>
                            <option value="Servicio">Servicio</option>
                            <option value="Combo">Combo</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Título:</label>
                        <input
                            type="text"
                            name="name"
                            value={article.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Rubro o Categoría:</label>
                        <select
                            name="categoryId"
                            value={article.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Estado:</label>
                        <select
                            name="status"
                            value={article.status}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Descripción:</label>
                        <textarea
                            name="description"
                            value={article.description}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Código SKU:</label>
                        <input
                            type="text"
                            name="sku"
                            value={article.sku}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Código de Barras:</label>
                        <input
                            type="text"
                            name="barcode"
                            value={article.barcode}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Costo Interno sin IVA:</label>
                        <input
                            type="number"
                            name="internalCost"
                            value={article.internalCost}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Rentabilidad (%):</label>
                        <input
                            type="number"
                            name="profitability"
                            value={article.profitability}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Precio Unitario sin IVA:</label>
                        <input
                            type="number"
                            name="unitPrice"
                            value={article.unitPrice}
                            disabled
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Tipo de IVA:</label>
                        <input
                            type="number"
                            name="iva"
                            value={article.iva}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Proveedor:</label>
                        <input
                            type="number"
                            name="providerId"
                            value={article.providerId}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Observaciones:</label>
                        <textarea
                            name="observations"
                            value={article.observations}
                            onChange={handleChange}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={article.stock}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div className="flex justify-end gap-4.5">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90"
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default ArticleEdit;
