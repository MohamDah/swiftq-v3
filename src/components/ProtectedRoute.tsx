import { useCurrentUser } from '@/queries/useCurrentUser';
import { Navigate } from 'react-router-dom';
import SuspLoader from './SuspLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: currentUser, isError, isLoading } = useCurrentUser();

  if (isLoading) {
    return <SuspLoader />
  }

  if (!currentUser || isError) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;