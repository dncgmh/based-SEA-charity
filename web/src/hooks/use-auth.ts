import authAtom from '@/stores/auth';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);

  const login = (accessToken: string, charity) => {
    setAuth({ isAuthenticated: true, accessToken, charity, charityId: charity._id });
    localStorage.setItem('accessToken', accessToken);
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, accessToken: null, charity: null, charityId: null });
    localStorage.removeItem('accessToken');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      // const charity = jwtDecode(storedToken);
      const decoded = jwtDecode(storedToken);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }
      const charityId = decoded._id;
      setAuth({ isAuthenticated: true, accessToken: storedToken, charityId });
    }
  }, []);
  return { auth, login, logout };
}
