'use client'

import React from 'react'
import { useInvoice } from '../contexts/InvoiceContext'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from 'lucide-react'

export const LineItems: React.FC = () => {
  const { invoiceData, addLineItem, removeLineItem, updateLineItem } = useInvoice()

  const handleAddItem = () => {
    addLineItem({
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
    })
  }

  const handleUpdateItem = (id: string, field: string, value: string | number) => {
    updateLineItem(id, { [field]: value })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Line Items</h2>
      <div className="space-y-4">
        {invoiceData.lineItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
              className="w-24"
            />
            <Input
              type="number"
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
              className="w-24"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeLineItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={handleAddItem}>
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  )
}

