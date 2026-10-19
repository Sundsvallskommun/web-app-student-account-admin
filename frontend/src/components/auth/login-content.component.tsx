'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import { Button } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import { appURL } from '@utils/app-url';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Turn on/off automatic login
const autoLogin = true;

// Error codes the backend can put in ?failMessage=. Anything else maps to UNKNOWN so the
// user-provided value never reaches the DOM or an i18n key as-is.
const KNOWN_FAIL_MESSAGES = [
  'NOT_AUTHORIZED',
  'NO_USER',
  'SAML_MISSING_PROFILE',
  'SAML_MISSING_ATTRIBUTES',
  'SAML_UNKNOWN_ERROR',
] as const;

const toFailMessage = (value: string | null): string => {
  if (!value) return '';
  return (KNOWN_FAIL_MESSAGES as readonly string[]).includes(value) ? value : 'UNKNOWN';
};

// Only a plain relative path may be used as the post-login redirect target. Values that could
// turn the app origin into another host (`//`, `\`, `@`, `:`) and the auth pages themselves are dropped.
const toSafeRelativePath = (value: string | null): string => {
  if (!value || !/^\/(?![/\\])[^@:\\]*$/.test(value)) return '';
  return /\/login|\/logout/.test(value) ? '' : value;
};

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  const isLoggedOut = searchParams?.has('loggedout') ?? false;
  const failMessage = toFailMessage(searchParams?.get('failMessage') ?? null);

  const initialFocus = useRef<HTMLButtonElement>(null);

  const onLogin = useCallback(() => {
    const path = toSafeRelativePath(searchParams?.get('path') ?? null);

    const url = new URL(apiURL('/saml/login'));
    url.search = new URLSearchParams({
      successRedirect: appURL(path),
      failureRedirect: `${appURL()}/login`,
    }).toString();

    // NOTE: send user to login with SSO
    window.location.href = url.toString();
  }, [searchParams]);

  useEffect(() => {
    setTimeout(() => initialFocus.current?.focus());
    setTimeout(() => setMounted(true), 500); // to not flash the login-screen on autologin

    if (isLoggedOut) {
      router.replace('/login');
      return;
    }

    if (!failMessage && autoLogin) {
      onLogin();
      return;
    }

    if (failMessage) {
      setErrorMessage(t(`login:errors.${failMessage}`, { defaultValue: t('login:errors.UNKNOWN') }));
    }
  }, [failMessage, isLoggedOut, onLogin, router, t]);

  if (!mounted && !failMessage) {
    // to not flash the login-screen on autologin
    return <LoaderFullScreen />;
  }

  return (
    <EmptyLayout>
      <main>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-5xl w-full flex flex-col text-light-primary bg-inverted-background-content p-20 shadow-lg text-left">
            <div className="mb-14">
              <h1 className="mb-10 text-xl">{t('login:title')}</h1>
            </div>

            <Button inverted onClick={onLogin} ref={initialFocus} data-cy="loginButton">
              {t('common:login')}
            </Button>

            {errorMessage && <p className="mt-lg">{errorMessage}</p>}
          </div>
        </div>
      </main>
    </EmptyLayout>
  );
}
