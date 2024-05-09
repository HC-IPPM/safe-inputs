import { Outlet } from 'react-router-dom'

import Header from '../components/layout/Header.tsx'
import Footer from '../components/layout/Footer.tsx'
// This is the component that renders the header and footer for all pages
export default function NavPage() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
