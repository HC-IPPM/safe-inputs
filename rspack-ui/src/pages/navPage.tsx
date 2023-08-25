import React from 'react'

import { Outlet } from 'react-router-dom';

import TopHeader from '../components/Header';
import Footer from '../components/Footer';
// This is the component that renders the header and footer for all pages
export default function NavPage() {
    return (
        <>
            <TopHeader />
            <Outlet />
            <Footer />
        </>
    )
}