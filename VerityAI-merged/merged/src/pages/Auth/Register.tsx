import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '@/src/store/modalStore';

export function Register() {
  const navigate = useNavigate();
  const openGetStarted = useModalStore((state) => state.openGetStarted);

  useEffect(() => {
    navigate('/', { replace: true });
    openGetStarted();
  }, [navigate, openGetStarted]);

  return null;
}
