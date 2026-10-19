import { ReactNode } from 'react';

interface EmptyLayoutProps {
  children: ReactNode;
}

export default function EmptyLayout({ children }: Readonly<EmptyLayoutProps>) {
  return (
    <div className="EmptyLayout">
      <div className="bg-gray-lighter min-h-screen">{children}</div>
    </div>
  );
}
