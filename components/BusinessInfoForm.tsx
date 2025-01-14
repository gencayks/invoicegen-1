'use client'

import React from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const BusinessInfoForm: React.FC = () => {
  const { invoiceData, setInvoiceData } = useInvoice()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInvoiceData((prev) => ({
      ...prev,
      businessInfo: { ...prev.businessInfo, [name]: value },
    }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setInvoiceData((prev) => ({
          ...prev,
          businessInfo: { ...prev.businessInfo, logo: reader.result as string },
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Business Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="name"
            value={invoiceData.businessInfo.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="businessAddress">Address</Label>
          <Input
            id="businessAddress"
            name="address"
            value={invoiceData.businessInfo.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="businessEmail">Email</Label>
          <Input
            id="businessEmail"
            name="email"
            type="email"
            value={invoiceData.businessInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="businessPhone">Phone</Label>
          <Input
            id="businessPhone"
            name="phone"
            type="tel"
            value={invoiceData.businessInfo.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="businessWebsite">Website</Label>
          <Input
            id="businessWebsite"
            name="website"
            type="url"
            value={invoiceData.businessInfo.website}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="businessLogo">Logo</Label>
          <Input
            id="businessLogo"
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </div>
      </div>
    </div>
  )
}

