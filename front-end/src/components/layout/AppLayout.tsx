import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Sidebar from './Sidebar';
import Header from './Header';
import ToastViewport from './ToastViewport';
import { useRealtimeNotifications } from '../../hooks/useRealtimeNotifications';

export default function AppLayout() {
  useRealtimeNotifications();

  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarAbierto(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
      />

      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarAbierto(true)} />

        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
      <ToastViewport />
    </div>
  );
}
