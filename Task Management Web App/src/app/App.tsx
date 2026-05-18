import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { AuthPage } from './components/auth/AuthPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { CollaboratorDashboard } from './components/collaborator/CollaboratorDashboard';

function AppContent() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthPage />;
  }

  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'collaborator':
      return <CollaboratorDashboard />;
    default:
      return <AuthPage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}