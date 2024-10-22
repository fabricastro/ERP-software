import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { useState, useEffect } from "react";
import { customerService } from "../../services/CustomerService";
import Alert from "../UiElements/Alerts";
import FormInput from "../../components/Input/input";
import { Customer } from "../../interfaces/customer";
import { useNavigate, useParams } from "react-router-dom";
import { Buttons } from '../../components/Buttons/Buttons';
import { provinces } from "../../utils/provinces";

interface CustomerFormProps {
  viewType: 'add' | 'edit' | 'view';
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ viewType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    const isCuitValid = cuit.trim() !== '';
    const isFiscalAddressValid = fiscalAddress.trim() !== '';
    const isPostalCodeValid = postalCode.trim() !== '';
    const isCommunityValid = community.trim() !== '';
    const isProvinceValid = province.trim() !== '';
    const isCountryValid = country.trim() !== '';
  
    setIsFormValid(
      isEmailValid &&
      isBusinessNameValid &&
      isPhoneValid &&
      isCuitValid &&
      isFiscalAddressValid &&
      isPostalCodeValid &&
      isCommunityValid &&
      isProvinceValid &&
      isCountryValid
    );
  };
  
  useEffect(() => {
    validateForm();
  }, [email, name, phone, cuit, fiscalAddress, postalCode, community, province, country]);
  

  useEffect(() => {
    if (viewType === 'edit' || viewType === 'view') {
      customerService.getById(id).then((customerData: Customer) => {
        setType(customerData.type);
        setName(customerData.name);
        setCuit(customerData.cuit);
        setFiscalAddress(customerData.fiscalAddress);
        setPostalCode(customerData.postalCode);
        setCommunity(customerData.community);
        setProvince(customerData.province);
        setCountry(customerData.country);
        setPhone(customerData.phone);
        setEmail(customerData.email);
        setWeb(customerData.web);
      }).catch(() => {
        setAlert({ type: 'error', message: 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.' });
      });
    }
  }, [viewType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (viewType === 'add') {
        await customerService.addCustomer({
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
        setAlert({ type: 'success', message: 'Cliente agregado con éxito' });
        setTimeout(() => {
          navigate('/customer');
        }, 2000);
      } else if (viewType === 'edit') {
        await customerService.updateCustomer(id, {
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
        setAlert({ type: 'success', message: 'Cliente actualizado con éxito' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.' });
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={viewType === 'add' ? "Agregar Cliente" : viewType === 'edit' ? "Editar Cliente" : "Ver Cliente"} />
      
      <div className="relative flex flex-col pt-5">
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
              label="Tipo de Cliente"
              type="select"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={["Persona Humana", "Persona Jurídica"]}
              disabled={viewType === 'view'}
              required
            />
            <FormInput
              label="Nombre y apellido"
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
              title={viewType === 'add' ? 'Agregar' : 'Guardar Cambios'} 
              type="submit" bgColor="bg-primary" textColor="text-gray" disabled={!isFormValid} />
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};
