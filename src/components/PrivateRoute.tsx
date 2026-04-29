import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../api';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
    const token = getAuthToken();
    return token ? children : <Navigate to="/login" />;
}