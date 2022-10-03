import React from "react";

import ExcelParse from "./excelParser";
import workerInstance from './serviceWorker'

export default function App() {

  return (
    <>
      <ExcelParse parseWorker={workerInstance}  />
    </>
  )
}