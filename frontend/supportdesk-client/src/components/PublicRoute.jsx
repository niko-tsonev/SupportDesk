import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    // If user is logged in, redirect to home/catalog
    return <Navigate to="/" replace />;
  }

  return children;
}
