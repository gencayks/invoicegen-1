'use client'

import React, { useState } from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { generatePDF } from '../utils/pdfGenerator'
import { syncWithAccounting } from '../utils/accountingIntegration'
import { toast } from "@/components/ui/use-toast"

export const InvoicePreview: React.FC = () => {
  const { invoiceData } = useInvoice()
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const result = await syncWithAccounting(invoiceData)
      toast({
        title: "Success",
        description: result.message,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync with accounting software",
      })
    } finally {
      setIsSyncing(false)
    }
  }

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
    return calculateSubtotal() + calculateTax() - calculateDiscount()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            {invoiceData.businessInfo.logo && (
              <Image
                src={invoiceData.businessInfo.logo}
                alt="Business Logo"
                width={100}
                height={100}
                className="mb-4"
              />
            )}
            <CardTitle className="text-3xl font-bold">{invoiceData.businessInfo.name}</CardTitle>
            <p>{invoiceData.businessInfo.address}</p>
            <p>{invoiceData.businessInfo.email}</p>
            <p>{invoiceData.businessInfo.phone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">Invoice</h2>
            <p>Invoice Number: {invoiceData.invoiceDetails.invoiceNumber}</p>
            <p>Issue Date: {invoiceData.invoiceDetails.issueDate}</p>
            <p>Due Date: {invoiceData.invoiceDetails.dueDate}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2">Bill To:</h3>
          <p>{invoiceData.clientInfo.name}</p>
          <p>{invoiceData.clientInfo.address}</p>
          <p>{invoiceData.clientInfo.email}</p>
          <p>{invoiceData.clientInfo.phone}</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceData.lineItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{invoiceData.currency} {item.unitPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">{invoiceData.currency} {(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-right">
          <p>Subtotal: {invoiceData.currency} {calculateSubtotal().toFixed(2)}</p>
          <p>Tax ({invoiceData.taxRate}%): {invoiceData.currency} {calculateTax().toFixed(2)}</p>
          <p>Discount ({invoiceData.discountRate}%): {invoiceData.currency} {calculateDiscount().toFixed(2)}</p>
          <p className="font-bold">Total: {invoiceData.currency} {calculateTotal().toFixed(2)}</p>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Notes:</h3>
          <p>{invoiceData.notes}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Terms & Conditions:</h3>
          <p>{invoiceData.terms}</p>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <Button onClick={() => generatePDF(invoiceData)}>Download PDF</Button>
          <Button onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? 'Syncing...' : 'Sync with Accounting'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

