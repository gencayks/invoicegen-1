'use client'

import React from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const ClientInfoForm: React.FC = () => {
  const { invoiceData, setInvoiceData, addAuditEntry } = useInvoice()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInvoiceData((prev) => ({
      ...prev,
      clientInfo: { ...prev.clientInfo, [name]: value },
    }))
    addAuditEntry('Update Client Info', `Changed ${name} to ${value}`)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Client Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientName">Name</Label>
          <Input
            id="clientName"
            name="name"
            value={invoiceData.clientInfo.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientAddress">Address</Label>
          <Input
            id="clientAddress"
            name="address"
            value={invoiceData.clientInfo.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            id="clientEmail"
            name="email"
            type="email"
            value={invoiceData.clientInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientPhone">Phone</Label>
          <Input
            id="clientPhone"
            name="phone"
            type="tel"
            value={invoiceData.clientInfo.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
  )
}

