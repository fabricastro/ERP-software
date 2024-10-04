import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
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
import Alerts from './pages/UiElements/Alerts';
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
import { SalesdocsAdd } from './pages/Salesdocs/SalesdocsAdd';
import { Confirm } from './pages/Authentication/Confirm';
import { ConfirmEmail } from './pages/Authentication/ConfirmEmail';
function App() {
  const { user } = useAuth(); 
  const capitalizeWords = (text: string) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const companyName = `ERP - ${user.bussinessName}` || 'ERP - Daes Ingeniería';
    document.title = capitalizeWords(companyName); // Capitalizamos la primera letra
  }, [user]);

  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/auth/confirmemail" element={<ConfirmEmail />} />
        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<ECommerce />} />
          <Route path="/salesdocs" element={<Salesdocs />} />
          <Route path='/salesdocs/add_salesdocs' element={<SalesdocsAdd />}/>
          <Route path="/customer" element={<Customer />} />
          <Route path="/customer/add_customer" element={<CustomerAdd />} />
          <Route path="/provider" element={<Provider />} />
          <Route path="/provider/add_provider" element={<ProviderAdd />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/article" element={<Article />} />
          <Route path='/article/add_article' element={<ArticleAdd />} />
          <Route path='/settings' element={<Settings />} />
          <Route
            path="/calendar"
            element={
              <>
                <PageTitle title="Calendario" />
                <Calendar />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Perfil" />
                <Profile />
              </>
            }
          />
          <Route
            path="/forms/form-elements"
            element={
              <>
                <PageTitle title="Form Elements" />
                <FormElements />
              </>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <>
                <PageTitle title="Form Layout" />
                <FormLayout />
              </>
            }
          />
          <Route
            path="/tables"
            element={
              <>
                <PageTitle title="Tables" />
                <Tables />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <PageTitle title="Settings" />
                <Settings />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Basic Chart" />
                <Chart />
              </>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons" />
                <Buttons />
              </>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
