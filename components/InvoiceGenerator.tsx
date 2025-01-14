'use client'

import React, { useState } from 'react'
import { InvoiceProvider } from '../contexts/InvoiceContext'
import { ClientInfoForm } from './ClientInfoForm'
import { BusinessInfoForm } from './BusinessInfoForm'
import { InvoiceDetailsForm } from './InvoiceDetailsForm'
import { LineItems } from './LineItems'
import { InvoiceSummary } from './InvoiceSummary'
import { AdditionalSettings } from './AdditionalSettings'
import { InvoicePreview } from './InvoicePreview'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeCustomizer } from './ThemeCustomizer'
import { AuditTrail } from './AuditTrail'

export const InvoiceGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('edit')

  const handleGenerateInvoice = () => {
    setActiveTab('preview')
  }

  return (
    <InvoiceProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Advanced Invoice Generator</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Card>
              <CardContent className="space-y-6">
                <ClientInfoForm />
                <BusinessInfoForm />
                <InvoiceDetailsForm />
                <LineItems />
                <InvoiceSummary />
                <AdditionalSettings />
                <ThemeCustomizer />
                <Button onClick={handleGenerateInvoice}>Generate Invoice</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview">
            <InvoicePreview />
            <AuditTrail />
          </TabsContent>
        </Tabs>
      </div>
    </InvoiceProvider>
  )
}

