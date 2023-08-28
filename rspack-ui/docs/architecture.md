# Safe Inputs Application Architecture

## Page Layout

The `index.tsx` entrypoint uses client-side routing with the `BrowserRouter`, `Routes`, and `Route` components of the `react-router-dom` package.

A top level navigation page `NavPage` renders `Header`, `Footer`, and `Outlet` components, where `Outlet` displays the contents of nested routes. Two nested routes are possible: the root path `""`, which renders the `ExcelParsingPage` component, and the `"/termsAndConditions"` path, which renders the `TermsAndConditions` component.

![application page layout](./react-page-layout.svg)

## Excel Parsing Page

![excel parser layout](./excel-parser-layout.svg)