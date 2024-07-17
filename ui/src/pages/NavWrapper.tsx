import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import Footer from 'src/components/layout/Footer.tsx';
import Header from 'src/components/layout/Header.tsx';
import NavWrapperErrorFallBack from './error/NavWrapperErrorFallback.tsx';

// This is the component that renders the header and footer for all pages
export default function NavWrapper() {
  return (
    <>
      <Header />
      <ErrorBoundary FallbackComponent={NavWrapperErrorFallBack}>
        <Outlet />
      </ErrorBoundary>
      <Footer />
    </>
  );
}
