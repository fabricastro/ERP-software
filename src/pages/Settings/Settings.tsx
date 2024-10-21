import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuth } from '../../context/AuthContext';
import { updateUserService } from '../../services/user';
import { updateSettingsService } from '../../services/Settings';
import Alert from '../UiElements/Alerts';
import FormInput from '../../components/Input/input';
import { Buttons } from '../../components/Buttons/Buttons';
import { useSettings } from '../../context/SettingsContext';

const Settings = () => {
  /* Set User Data */
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [activeTab, setActiveTab] = useState('cliente');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  
  /* Set Settings Data */
  const { settings, setSettings } = useSettings();
  const [bussinessName, setBussinessName] = useState(settings?.bussinessName || '');
  const [address, setAddress] = useState(settings?.address || '');
  const [phoneSettings, setPhoneSettings] = useState(settings?.phone || '');
  const [cuit, setCuit] = useState(settings?.cuit || '');
  const [emailSettings, setEmailSettings] = useState(settings?.email || '');
  const [website, setWebsite] = useState(settings?.website || '');
  const [logo, setLogo] = useState(settings?.logo || '');
  const [numberAccount, setNumberAccount] = useState(settings?.numberAccount || '');
  const [nextBillId, setNextBillId] = useState(settings?.nextBillId ?? 1);
  const [nextBudgetId, setNextBudgetId] = useState(settings?.nextBudgetId ?? 1);
  
  
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormSettingsValid, setIsFormSettingsValid] = useState(false);
  
  const validateForm = () => {
    const isEmailValid = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isBusinessNameValid = name.trim() !== '';
    const isPhoneValid = phone.trim() !== '';

    setIsFormValid(isEmailValid && isBusinessNameValid && isPhoneValid);
  };
  
  useEffect(() => {
    validateForm();
  }, [email, name, phone]);
  
  const validateSettingsForm = () => {
    const isBussinessNameValid = bussinessName.trim() !== '';
    const isAddressValid = address.trim() !== '';
    const isCuitValid = cuit.trim() !== '';
    const isPhoneSettingsValid = phoneSettings.trim() !== '' && /^\d+$/.test(phoneSettings);
    const isEmailSettingsValid = emailSettings.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSettings);
    const isNumberAccountValid = numberAccount.trim() !== '';
    const isNextBillIdValid = nextBillId > 0;
    const isNextBudgetIdValid = nextBudgetId > 0;
  
    setIsFormSettingsValid(
      isAddressValid &&
      isBussinessNameValid &&
      isCuitValid &&
      isPhoneSettingsValid &&
      isEmailSettingsValid &&
      isNumberAccountValid &&
      isNextBillIdValid &&
      isNextBudgetIdValid
    );
  };
  
  useEffect(() => {
    validateSettingsForm();
  }, [bussinessName, address, cuit, phoneSettings, emailSettings, numberAccount, nextBillId, nextBudgetId]);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();    
    try {
      const updatedUser = await updateUserService(user.id, { name, email, phone, password });
      setUser(updatedUser);
      setAlert({
        type: 'success',
        message: 'Información actualizada con éxito',
      });
    } catch (error: any) {
      setAlert({ type: 'error', message: 'Error al actualizar el documento' });
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedSettings = await updateSettingsService({
        bussinessName,
        address,
        cuit,
        phone: phoneSettings,
        email: emailSettings,
        website,
        logo,
        numberAccount,
        nextBillId,
        nextBudgetId,
        
      });
      setSettings(updatedSettings);
      setAlert({
        type: 'success',
        message: 'Información de la empresa actualizada con éxito',
      });
    } catch (error: any) {
      setAlert({ type: 'error', message: 'Error al actualizar el documento' });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <DefaultLayout>
  <Breadcrumb pageName="Configuración" />
  {alert && (
    <Alert
      type={alert.type}
      title={alert.type === 'success' ? 'Éxito' : 'Error'}
      message={alert.message}
      onClose={() => setAlert(null)} // Cerrar la alerta
    />
  )}

  <div className="grid grid-cols-3 gap-8">
    <div className="col-span-5 xl:col-span-3">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex gap-4 border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3
            className={`tab-settings font-medium text-black dark:text-white ${activeTab === 'cliente' ? 'active' : ''}`}
            onClick={() => handleTabChange('cliente')}
          >
            Información básica
          </h3>
          <h3
            className={`tab-settings font-medium text-black dark:text-white ${activeTab === 'empresa' ? 'active' : ''}`}
            onClick={() => handleTabChange('empresa')}
          >
            Información empresa
          </h3>
        </div>

        {/* Información Cliente */}
        {activeTab === 'cliente' && (
          <div className="p-7">
            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormInput
                  label="Correo Electrónico"
                  type="email"
                  id="emailAddress"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FormInput
                  label="Nombre y Apellido"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <FormInput
                  label="Número de Teléfono"
                  type="text"
                  id="phoneNumber"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <FormInput
                  label="Cambiar Contraseña"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa una nueva contraseña (opcional)"
                />
              </div>

              <div className="flex justify-end mt-4">
                <Buttons title="Guardar" type="submit" bgColor="bg-primary" textColor="text-gray" disabled={!isFormValid} />
              </div>
            </form>
          </div>
        )}

        {/* Información Empresarial */}
        {activeTab === 'empresa' && (
          <div className="p-7">
            <form onSubmit={handleSettingsSubmit}>
              <div className="grid sm:grid-cols-3 gap-4">
                <FormInput
                  label="Nombre de la empresa"
                  type="text"
                  id="bussinessName"
                  value={bussinessName}
                  onChange={(e) => setBussinessName(e.target.value)}
                  required
                />
                <FormInput
                  label="Dirección de empresa"
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <FormInput
                  label="CUIT"
                  type="text"
                  id="cuit"
                  value={cuit}
                  onChange={(e) => setCuit(e.target.value)}
                  required
                />
                <FormInput
                  label="Teléfono"
                  type="text"
                  id="phoneSettings"
                  value={phoneSettings}
                  onChange={(e) => setPhoneSettings(e.target.value)}
                  required
                />
                <FormInput
                  label="Correo Electrónico"
                  type="email"
                  id="emailSettings"
                  value={emailSettings}
                  onChange={(e) => setEmailSettings(e.target.value)}
                  required
                />
                <FormInput
                  label="Sitio Web"
                  type="text"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <FormInput
                  label="Logotipo"
                  type="text"
                  id="logo"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
                <FormInput
                  label="Número de Cuenta"
                  type="text"
                  id="numberAccount"
                  value={numberAccount}
                  onChange={(e) => setNumberAccount(e.target.value)}
                  required
                />
                <FormInput
                  label="Próxima Factura ID"
                  type="number"
                  id="nextBillId"
                  value={nextBillId}
                  onChange={(e) => setNextBillId(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  required
                />
                <FormInput
                  label="Próximo Presupuesto ID"
                  type="number"
                  id="nextBudgetId"
                  value={nextBudgetId}
                  onChange={(e) => setNextBudgetId(e.target.value ? parseInt(e.target.value, 10) : 0)}
                  required
                />
              </div>

              <div className="flex justify-end mt-4 gap-4">
              <Buttons title="Guardar" type="submit" bgColor="bg-primary" textColor="text-gray" disabled={!isFormSettingsValid} />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  </div>
    </DefaultLayout>
  );
};

export default Settings;
