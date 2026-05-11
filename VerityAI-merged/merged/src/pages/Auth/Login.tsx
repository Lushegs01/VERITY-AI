import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '@/src/store/modalStore';

export function Login() {
  const navigate = useNavigate();
  const openLogin = useModalStore((state) => state.openLogin);

  useEffect(() => {
    navigate('/', { replace: true });
    openLogin();
  }, [navigate, openLogin]);

  return null;
}

