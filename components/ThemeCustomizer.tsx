'use client'

import React from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export const ThemeCustomizer: React.FC = () => {
  const { invoiceData, setInvoiceData } = useInvoice()

  const handleThemeChange = (value: string) => {
    setInvoiceData((prev) => ({ ...prev, theme: value }))
  }

  const handleLayoutChange = (value: string) => {
    setInvoiceData((prev) => ({ ...prev, layout: value }))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Theme & Layout</h2>
      <div>
        <Label htmlFor="theme">Theme</Label>
        <Select onValueChange={handleThemeChange} defaultValue={invoiceData.theme}>
          <SelectTrigger id="theme">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="colorful">Colorful</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Layout</Label>
        <RadioGroup defaultValue={invoiceData.layout} onValueChange={handleLayoutChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard">Standard</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="modern" id="modern" />
            <Label htmlFor="modern">Modern</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="minimal" id="minimal" />
            <Label htmlFor="minimal">Minimal</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

