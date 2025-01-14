'use client'

import React from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const InvoiceDetailsForm: React.FC = () => {
  const { invoiceData, setInvoiceData } = useInvoice()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInvoiceData((prev) => ({
      ...prev,
      invoiceDetails: { ...prev.invoiceDetails, [name]: value },
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      invoiceDetails: { ...prev.invoiceDetails, [name]: value },
    }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Invoice Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            name="invoiceNumber"
            value={invoiceData.invoiceDetails.invoiceNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            name="issueDate"
            type="date"
            value={invoiceData.invoiceDetails.issueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={invoiceData.invoiceDetails.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Select
            onValueChange={(value) => handleSelectChange('paymentTerms', value)}
            defaultValue={invoiceData.invoiceDetails.paymentTerms}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
              <SelectItem value="net_15">Net 15</SelectItem>
              <SelectItem value="net_30">Net 30</SelectItem>
              <SelectItem value="net_60">Net 60</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

