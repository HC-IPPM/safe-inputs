import { Outlet } from 'react-router-dom';

import Footer from '../components/layout/Footer.tsx';
import Header from '../components/layout/Header.tsx';
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
