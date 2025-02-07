import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@sk-web-gui/react';
import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { appURL } from '@utils/app-url';
import { apiURL } from '@utils/api-url';

export default function Start() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const isLoggedOut = params.get('loggedout') === '';
  const failMessage = params.get('failMessage');
  // Turn on/off automatic login
  const autoLogin = true;

  const initalFocus = useRef(null);
  const setInitalFocus = () => {
    setTimeout(() => {
      initalFocus.current && initalFocus.current.focus();
    });
  };

  const onLogin = () => {
    const path = router.query.path || new URLSearchParams(window.location.search).get('path') || '';

    const url = new URL(apiURL('/saml/login'));
    const queries = new URLSearchParams({
      successRedirect: `${appURL(path as string)}`,
      failureRedirect: `${appURL()}/login`,
    });
    url.search = queries.toString();
    // NOTE: send user to login with SSO
    window.location.href = url.toString();
  };

  useEffect(() => {
    setInitalFocus();
    if (!router.isReady) return;
    setTimeout(() => setMounted(true), 500); // to not flash the login-screen on autologin
    if (isLoggedOut) {
      router.push(
        {
          pathname: '/login',
        },
        '/login',
        { shallow: true }
      );
    } else {
      if (!failMessage && autoLogin) {
        // autologin
        onLogin();
      } else if (failMessage) {
        setErrorMessage(failMessage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (!mounted && !failMessage) {
    // to not flash the login-screen on autologin
    return <LoaderFullScreen />;
  }

  return (
    <EmptyLayout title={`$Elevkontohantering - Logga In`}>
      <main>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-5xl w-full flex flex-col text-light-primary bg-inverted-background-content p-20 shadow-lg text-left">
            <div className="mb-14">
              <h1 className="mb-10 text-xl">Elevkontohantering</h1>
            </div>

            <Button inverted onClick={() => onLogin()} ref={initalFocus} data-cy="loginButton">
              Logga in
            </Button>

            {errorMessage && <p className="mt-lg">{errorMessage}</p>}
          </div>
        </div>
      </main>
    </EmptyLayout>
  );
}