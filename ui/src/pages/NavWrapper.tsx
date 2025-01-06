import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router';

import AppErrorFallback from 'src/components/error/AppErrorFallback.tsx';
import Footer from 'src/components/layout/Footer.tsx';
import Header from 'src/components/layout/Header.tsx';

// This is the component that renders the header and footer for all pages
export default function NavWrapper() {
  return (
    <div className="layout-container">
      <Header />
      <div style={{ flexGrow: 1 }}>
        <ErrorBoundary FallbackComponent={AppErrorFallback}>
          <Outlet />
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
}
