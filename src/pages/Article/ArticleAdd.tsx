import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { useState } from "react";

interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export const ArticleAdd = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  const agregarArticulo = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoArticulo: Articulo = {
      id: Date.now(),
      nombre,
      descripcion,
      precio: parseFloat(precio), // Convertir precio a número
      stock: parseInt(stock), // Convertir stock a número
    };

    // Obtener los artículos existentes en el LocalStorage
    const articulosGuardados = JSON.parse(localStorage.getItem('articulos') || '[]');

    // Agregar el nuevo artículo a la lista
    const nuevosArticulos = [...articulosGuardados, nuevoArticulo];

    // Guardar la lista actualizada en el LocalStorage
    localStorage.setItem('articulos', JSON.stringify(nuevosArticulos));

    // Limpiar los campos
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('');

    alert('Artículo agregado con éxito');
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Agregar Artículo" />
      <div className="flex flex-col gap-5.5 p-6.5">
        <form onSubmit={agregarArticulo}>
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
            <label className='mb-3 block text-black dark:text-white'>Descripción:</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className='mb-3 block text-black dark:text-white'>Precio:</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className='mb-3 block text-black dark:text-white'>Stock:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <button className='mt-10 inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10' type="submit">
            Agregar Artículo
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};
