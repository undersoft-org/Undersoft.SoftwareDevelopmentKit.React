import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useHistory } from '@/hooks/useHistory';

export { SecureRoute };

function SecureRoute({ children }: { children: React.ReactNode }){
    const { user: authUser } = useSelector<any, any>(x => x.auth);
    
    if (!authUser) {
        return <Navigate to="/login" state={{ from: useHistory.location }} />
    }

    // authorized so return child components
    return children;
}