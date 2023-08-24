import React from 'react'

import { Outlet } from 'react-router-dom';

import Inbox from "../Inbox";

import TopHeader from '../components/Header';
// This is the component that renders the header and footer for all pages
export default function NavPage() {
    return (
        <>
            <TopHeader />
            <Inbox />
            {/* Outlet function used by React-Router-Dom to nest the child routes/elements when rendered.   */}
            <Outlet />
        </>
    )
}