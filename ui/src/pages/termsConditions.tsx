import React from 'react'

import { useTranslation } from 'react-i18next'

export default function TermsConditions() {
  const { t } = useTranslation()
  return (
    <>
      <h1> Notife </h1>
      <ul>
        <li>
          By accessing, browsing, or using our website or our services, you
          acknowledge that you have read, understood, and agree to be bound by
          these Terms and Conditions, and to comply with all applicable laws and
          regulations. We recommend that you review all Terms and Conditions
          periodically to understand any updates or changes that may affect you.
          If you do not agree to these Terms and Conditions, please refrain from
          using our website, products and services.
        </li>
      </ul>



    </>
  )
}
