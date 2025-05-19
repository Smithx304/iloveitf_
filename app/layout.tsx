// app/layout.tsx
import Navbar from '../components/Navbar';
import './globals.css';

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
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
