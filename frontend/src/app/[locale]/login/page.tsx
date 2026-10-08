import LoginContent from '@components/auth/login-content.component';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Elevkontohantering - Logga in' };

export default function LoginPage() {
  return <LoginContent />;
}
