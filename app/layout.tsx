// app/layout.tsx
import './globals.css';
import Navbar from 'app/components/Navbar';

export const metadata = {
  title: 'iloveITF',
  description: 'Upload your CSV to get the latest paperwork',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
