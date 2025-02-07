import Head from 'next/head';

export default function EmptyLayout({ title, children }) {
  return (
    <div className="EmptyLayout bg-background-content text-body">
      <Head>
        <title>{title}</title>
      </Head>

      <div className="min-h-screen">{children}</div>
    </div>
  );
}
