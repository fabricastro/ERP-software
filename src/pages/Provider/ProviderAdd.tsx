import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { useState } from "react";

interface Proveedor {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
}

export const ProviderAdd = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');

    const agregarProveedor = (e: React.FormEvent) => {
        e.preventDefault();

        const nuevoProveedor: Proveedor = {
            id: Date.now(),
            nombre,
            email,
            telefono,
            direccion,
        };

        // Obtener los proveedores existentes en el LocalStorage
        const proveedoresGuardados = JSON.parse(localStorage.getItem('proveedores') || '[]');

        // Agregar el nuevo proveedor a la lista
        const nuevosProveedores = [...proveedoresGuardados, nuevoProveedor];

        // Guardar la lista actualizada en el LocalStorage
        localStorage.setItem('proveedores', JSON.stringify(nuevosProveedores));

        // Limpiar los campos
        setNombre('');
        setEmail('');
        setTelefono('');
        setDireccion('');

        alert('Proveedor agregado con éxito');
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Agregar Proveedor" />
            <div className="flex flex-col gap-5.5 p-6.5">
                <form onSubmit={agregarProveedor}>
                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Teléfono:</label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className='mb-3 block text-black dark:text-white'>Dirección:</label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            required
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <button className='mt-10 inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10' type="submit">
                        Agregar Proveedor
                    </button>
                </form>
            </div>
        </DefaultLayout>
    );
};