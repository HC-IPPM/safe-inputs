import React from "react";

import Footer from "./menu_footer.tsx/footer";
import TopHeader1 from "./menu_footer.tsx/topHeader";

// This is the component that renders the header and footer for all pages
export default function NavPage() {
    return (
        <>
            <TopHeader1 />
            <Footer />
        </>
    )
}