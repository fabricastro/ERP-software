import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaUsers, FaMoneyBillWave, FaUserPlus } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { useTranslation } from 'react-i18next';
import FaviconWhiteIcon from '../../../public/favicon-white.png';
import { FaBoxArchive } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLDivElement | null>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(event.target as Node) || trigger.current.contains(event.target as Node)) return;
      setSidebarOpen(false);
    };

    const keyHandler = ({ key }: KeyboardEvent) => {
      if (key === 'Escape' && sidebarOpen) setSidebarOpen(false);
    };

    document.addEventListener('click', clickHandler);
    document.addEventListener('keydown', keyHandler);

    return () => {
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    document.body.classList.toggle('sidebar-expanded', sidebarExpanded);
  }, [sidebarExpanded]);

  const { t } = useTranslation();
  
  const menuItems = [
    { to: '/', icon: <MdSpaceDashboard />, label: t('main') },
    { to: '/salesdocs', icon: <FaMoneyBillWave />, label: t('salesdocs.title') },
    { to: '/article', icon: <FaBoxArchive />, label: t('routes.article') },
    { to: '/customer', icon: <FaUsers />, label: t('routes.customer') },
    { to: '/provider', icon: <FaUserPlus />, label: t('routes.provider') },
    { to: '/settings', icon: <IoSettings />, label: 'Configuración' }
  ];

  return (
<aside
  ref={sidebar}
  className={` absolute left-0 top-0 z-9999 h-screen w-30 sm:w-40 overflow-y-hidden bg-black duration-300 ease-linear ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0`}
>
  <div className="flex flex-col items-center w-full px-4 py-6">
    {/* Logo principal centrado */}
    <NavLink to="/" className="mb-12">
      <img src={FaviconWhiteIcon} alt="Logo"/>
    </NavLink>
    
    {/* Items del menú */}
    <div className="flex flex-col items-center w-full space-y-3">
      {menuItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={`p-3 rounded-lg flex flex-col w-full items-center text-white transition-all duration-300 hover:text-gray-300 ${
            pathname === to 
              ? 'bg-white text-primary'   // Fondo blanco y texto primario cuando está activo
              : ''
          }`}
        >
          {/* Icono centrado */}
          <div className={`text-3xl ${pathname === to ? 'text-primary' : ''}`}>{icon}</div>
          {/* Texto debajo del icono */}
          <span className={`text-xs mt-2 ${pathname === to ? 'text-primary' : ''}`}>{label}</span>
        </NavLink>
      ))}
    </div>
  </div>
</aside>
  );
};

export default Sidebar;
