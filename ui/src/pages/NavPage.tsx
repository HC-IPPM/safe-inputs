import { Outlet } from 'react-router';

import Footer from 'src/components/layout/Footer.tsx';
import Header from 'src/components/layout/Header.tsx';

// This is the component that renders the header and footer for all pages

export default function NavPage() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
