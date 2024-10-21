import React, { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* ===== Page Wrapper Start ===== */}
      <div className="flex h-screen overflow-hidden">
        {/* ===== Sidebar Start ===== */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* ===== Sidebar End ===== */}

        {/* ===== Content Area Start ===== */}
        <div className={`relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden transition-all duration-300 ${sidebarOpen ? 'ml-30 sm:ml-40' : 'ml-0'}`}>
          {/* ===== Header Start ===== */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* ===== Header End ===== */}

          {/* ===== Main Content Start ===== */}
          <main>
            <div className="mx-auto px-4 py-8 md:py-6 2xl:p-10 md:px-6 lg:px-8">
              {children}
            </div>
          </main>
          {/* ===== Main Content End ===== */}
        </div>
        {/* ===== Content Area End ===== */}
      </div>
      {/* ===== Page Wrapper End ===== */}
    </div>
  );
};

export default DefaultLayout;
