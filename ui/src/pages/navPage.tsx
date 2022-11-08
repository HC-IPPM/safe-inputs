import React from 'react'

import { Outlet } from 'react-router-dom'

import Footer from '../live_menu_footer.tsx/footer'
import TopHeader from '../live_menu_footer.tsx/topHeader'

// This is the component that renders the header and footer for all pages
export default function NavPage() {
  return (
    <>
      <TopHeader />

{/* Outlet function used by React-Router-Dom to nest the child routes/elements when rendered.   */}
      <Outlet />
      <Footer />

    </>
  )
}
