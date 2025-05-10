import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Stylish Barbershop',
  description: 'Professional barbershop services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-primary text-white flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}