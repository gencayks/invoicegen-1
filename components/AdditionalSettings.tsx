'use client'

import React from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const AdditionalSettings: React.FC = () => {
  const { invoiceData, setInvoiceData } = useInvoice()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: 'notes' | 'terms'
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleSelectChange = (field: 'currency' | 'language', value: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Additional Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select
            onValueChange={(value) => handleSelectChange('currency', value)}
            defaultValue={invoiceData.currency}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="JPY">JPY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Select
            onValueChange={(value) => handleSelectChange('language', value)}
            defaultValue={invoiceData.language}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={invoiceData.notes}
            onChange={(e) => handleChange(e, 'notes')}
            rows={3}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="terms">Terms & Conditions</Label>
          <Textarea
            id="terms"
            value={invoiceData.terms}
            onChange={(e) => handleChange(e, 'terms')}
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}

