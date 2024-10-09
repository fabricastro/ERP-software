import React, { useState } from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { categoryService } from "../../services/CategoryService";
import Alert from "../UiElements/Alerts";

export const CategoryAdd = () => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#ffffff'); // Color por defecto
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const agregarCategoria = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await categoryService.addCategory({ name, color });

            setAlert({ type: 'success', message: 'Categoría agregada con éxito' });
            setLoading(false);

            // Limpiar campos
            setName('');
            setColor('#ffffff');
        } catch (error: any) {
            setLoading(false);
            setAlert({ type: 'error', message: 'Hubo un error al agregar la categoría. Por favor, inténtalo de nuevo.' });
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar Categoría" />
            <div className="flex flex-col gap-5.5 p-6.5">
                {loading && <p>Cargando...</p>}
                {alert && (
                    <Alert
                        type={alert.type}
                        title={alert.type === 'success' ? 'Éxito' : 'Error'}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}
                <form onSubmit={agregarCategoria}>
                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Nombre de la Categoría:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Color:</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            required
                            className="w-full h-10 p-1 rounded-lg border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>

                    <button className='mt-10 inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90' type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Agregar Categoría'}
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};
