'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const getMe = useUserStore((s) => s.getMe);
  const resetUser = useUserStore((s) => s.reset);
  const { setDefaults } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const logout = () => {
    setDefaults();
    resetUser();
    localStorage.clear();
  };

  useEffect(() => {
    const checkAuth = async () => {
      const res = await getMe();
      if (res.error && !pathname?.includes('/login')) {
        logout();
        const existingFailMessage = new URLSearchParams(window.location.search).get('failMessage');
        const failMessage = existingFailMessage || res.message || String(res.error);
        router.push(`/login?failMessage=${encodeURIComponent(failMessage)}`);
      }
    };
    setMounted(true);
    void checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || (!user.name && !pathname?.includes('/login'))) {
    return <LoaderFullScreen />;
  }

  return <>{children}</>;
};

export default LoginGuard;
