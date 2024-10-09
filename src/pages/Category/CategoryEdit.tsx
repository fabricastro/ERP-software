import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/CategoryService';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import Alert from '../../pages/UiElements/Alerts';
import Loader from '../../common/Loader';

const CategoryEdit = () => {
    const { id } = useParams(); // Obtener ID de la categoría
    const navigate = useNavigate();
    const [category, setCategory] = useState<any | null>(null);
    const [alert, setAlert] = useState<{ type: string; title: string; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await categoryService.getById(Number(id)); // Obtener la categoría por ID
                setCategory(data);
            } catch (error) {
                setAlert({ type: 'error', title: 'Error', message: 'No se pudo cargar la categoría' });
            }
        };
        fetchCategory();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await categoryService.updateCategory(Number(id), category); 
            setAlert({ type: 'success', title: 'Éxito', message: 'Categoría actualizada correctamente' });
            setTimeout(() => {
                navigate('/article/category');
            }, 2000);
        } catch (error) {
            setAlert({ type: 'error', title: 'Error', message: 'No se pudo actualizar la categoría' });
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategory((prevCategory: any) => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    if (!category) {
        return <Loader />;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Editar Categoría" />
            <div className="flex flex-col gap-5.5 p-6.5">
                {alert && <Alert type={alert.type} title={alert.title} message={alert.message} />}
                <form onSubmit={handleUpdate}>
                    <div>
                        <label className="mb-3 block text-black dark:text-white">Nombre de Categoría:</label>
                        <input
                            type="text"
                            name="name"
                            value={category.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-3 block text-black dark:text-white">Color:</label>
                        <input
                            type="color"
                            name="color"
                            value={category.color}
                            onChange={handleChange}
                            required
                            className="w-full h-10 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    <button className="mt-10 inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90" type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};

export default CategoryEdit;
