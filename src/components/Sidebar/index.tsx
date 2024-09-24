import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === '/' && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6.1 0.95H2.53C1.58 0.95 0.79 1.74 0.79 2.7V6.27C0.79 7.23 1.58 8.02 2.53 8.02H6.1C7.06 8.02 7.85 7.23 7.85 6.27V2.73C7.87 1.74 7.09 0.95 6.1 0.95Z" />
                    <path d="M15.47 0.95H11.9C10.94 0.95 10.15 1.74 10.15 2.7V6.27C10.15 7.23 10.94 8.02 11.9 8.02H15.47C16.43 8.02 17.21 7.23 17.21 6.27V2.73C17.21 1.74 16.43 0.95 15.47 0.95Z" />
                    <path d="M6.1 9.93H2.53C1.58 9.93 0.79 10.72 0.79 11.67V15.24C0.79 16.2 1.58 16.99 2.53 16.99H6.1C7.06 16.99 7.85 16.2 7.85 15.24V11.7C7.87 10.72 7.09 9.93 6.1 9.93Z" />
                    <path d="M15.47 9.93H11.9C10.94 9.93 10.15 10.72 10.15 11.67V15.24C10.15 16.2 10.94 16.99 11.9 16.99H15.47C16.43 16.99 17.21 16.2 17.21 15.24V11.7C17.21 10.72 16.43 9.93 15.47 9.93Z" />
                  </svg>
                  Principal
                </NavLink>
              </li>

              {/* <!-- Menu Item Facturador --> */}
              <li>
                <NavLink
                  to="/facturador"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('facturador') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="2" y="2" width="14" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <line x1="4" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="4" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="4" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Facturador
                </NavLink>
              </li>

              {/* <!-- Menu Item Clientes --> */}
              <li>
                <NavLink
                  to="/clientes"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('clientes') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12C14.7 12 17 9.7 17 7C17 4.3 14.7 2 12 2C9.3 2 7 4.3 7 7C7 9.7 9.3 12 12 12ZM12 14C9 14 3 15.5 3 18.5V20H21V18.5C21 15.5 15 14 12 14Z" />
                  </svg>
                  Clientes
                </NavLink>
              </li>

              {/* <!-- Menu Item Proveedores --> */}
              <li>
                <NavLink
                  to="/proveedores"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('proveedores') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 13H21V11H3V13ZM3 18H17V16H3V18ZM3 6V8H21V6H3Z" />
                  </svg>
                  Proveedores
                </NavLink>
              </li>

              {/* <!-- Menu Item Usuarios --> */}
              <li>
                <NavLink
                  to="/usuarios"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('usuarios') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12C14.7 12 17 9.7 17 7C17 4.3 14.7 2 12 2C9.3 2 7 4.3 7 7C7 9.7 9.3 12 12 12ZM12 14C9 14 3 15.5 3 18.5V20H21V18.5C21 15.5 15 14 12 14Z" />
                  </svg>
                  Usuarios
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
