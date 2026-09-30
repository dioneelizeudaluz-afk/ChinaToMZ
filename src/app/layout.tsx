import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChinaToMZ — Importação da China para Moçambique',
  description: 'Escolha produtos da China e deixe a ChinaToMZ cuidar do processo de importação até Moçambique.',
  openGraph: {
    title: 'ChinaToMZ',
    description: 'Da China para Moçambique, sem complicação.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-MZ">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0F172A',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}