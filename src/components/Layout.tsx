import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useStore } from '../store/useStore';
import JouleAssistant from './JouleAssistant';

export default function Layout() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const location = useLocation();

  const isFichierRoute = location.pathname === '/nouveau' || location.pathname === '/ouvrir';

  return (
    <div className="h-screen flex flex-col bg-slate-50 print:bg-white overflow-hidden print:h-auto print:overflow-visible">
      <Navbar />
      <div className="flex flex-1 overflow-hidden print:overflow-visible">
        {currentDossierId && <Sidebar />}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 print:bg-white print:p-0 print:overflow-visible">
          {!currentDossierId && !isFichierRoute ? (
            <Navigate to="/ouvrir" replace />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
      <JouleAssistant />
    </div>
  );
}
