import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings/Settings';
import Tables from './pages/Tables';
import Buttons from './pages/UiElements/Buttons';
import { Salesdocs } from './pages/Salesdocs/Salesdocs';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomerAdd } from './pages/Customer/CustomerAdd';
import { Provider } from './pages/Provider/Provider';
import { Bill } from './pages/Bill/Bill';
import { Customer } from './pages/Customer/Customer';
import { Article } from './pages/Article/Article';
import { ArticleAdd } from './pages/Article/ArticleAdd';
import { ProviderAdd } from './pages/Provider/ProviderAdd';
import  SalesdocsAdd  from './pages/Salesdocs/SalesdocsAdd';
import { Confirm } from './pages/Authentication/Confirm';
import { ConfirmEmail } from './pages/Authentication/ConfirmEmail';
import ProviderEdit from './pages/Provider/ProviderEdit';
import Alert from './pages/UiElements/Alerts';
import CustomerEdit from './pages/Customer/CustomerEdit';
import { Category } from './pages/Category/Category';
import { CategoryAdd } from './pages/Category/CategoryAdd';
import ArticleEdit from './pages/Article/ArticleEdit';
import CategoryEdit from './pages/Category/CategoryEdit';
import { isTokenExpired } from './utils/token';
import { BusinessProvider } from './context/BusinessContext';
import { type } from './types/package';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'error'; title: string; message: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const capitalizeWords = (text: string) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      setAlert({ type: 'error', title: 'Sesión Expirada', message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' });
      logout();
      navigate('/signin');
    }
  }, [location.pathname, logout, navigate]);

  useEffect(() => {
    if (user && user.bussinessName) {
      const companyName = user.bussinessName || 'ERP by thdvs';
      document.title = capitalizeWords(companyName);
    }
  }, [user]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return loading ? (
    <Loader />
  ) : (
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
          <Route path="/salesdocs" element={<Salesdocs />} />
          <Route path="/salesdocs/add_salesdocs" element={<SalesdocsAdd mode='add' />} />
          <Route path='/salesdocs/edit/:id' element={<SalesdocsAdd mode='edit' />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/customer/add_customer" element={<CustomerAdd />} />
          <Route path="/customer/edit/:id" element={<CustomerEdit />} />
          <Route path="/provider" element={<Provider />} />
          <Route path="/provider/add_provider" element={<ProviderAdd />} />
          <Route path="/provider/edit/:id" element={<ProviderEdit />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/article" element={<Article />} />
          <Route path="/article/add_article" element={<ArticleAdd />} />
          <Route path="/article/edit/:id" element={<ArticleEdit />} />
          <Route path='/article/category' element={<Category />} />
          <Route path='/article/category/add_category' element={<CategoryAdd />} />
          <Route path="/article/category/edit/:id" element={<CategoryEdit />} />
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
    </>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <BusinessProvider>
        <App />
      </BusinessProvider>
    </AuthProvider>
  );
}
