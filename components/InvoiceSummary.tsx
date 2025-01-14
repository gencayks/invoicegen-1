'use client'

import React from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { useCurrencyConversion } from '../hooks/useCurrencyConversion'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const InvoiceSummary: React.FC = () => {
  const { invoiceData, setInvoiceData } = useInvoice()
  const { conversionRate } = useCurrencyConversion('USD', invoiceData.currency)

  const calculateSubtotal = () => {
    return invoiceData.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * (invoiceData.taxRate / 100)
  }

  const calculateDiscount = () => {
    return calculateSubtotal() * (invoiceData.discountRate / 100)
  }

  const calculateTotal = () => {
    return (calculateSubtotal() + calculateTax() - calculateDiscount()) * (conversionRate || 1)
  }

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'taxRate' | 'discountRate') => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: Number(e.target.value),
    }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Invoice Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{invoiceData.currency} {calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="taxRate">Tax Rate (%):</Label>
          <Input
            id="taxRate"
            type="number"
            value={invoiceData.taxRate}
            onChange={(e) => handleRateChange(e, 'taxRate')}
            className="w-24"
          />
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>{invoiceData.currency} {calculateTax().toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="discountRate">Discount Rate (%):</Label>
          <Input
            id="discountRate"
            type="number"
            value={invoiceData.discountRate}
            onChange={(e) => handleRateChange(e, 'discountRate')}
            className="w-24"
          />
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span>{invoiceData.currency} {calculateDiscount().toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>{invoiceData.currency} {calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

