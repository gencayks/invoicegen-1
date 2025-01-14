import jsPDF from 'jspdf'
import { InvoiceData } from '../contexts/InvoiceContext'

export const generatePDF = (invoiceData: InvoiceData) => {
  const doc = new jsPDF()

  // Add content to the PDF
  doc.setFontSize(20)
  doc.text('Invoice', 105, 15, { align: 'center' })

  doc.setFontSize(12)
  doc.text(`Invoice Number: ${invoiceData.invoiceDetails.invoiceNumber}`, 20, 30)
  doc.text(`Date: ${invoiceData.invoiceDetails.issueDate}`, 20, 40)
  doc.text(`Due Date: ${invoiceData.invoiceDetails.dueDate}`, 20, 50)

  doc.text('Bill To:', 20, 70)
  doc.text(invoiceData.clientInfo.name, 20, 80)
  doc.text(invoiceData.clientInfo.address, 20, 90)
  doc.text(invoiceData.clientInfo.email, 20, 100)
  doc.text(invoiceData.clientInfo.phone, 20, 110)

  // Add line items
  let yPos = 130
  doc.text('Description', 20, yPos)
  doc.text('Quantity', 100, yPos)
  doc.text('Unit Price', 140, yPos)
  doc.text('Total', 180, yPos)

  invoiceData.lineItems.forEach((item, index) => {
    yPos += 10
    doc.text(item.description, 20, yPos)
    doc.text(item.quantity.toString(), 100, yPos)
    doc.text(item.unitPrice.toFixed(2), 140, yPos)
    doc.text((item.quantity * item.unitPrice).toFixed(2), 180, yPos)
  })

  // Add totals
  yPos += 20
  doc.text(`Subtotal: ${invoiceData.currency} ${calculateSubtotal(invoiceData).toFixed(2)}`, 140, yPos)
  yPos += 10
  doc.text(`Tax (${invoiceData.taxRate}%): ${invoiceData.currency} ${calculateTax(invoiceData).toFixed(2)}`, 140, yPos)
  yPos += 10
  doc.text(`Discount (${invoiceData.discountRate}%): ${invoiceData.currency} ${calculateDiscount(invoiceData).toFixed(2)}`, 140, yPos)
  yPos += 10
  doc.text(`Total: ${invoiceData.currency} ${calculateTotal(invoiceData).toFixed(2)}`, 140, yPos)

  // Save the PDF
  doc.save(`invoice_${invoiceData.invoiceDetails.invoiceNumber}.pdf`)
}

const calculateSubtotal = (invoiceData: InvoiceData) => {
  return invoiceData.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
}

const calculateTax = (invoiceData: InvoiceData) => {
  return calculateSubtotal(invoiceData) * (invoiceData.taxRate / 100)
}

const calculateDiscount = (invoiceData: InvoiceData) => {
  return calculateSubtotal(invoiceData) * (invoiceData.discountRate / 100)
}

const calculateTotal = (invoiceData: InvoiceData) => {
  return calculateSubtotal(invoiceData) + calculateTax(invoiceData) - calculateDiscount(invoiceData)
}

