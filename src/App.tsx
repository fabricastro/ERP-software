import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/Dashboard';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings/Settings';
import Tables from './pages/Tables';
import Buttons from './pages/UiElements/Buttons';
import { Salesdocs } from './pages/Salesdocs/Salesdocs';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Provider } from './pages/Provider/Provider';
import { Customer } from './pages/Customer/Customer';
import { Article } from './pages/Article/Article';
import SalesdocsAdd from './pages/Salesdocs/SalesdocsAdd';
import { Confirm } from './pages/Authentication/Confirm';
import { ConfirmEmail } from './pages/Authentication/ConfirmEmail';
import Alert from './pages/UiElements/Alerts';
import { Category } from './pages/Category/Category';
import { isTokenExpired } from './utils/token';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { ProviderForm } from './pages/Provider/ProviderForm';
import { CustomerForm } from './pages/Customer/CustomerForm';
import { ArticleForm } from './pages/Article/ArticleForm';
import WelcomeModal from './components/WelcomeModal';

function App() {
  const { isBusinessInfoComplete } = useSettings();
  const { logout, loadingAuth } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  // Definir el intervalo de tiempo para mostrar el modal 
  const MODAL_INTERVAL_MS = 30 * 60 * 1000; // 30 minutos

  const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'error'; title: string; message: string } | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Verifica si el token ha expirado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      setAlert({ type: 'error', title: 'Sesión Expirada', message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' });
      logout();
      navigate('/signin');
    }
  }, [location.pathname, logout, navigate]);

  // Cambia el título del documento cuando `settings` se actualiza
  useEffect(() => {
    if (settings) {
      const companyName = settings.bussinessName;
      document.title = `${companyName} - Sistema de Gestión`;
    }
  }, [settings]);

  // Mantiene el scroll en la parte superior cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Verifica si la información de empresa está completa y maneja el tiempo de visualización del modal
  useEffect(() => {
    const businessInfoComplete = isBusinessInfoComplete();
    const lastShown = localStorage.getItem('lastWelcomeModalShown');

    // Si la información empresarial no está completa y ha pasado el tiempo de espera, muestra el modal
    if (!businessInfoComplete) {
      const now = Date.now();
      if (!lastShown || now - parseInt(lastShown, 10) > MODAL_INTERVAL_MS) {
        setShowWelcomeModal(true);
        localStorage.setItem('lastWelcomeModalShown', now.toString()); // Actualiza el tiempo de la última visualización
      }
    }
  }, [isBusinessInfoComplete]);

  // Función para cerrar el modal y navegar a la configuración
  const goToSettings = () => {
    setShowWelcomeModal(false);
    navigate('/settings');
  };

  // Espera a que termine `loadingAuth` antes de mostrar el contenido
  if (loadingAuth) {
    return <Loader />;
  }

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/auth/confirmemail" element={<ConfirmEmail />} />
        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<ECommerce />} />
          <Route path="/budget" element={<Salesdocs typeSalesdocs="budget" />} />
          <Route path="/budget/add_budget" element={<SalesdocsAdd mode="add" typeSalesdocs="presupuesto" />} />
          <Route path="/budget/edit/:id" element={<SalesdocsAdd mode="edit" typeSalesdocs="presupuesto" />} />
          <Route path="/budget/view/:id" element={<SalesdocsAdd mode="view" typeSalesdocs="presupuesto" />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/customer/add" element={<CustomerForm viewType="add" />} />
          <Route path="/customer/view/:id" element={<CustomerForm viewType="view" />} />
          <Route path="/customer/edit/:id" element={<CustomerForm viewType="edit" />} />
          <Route path="/provider" element={<Provider />} />
          <Route path="/provider/add" element={<ProviderForm viewType="add" />} />
          <Route path="/provider/view/:id" element={<ProviderForm viewType="view" />} />
          <Route path="/provider/edit/:id" element={<ProviderForm viewType="edit" />} />
          <Route path="/bill" element={<Salesdocs typeSalesdocs="bill" />} />
          <Route path="/bill/add_bill" element={<SalesdocsAdd mode="add" typeSalesdocs="factura" />} />
          <Route path="/bill/edit/:id" element={<SalesdocsAdd mode="edit" typeSalesdocs="factura" />} />
          <Route path="/bill/view/:id" element={<SalesdocsAdd mode="view" typeSalesdocs="factura" />} />
          <Route path="/article" element={<Article />} />
          <Route path="/article/add" element={<ArticleForm viewType="add" />} />
          <Route path="/article/view/:id" element={<ArticleForm viewType="view" />} />
          <Route path="/article/edit/:id" element={<ArticleForm viewType="edit" />} />
          <Route path="/article/category" element={<Category />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forms/form-elements" element={<FormElements />} />
          <Route path="/forms/form-layout" element={<FormLayout />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/ui/buttons" element={<Buttons />} />
        </Route>
      </Routes>
      <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} onGoToSettings={goToSettings} />
    </>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </AuthProvider>
  );
}
