import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { useState, useEffect } from "react";
import { providerService } from "../../services/ProviderService";
import Alert from "../UiElements/Alerts";
import FormInput from "../../components/Input/input";
import { Provider } from "../../interfaces/provider";
import { useParams } from "react-router-dom";
import { Buttons } from '../../components/Buttons/Buttons';
import { provinces } from "../../utils/provinces";

interface ProviderFormProps {
  viewType: 'add' | 'edit' | 'view';
}

export const ProviderForm: React.FC<ProviderFormProps> = ({ viewType }) => {
  const { id } = useParams();
  const [type, setType] = useState('Persona Humana');
  const [name, setName] = useState('');
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

  const validateForm = () => {
    const isEmailValid = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isBusinessNameValid = name.trim() !== '';
    const isPhoneValid = phone.trim() !== '';

    setIsFormValid(isEmailValid && isBusinessNameValid && isPhoneValid);
  };

  useEffect(() => {
    validateForm();
  }, [email, name, phone]);

  useEffect(() => {
    if (viewType === 'edit' || viewType === 'view') {
      providerService.getById(id).then((providerData: Provider) => {
        setType(providerData.type);
        setName(providerData.name);
        setCuit(providerData.cuit);
        setFiscalAddress(providerData.fiscalAddress);
        setPostalCode(providerData.postalCode);
        setCommunity(providerData.community);
        setProvince(providerData.province);
        setCountry(providerData.country);
        setPhone(providerData.phone);
        setEmail(providerData.email);
        setWeb(providerData.web);
      }).catch(() => {
        setAlert({ type: 'error', message: 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.' });
      });
    }
  }, [viewType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (viewType === 'add') {
        await providerService.addProvider({
          type,
          name,
          cuit,
          fiscalAddress,
          postalCode,
          community,
          province,
          country,
          phone,
          email,
          web,
        });
        setAlert({ type: 'success', message: 'Proveedor agregado con éxito' });
      } else if (viewType === 'edit') {
        await providerService.updateProvider(id, {
          type,
          name,
          cuit,
          fiscalAddress,
          postalCode,
          community,
          province,
          country,
          phone,
          email,
          web,
        });
        setAlert({ type: 'success', message: 'Proveedor actualizado con éxito' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.' });
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={viewType === 'add' ? "Agregar Proveedor" : viewType === 'edit' ? "Editar Proveedor" : "Ver Proveedor"} />
      
      <div className="relative flex flex-col pt-5 min-h-screen">
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
              label="Tipo de Proveedor"
              type="select"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={["Persona Humana", "Persona Jurídica"]}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="Nombre"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="CUIT"
              type="text"
              id="cuit"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="Dirección Fiscal"
              type="text"
              id="fiscalAddress"
              value={fiscalAddress}
              onChange={(e) => setFiscalAddress(e.target.value)}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="Código Postal"
              type="text"
              id="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="Localidad/Comunidad"
              type="text"
              id="community"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="Provincia"
              type="text"
              id="province"
              value={province}
              options={provinces}
              onChange={(e) => setProvince(e.target.value)}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="País"
              type="text"
              id="country"
              value={country}
              options={['Argentina']}
              onChange={(e) => setCountry(e.target.value)}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="Teléfono"
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="Correo Electrónico"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="Página Web"
              type="text"
              id="web"
              value={web}
              onChange={(e) => setWeb(e.target.value)}
              disabled={viewType === 'view'}
            />
          </div>

          {viewType !== 'view' && (
            <Buttons
              title={viewType === 'add' ? 'Agregar Proveedor' : 'Guardar Cambios'} 
              type="submit" bgColor="bg-primary" textColor="text-gray" disabled={!isFormValid} />
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};
