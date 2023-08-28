# Safe Inputs Application Architecture

## Page Layout

The `index.tsx` entrypoint uses client-side routing with the `BrowserRouter`, `Routes`, and `Route` components of the `react-router-dom` package.

A top level navigation page `NavPage` renders `Header`, `Footer`, and `Outlet` components, where `Outlet` displays the contents of nested routes. Two nested routes are possible: the root path `""`, which renders the `ExcelParsingPage` component, and the `"/termsAndConditions"` path, which renders the `TermsAndConditions` component.

![application page layout](./react-page-layout.svg)


## Excel Parsing Page

The `ExcelParsingPage.tsx` component renders two main components: `ExcelUploadForm.tsx` and `TableOutput.tsx`.

A `handleFileUpload` callback function is passed as a prop from `ExcelParsingPage.tsx` to `ExcelUploadForm.tsx`. When the form is submitted, `handleFileUpload` sends a message to the web worker containing the file submitted from the form.

Using the `xlsx` package, the web worker parses the Excel Workbook file, extracts the data for each sheet, and sends a message containing the output in `json` format back to the main JavaScript thread. A callback function is registered against the web worker to listen for `message` events. This callback function sets `displayComponent` and `parserData` React state variables, which are passed as props to the `TableOutput.tsx` component.

`TableOutput.tsx` conditionally renders components to display certain data and metadata from the processed spreadsheet.


![excel parser layout](./excel-parser-layout.svg)


## Register the Web Worker

[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) are separate threads of execution that can be used to offload work from the main JavaScript thread of the application. Since JavaScript is single threaded, we use a separate non-blocking worker thread to perform synchronous cpu-bound work while the main thread of the JavaScript application can listen for and respond to user events.

The worker thread is created in `excelParser.tsx`. In order to register the worker, the browser is expecting to find a file called `worker.js` in the top-level directory of the origin. Therefore, it is necessary to instruct Rspack to output two javascript files: one for the main application (`main.js`), and one for the worker (`worker.js`). This configuration can be found in the `entry` and `output` top-level keys in `rspack.config.js`.

## Build Process

This project uses [Rspack](https://www.rspack.dev/) to bundle the application. There are 3 important transcompilation steps that are defined in `module.exports.module.rules`:

1. There is a `macros` plugin configured with `babel-loader`. This is necessary for [Lingui's macro library](https://lingui.dev/ref/macro#babel) to be transcompiled into standard React components. The purpose of this plugin is to use simple macros like `<Trans>text to translate</Trans>`, which are then transcompiled into much more verbose React `.tsx`/`.jsx` components.
2. All `.tsx` files are taking advantage of a syntax extension to the JavaScript language to simplify the creation of React components. Browsers don't natively understand this syntax extension, so a transcompilation step is needed to convert any declared syntax extension symbols into EcmaScript-compatible JavaScript code.
3. Since the codebase is written in TypeScript, which is not understood by most browsers, TypeScript code needs to be transcompiled into an EcmaScript-compatible standard of JavaScript.