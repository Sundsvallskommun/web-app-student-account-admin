'use client';

import 'dayjs/locale/sv';

import LoginGuard from '@components/login-guard/login-guard';
import { AppWrapper } from '@contexts/app.context';
import { registerNavigator } from '@services/api-service';
import { ConfirmationDialogContextProvider, defaultTheme, extendTheme, GuiProvider } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';

dayjs.extend(utc);
dayjs.locale('sv');
dayjs.extend(updateLocale);
dayjs.updateLocale('sv', {
  months: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
});

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: Readonly<AppLayoutProps>) {
  const router = useRouter();
  const [colorScheme] = useState('light');

  const theme = useMemo(
    () =>
      extendTheme({
        cursor: colorScheme === 'light' ? 'pointer' : 'default',
        colorSchemes: defaultTheme.colorSchemes,
      }),
    [colorScheme]
  );

  useEffect(() => {
    registerNavigator((path) => router.push(path));
  }, [router]);

  return (
    <ConfirmationDialogContextProvider>
      <GuiProvider theme={theme} colorScheme={colorScheme as any}>
        <AppWrapper>
          <LoginGuard>{children}</LoginGuard>
        </AppWrapper>
      </GuiProvider>
    </ConfirmationDialogContextProvider>
  );
}
