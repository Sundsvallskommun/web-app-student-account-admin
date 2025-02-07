import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login?loggedout');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
