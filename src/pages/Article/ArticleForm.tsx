import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { useState, useEffect } from "react";
import { articleService } from "../../services/ArticleService";
import Alert from "../UiElements/Alerts";
import FormInput from "../../components/Input/input";
import { Article } from "../../interfaces/article";
import { useNavigate, useParams } from "react-router-dom";
import { Buttons } from "../../components/Buttons/Buttons";
import { categoryService } from "../../services/CategoryService";
import ModalComponent from '../../components/ModalComponent';
import CategoryModal from "../Category/CategoryModal";
import { OptionType } from "../../interfaces/optionType";
import SelectForm from "../../components/Input/select";
import { Category } from "../../interfaces/category";
import { providerService } from "../../services/ProviderService";
import { Provider } from "../../interfaces/provider";
import ProviderModal from "../Provider/ProviderModal";

interface ArticleFormProps {
  viewType: 'add' | 'edit' | 'view';
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ viewType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Articles values
  const [type, setType] = useState('Producto');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Activo');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [internalCost, setInternalCost] = useState<number>(0);
  const [profitability, setProfitability] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [iva, setIva] = useState<OptionType | null>(null);
  const [observations, setObservations] = useState<string>('');
  const [stock, setStock] = useState<number>(0);
  
  const [selectedCategory, setSelectedCategory] = useState<OptionType | null>(null);
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<OptionType | null>(null);
  const [providers, setProviders] = useState<OptionType[]>([]);
  const ivaOptions = [
    { value: 21, label: '21%' },
    { value: 10, label: '10%' },
    { value: 10.5, label: '10.5%' },
    { value: 4, label: '4%' },
    { value: 0, label: '0%' },
    
  ] as OptionType[];
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [color, setColor] = useState('');
  
  // Estados del formulario de proveedor
  const [typeProvider, setTypeProvider] = useState('Persona Humana');
  const [nameProvider, setNameProvider] = useState('');
  const [cuit, setCuit] = useState('');
  const [fiscalAddress, setFiscalAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [community, setCommunity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('Argentina');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [web, setWeb] = useState('');
  
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  
  const loadOptions = async (inputValue: string): Promise<OptionType[]> => {
    try {
      const fetchedCategories = await categoryService.getAllCategories();
        const filteredCategories = fetchedCategories
        .filter((category) =>
          category.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((category) => ({
          value: category.id,
          label: category.name,
        }));
  
      setCategories(filteredCategories);
      return filteredCategories;
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
      return [];
    }
  };
  
  useEffect(() => {
    loadOptions('');
  }, []);
  
  const loadProviders = async (inputValue: string): Promise<OptionType[]> => {
    try {
      const fetchedProviders = await providerService.getAll();
        const filteredProviders = fetchedProviders
        .filter((provider) =>
          provider.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((provider) => ({
          value: provider.id as number,
          label: provider.name as string,
        }));
      setProviders(filteredProviders);
      return filteredProviders;
    } catch (error) {
      console.error("Error al cargar los proveedores:", error);
      return [];
    }
  };

  useEffect(() => {
    loadProviders('');
  }, []);
  
  const handleCategoryChange = (selectedOption: OptionType | null) => {
    setSelectedCategory(selectedOption);
  };
  const handleProviderChange = (selectedOption: OptionType | null) => {
    setSelectedProvider(selectedOption);
  };
  
  const handleIvaChange = (selectedOption: OptionType | null) => {
    setIva(selectedOption);
  };
  
  const openCategoryModal = () => {
    setIsCategoryModalOpen(true)
  }
  
  const openProviderModal = () => {
    setIsProviderModalOpen(true)
  }
  
  const validateForm = () => {
    const isNameValid = name.trim() !== '';
    const isTypeValid = type.trim() !== '';
    const isStatusValid = status.trim() !== '';
    const isSkuValid = sku.trim() !== '';
    const isBarcodeValid = barcode.trim() !== '';
    const isInternalCostValid = internalCost > 0;
    const isProfitabilityValid = profitability >= 0;
    const isUnitPriceValid = unitPrice > 0;
    const isIvaValid = iva !== null;
    const isStockValid = stock >= 0;
    const isSelectedCategoryValid = selectedCategory !== null;
    const isSelectedProviderValid = selectedProvider !== null;
    const isDescriptionValid = description.trim() !== '';
  
    setIsFormValid(
      isNameValid &&
      isTypeValid &&
      isStatusValid &&
      isSkuValid &&
      isBarcodeValid &&
      isInternalCostValid &&
      isProfitabilityValid &&
      isUnitPriceValid &&
      isIvaValid &&
      isStockValid &&
      isSelectedCategoryValid &&
      isSelectedProviderValid &&
      isDescriptionValid
    );
  };
  
  useEffect(() => {
    validateForm();
  }, [
    name, type, status, sku, barcode, internalCost, profitability, unitPrice,
    iva, stock, selectedCategory, selectedProvider, description
  ]);

  useEffect(() => {
    if ((viewType === 'edit' || viewType === 'view') && id) {
      articleService.getById(id)
        .then((articleData: Article) => {
          setType(articleData.type);
          setName(articleData.name);
          setStatus(articleData.status);
          setDescription(articleData.description);
          setSku(articleData.sku);
          setBarcode(articleData.barcode);
          setInternalCost(articleData.internalCost);
          setProfitability(articleData.profitability);
          setUnitPrice(articleData.unitPrice);
          setIva(articleData.iva ? { value: articleData.iva, label: articleData.iva.toString() } : null);
          setStock(articleData.stock);
          setSelectedCategory(
            articleData.categoryId && articleData.category
              ? { value: articleData.categoryId, label: articleData.category.name }
              : null
          );
          
          setSelectedProvider(
            articleData.providerId && articleData.provider
              ? { value: articleData.providerId, label: articleData.provider.name }
              : null
          );
          
          setObservations(articleData.observations || '');
        })
        .catch(() => {
          setAlert({ type: 'error', message: 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.' });
        });
    }
  }, [id, viewType]);  
  
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const regex = /^[0-9]*[.,]?[0-9]*$/;
  
    if (regex.test(value)) {
      const numericValue = parseFloat(value.replace(',', '.'));
      if (!isNaN(numericValue)) {
        setInternalCost(numericValue);
        calculateUnitPrice(numericValue, profitability ?? 0);
      }
    }
  };
  
  const handleProfitabilityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const regex = /^[0-9]*[.,]?[0-9]*$/;
  
    if (regex.test(value)) {
      const numericValue = parseFloat(value.replace(',', '.'));
      if (!isNaN(numericValue)) {
        setProfitability(numericValue);
        calculateUnitPrice(internalCost ?? 0, numericValue);
      }
    }
  };
  
  const calculateUnitPrice = (cost: number, profit: number) => {
    if (!isNaN(cost) && !isNaN(profit)) {
      const unitPrice = cost + (cost * (profit / 100));
      setUnitPrice(unitPrice);
    }
  };
    
  const handleCategoryCloseModal = () => setIsCategoryModalOpen(false);

  const handleAddCategory = async () => {
    if (!color || !newCategoryName) {
      return setAlert({ type: 'error', message: 'Por favor, completa todos los campos obligatorios antes de guardar.' });
    }
    try {
      const newCategory: Category = await categoryService.addCategory({ color, name: newCategoryName });
      setAlert({ type: 'success', message: 'Categoria agregada con éxito' });
  
      setSelectedCategory({ value: newCategory.id, label: newCategory.name });
      setCategories(prevCategories => [
        ...prevCategories,
        { value: newCategory.id, label: newCategoryName }
      ]);
      
      setNewCategoryName('');

      handleCategoryCloseModal();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al agregar la categoría. Inténtalo de nuevo.' });
    }
  };
  
  const handleProviderCloseModal = () => setIsProviderModalOpen(false);
  
  const handleAddProvider = async () => {
    if (!nameProvider || !cuit || !fiscalAddress || !postalCode || !community || !province || !phone || !email) {
      return setAlert({ type: 'error', message: 'Por favor, completa todos los campos obligatorios antes de guardar.' });
    }
    
    try {
      const newProvider: Provider = await providerService.addProvider({
        name: nameProvider,
        cuit,
        fiscalAddress,
        postalCode,
        community,
        province,
        country,
        phone,
        email,
        web,
        type: typeProvider,
        id: 0
      });
      
      setAlert({ type: 'success', message: 'Proveedor agregado con éxito' });
      setSelectedProvider({ value: newProvider.id, label: newProvider.name });
      setProviders(prevProviders => [
        ...prevProviders,
        { value: newProvider.id, label: newProvider.name }
      ]);
      
      setNameProvider('');
      setCuit('');
      setFiscalAddress('');
      setPostalCode('');
      setCommunity('');
      setProvince('');
      setCountry('Argentina');
      setPhone('');
      setEmail('');
      setWeb('');
      
      handleProviderCloseModal();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al agregar el proveedor. Inténtalo de nuevo.' });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (viewType === 'add') {
        await articleService.addArticle({
          type,
          categoryId: selectedCategory?.value as number,
          name,
          status,
          description,
          sku,
          barcode,
          internalCost,
          profitability,
          unitPrice,
          iva: iva?.value as number,
          providerId: selectedProvider?.value as number,
          observations,
          stock,
          id: 0
        });
        setAlert({ type: 'success', message: 'Artículo agregado con éxito' });
        setTimeout(() => {
          navigate('/article');
        }, 2000);
      } else if (viewType === 'edit') {
        await articleService.updateArticle(id, {
          type,
          categoryId: selectedCategory?.value as number,
          name,
          status,
          description,
          sku,
          barcode,
          internalCost,
          profitability,
          unitPrice,
          iva: iva?.value as number,
          providerId: selectedProvider?.value as number,
          observations,
          stock,
          id: 0
        });
        setAlert({ type: 'success', message: 'Artículo actualizado con éxito' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.' });
    }
  };

  return (
    <DefaultLayout>
  <Breadcrumb pageName="Agregar Artículo" />
  {alert && (
    <Alert
      type={alert.type}
      title={alert.type === 'success' ? 'Éxito' : 'Error'}
      message={alert.message}
      onClose={() => setAlert(null)}
    />
  )}
  <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

      <FormInput
        label="Nombre"
        type="text"
        id="name"
        value={name}
        placeholder="Ingrese el nombre"
        onChange={(e) => setName(e.target.value)}
        required
        disabled={viewType === 'view'}
      />

      <FormInput
        label="Tipo de Artículo"
        type="select"
        id="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        options={[
          { label: "Producto", value: "Producto" },
          { label: "Servicio", value: "Servicio" },
        ]}
        required
        disabled={viewType === 'view'}
      />

      <FormInput
        label="Stock"
        type="number"
        id="stock"
        value={stock}
        placeholder="Ingrese el stock del Artículo"
        onChange={(e) => setStock(Number(e.target.value))}
        required
        disabled={viewType === 'view'}
      />
      
      <SelectForm
        label="Categoría"
        id="categorySelect"
        value={selectedCategory}
        options={categories}
        onChange={handleCategoryChange}
        placeholder="Selecciona una categoría"
        additionalClasses="react-select-container"
        required
        onButtonClick={openCategoryModal}
        isDisabled={viewType === 'view'}
      />
      
      <ModalComponent isOpen={isCategoryModalOpen} onClose={handleCategoryCloseModal} title="Agregar categoría" width="500px">
        <CategoryModal
          mode="add"
          color={color}
          setColor={setColor}
          name={newCategoryName}
          setName={setNewCategoryName}
          onClose={handleCategoryCloseModal}
          onSave={handleAddCategory}
        />
      </ModalComponent>

      <FormInput
        label="Código SKU"
        type="text"
        id="sku"
        value={sku}
        placeholder="Ingrese el Código SKU"
        onChange={(e) => setSku(e.target.value)}
        required
        disabled={viewType === 'view'}
      />

      <FormInput
        label="Código de Barras"
        type="text"
        id="barcode"
        value={barcode}
        placeholder="Ingrese el Código de Barras"
        onChange={(e) => setBarcode(e.target.value)}
        required
        disabled={viewType === 'view'}
      />

      <FormInput
        label="Costo Interno sin IVA"
        type="number"
        id="internalCost"
        value={internalCost}
        placeholder="Ingrese el Costo Interno sin IVA"
        onChange={handleCostChange}
        required
        disabled={viewType === 'view'}
      />

      <FormInput
        label="Rentabilidad (%)"
        type="number"
        id="profitability"
        value={profitability}
        placeholder="Ingrese la Rentabilidad (%)"
        onChange={handleProfitabilityChange}
        required
        disabled={viewType === 'view'}
      />

      <FormInput
        label="Precio Unitario sin IVA"
        type="number"
        id="unitPrice"
        value={unitPrice}
        onChange={(e) => setUnitPrice(Number(e.target.value))}
        required
        disabled
      />
      
      <SelectForm
        label="Tipo de IVA"
        id="iva"
        value={iva}
        options={ivaOptions}
        onChange={handleIvaChange}
        placeholder="Selecciona un tipo de IVA"
        required
        isDisabled={viewType === 'view'}
      />

      <SelectForm
        label="Proveedor"
        id="providerId"
        value={selectedProvider}
        options={providers}
        onChange={handleProviderChange}
        placeholder="Selecciona un proveedor"
        required
        onButtonClick={openProviderModal}
        isDisabled={viewType === 'view'}
      />
      
      <ModalComponent isOpen={isProviderModalOpen} onClose={handleProviderCloseModal} title="Agregar proveedor">
        <ProviderModal
          type={typeProvider} setType={setTypeProvider}
          name={nameProvider} setName={setNameProvider}
          cuit={cuit} setCuit={setCuit}
          fiscalAddress={fiscalAddress} setFiscalAddress={setFiscalAddress}
          postalCode={postalCode} setPostalCode={setPostalCode}
          community={community} setCommunity={setCommunity}
          province={province} setProvince={setProvince}
          country={country} setCountry={setCountry}
          phone={phone} setPhone={setPhone}
          email={email} setEmail={setEmail}
          web={web} setWeb={setWeb}
          onSave={handleAddProvider}
        />
      </ModalComponent>

      <FormInput
        label="Estado"
        type="select"
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={["Activo", "Inactivo"]}
        required
        disabled={viewType === 'view'}
      />

    </div>

    <FormInput
      label="Observaciones"
      type="textarea"
      id="observations"
      value={observations}
      placeholder="Ingrese las observaciones"
      onChange={(e) => setObservations(e.target.value)}
      disabled={viewType === 'view'}
    />

    <FormInput
      label="Descripción"
      type="textarea"
      id="description"
      value={description}
      placeholder="Ingrese la descripción"
      onChange={(e) => setDescription(e.target.value)}
      disabled={viewType === 'view'}
      required
    />
    
    {viewType !== 'view' && (
      <Buttons
        title={viewType === 'add' ? 'Agregar' : 'Guardar Cambios'} 
        type="submit" bgColor="bg-primary" textColor="text-gray" disabled={!isFormValid} />
    )}
  </form>
</DefaultLayout>

  );
};
