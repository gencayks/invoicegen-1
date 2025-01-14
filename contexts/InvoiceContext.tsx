'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

interface ClientInfo {
  name: string
  address: string
  email: string
  phone: string
}

interface BusinessInfo {
  name: string
  address: string
  email: string
  phone: string
  website: string
  logo: string
}

interface InvoiceDetails {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  paymentTerms: string
}

interface AuditEntry {
  timestamp: string
  action: string
  details: string
}

export interface InvoiceData {
  clientInfo: ClientInfo
  businessInfo: BusinessInfo
  invoiceDetails: InvoiceDetails
  lineItems: LineItem[]
  taxRate: number
  discountRate: number
  currency: string
  language: string
  notes: string
  terms: string
  status: 'draft' | 'pending' | 'paid' | 'overdue'
  auditTrail: AuditEntry[]
}

interface InvoiceContextType {
  invoiceData: InvoiceData
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>
  addLineItem: (item: LineItem) => void
  removeLineItem: (id: string) => void
  updateLineItem: (id: string, item: Partial<LineItem>) => void
  addAuditEntry: (action: string, details: string) => void
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)

export const useInvoice = () => {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider')
  }
  return context
}

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    clientInfo: { name: '', address: '', email: '', phone: '' },
    businessInfo: { name: '', address: '', email: '', phone: '', website: '', logo: '' },
    invoiceDetails: { invoiceNumber: '', issueDate: '', dueDate: '', paymentTerms: '' },
    lineItems: [],
    taxRate: 0,
    discountRate: 0,
    currency: 'USD',
    language: 'en',
    notes: '',
    terms: '',
    status: 'draft',
    auditTrail: [],
  })

  const addLineItem = (item: LineItem) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, item],
    }))
  }

  const removeLineItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }))
  }

  const updateLineItem = (id: string, updatedItem: Partial<LineItem>) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    }))
  }

  const addAuditEntry = (action: string, details: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      auditTrail: [
        ...prev.auditTrail,
        {
          timestamp: new Date().toISOString(),
          action,
          details,
        },
      ],
    }))
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoiceData,
        setInvoiceData,
        addLineItem,
        removeLineItem,
        updateLineItem,
        addAuditEntry,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}

