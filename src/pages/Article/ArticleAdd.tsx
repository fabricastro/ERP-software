import React, { useEffect, useState } from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { articleService } from "../../services/ArticleService";
import { categoryService } from "../../services/CategoryService";
import Alert from "../UiElements/Alerts";

export const ArticleAdd = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [type, setType] = useState('Producto');
  const [categoryId, setCategoryId] = useState(1);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Activo');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [internalCost, setInternalCost] = useState<string>("");
  const [profitability, setProfitability] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [iva, setIva] = useState<number>(21);
  const [providerId, setProviderId] = useState<number>(1);
  const [observations, setObservations] = useState<string>('');
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const regex = /^[0-9]*[.,]?[0-9]*$/;

    if (regex.test(value)) {
      setInternalCost(value);
      calcularPrecioUnitario(value, profitability);
    }
  };

  const handleProfitabilityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const regex = /^[0-9]*[.,]?[0-9]*$/;

    if (regex.test(value)) {
      setProfitability(value);
      calcularPrecioUnitario(internalCost, value);
    }
  };

  const calcularPrecioUnitario = (cost: string, profit: string) => {
    const costNumber = parseFloat(cost.replace(',', '.'));
    const profitNumber = parseFloat(profit.replace(',', '.'));

    if (!isNaN(costNumber) && !isNaN(profitNumber)) {
      const precioUnitario = costNumber + (costNumber * (profitNumber / 100));
      setUnitPrice(precioUnitario);
    }
  };

  const agregarArticulo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await articleService.addArticle({
        type,
        categoryId,
        name,
        status,
        description,
        sku,
        barcode,
        internalCost: parseFloat(internalCost.replace(',', '.')),
        profitability: parseFloat(profitability.replace(',', '.')),
        unitPrice,
        iva,
        providerId,
        observations,
        stock
      });

      setAlert({ type: 'success', message: 'Artículo agregado con éxito' });
      setLoading(false);

      setType('Producto');
      setCategoryId(1);
      setName('');
      setStatus('Activo');
      setDescription('');
      setSku('');
      setBarcode('');
      setInternalCost('');
      setProfitability('');
      setUnitPrice(0);
      setIva(21);
      setProviderId(1);
      setObservations('');
      setStock(0);

    } catch (error: any) {
      setLoading(false);
      setAlert({ type: 'error', message: 'Hubo un error al agregar el artículo. Por favor, inténtalo de nuevo.' });
    }
  };

  return (
    <DefaultLayout>
        <Breadcrumb pageName="Agregar Artículo" />
        <div className="flex flex-col gap-5.5 p-6.5">
          {loading && <p>Cargando...</p>}
          {alert && (
            <Alert
              type={alert.type}
              title={alert.type === 'success' ? 'Éxito' : 'Error'}
              message={alert.message}
              onClose={() => setAlert(null)} // Cerrar la alerta
            />
          )}
          <form onSubmit={agregarArticulo}>
            <div className="grid grid-cols-1 gap-15 md:grid-cols-3">

              <div>
                <label className='mb-3 block text-black dark:text-white'>Título:</label>
                <input
                  placeholder='Ingrese el nombre del Artículo'
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>
              <div>
                <label className='mb-3 block text-black dark:text-white'>Tipo de Artículo:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                >
                  <option value="Producto">Producto</option>
                  <option value="Servicio">Servicio</option>
                </select>
              </div>

              <div>
                <label className='mb-3 block text-black dark:text-white'>Stock:</label>
                <input
                  placeholder='Ingrese el stock del Artículo'
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div>
                <label className='mb-3 block text-black dark:text-white'>Rubro o Categoría:</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
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
                <label className='mb-3 block text-black dark:text-white'>Código SKU:</label>
                <input
                  placeholder='Ingrese el Código SKU'
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div>
                <label className='mb-3 block text-black dark:text-white'>Código de Barras:</label>
                <input
                  placeholder='Ingrese el Código de Barras'
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div>
                <label className='mb-3 block text-black dark:text-white'>Costo Interno sin IVA:</label>
                <input
                  placeholder='Ingrese el Costo Interno sin IVA'
                  type="text"
                  value={internalCost}
                  onChange={handleCostChange}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div>
                <label className='mb-3 block text-black dark:text-white'>Rentabilidad (%):</label>
                <input
                  placeholder='Ingrese la Rentabilidad (%)'
                  type="text"
                  value={profitability}
                  onChange={handleProfitabilityChange}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div>
                <label className='mb-3 block text-black dark:text-white'>Precio Unitario sin IVA:</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  required
                  disabled
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div>
                <label className='mb-3 block text-black dark:text-white'>Tipo de IVA:</label>
                <input
                  type="number"
                  value={iva}
                  onChange={(e) => setIva(Number(e.target.value))}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div>
                <label className='mb-3 block text-black dark:text-white'>Proveedor:</label>
                <input
                  type="number"
                  value={providerId}
                  onChange={(e) => setProviderId(Number(e.target.value))}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div>
                <label className='mb-3 block text-black dark:text-white'>Estado:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

            </div>

            <div>
              <label className='mb-3 block text-black dark:text-white'>Observaciones:</label>
              <textarea
                placeholder='Ingrese las observaciones'
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            <div>
              <label className='mb-3 block text-black dark:text-white'>Descripción:</label>
              <textarea
                placeholder='Ingrese la descripción'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            <button className='mt-10 inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10' type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Agregar Artículo'}
            </button>
          </form>
        </div>
    </DefaultLayout>
  );
};
