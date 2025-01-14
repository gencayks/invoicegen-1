'use client'

import React from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const AuditTrail: React.FC = () => {
  const { invoiceData } = useInvoice()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {invoiceData.auditTrail.map((entry, index) => (
            <li key={index} className="text-sm">
              <span className="font-bold">{new Date(entry.timestamp).toLocaleString()}</span>:{' '}
              {entry.action} - {entry.details}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

