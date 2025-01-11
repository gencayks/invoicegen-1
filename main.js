// Global variables
let currentInvoiceId = null;
const API_URL = 'http://127.0.0.1:5000/api';  // Changed from localhost to 127.0.0.1

// Initialize Bootstrap modals
const companyModal = new bootstrap.Modal(document.getElementById('addCompanyModal'));
const invoiceModal = new bootstrap.Modal(document.getElementById('addInvoiceModal'));
const previewModal = new bootstrap.Modal(document.getElementById('invoicePreviewModal'));

// View management functions
function showDashboard() {
    document.getElementById('dashboard-view').style.display = 'block';
    document.getElementById('companies-view').style.display = 'none';
    document.getElementById('invoices-view').style.display = 'none';
    loadDashboardData();
}

function showCompanies() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('companies-view').style.display = 'block';
    document.getElementById('invoices-view').style.display = 'none';
    loadCompanies();
}

function showInvoices() {
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('companies-view').style.display = 'none';
    document.getElementById('invoices-view').style.display = 'block';
    loadInvoices();
}

// Company management
async function loadCompanies() {
    try {
        const response = await fetch(`${API_URL}/companies`);
        const companies = await response.json();
        
        const tableBody = document.getElementById('companies-table-body');
        tableBody.innerHTML = '';
        
        companies.forEach(company => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${company.name}</td>
                <td>${company.email || '-'}</td>
                <td>${company.phone || '-'}</td>
                <td>${company.tax_number || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="createInvoiceForCompany(${company.id})">
                        <i class="bi bi-receipt"></i> New Invoice
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading companies:', error);
        alert('Failed to load companies');
    }
}

function showAddCompanyModal() {
    document.getElementById('addCompanyForm').reset();
    companyModal.show();
}

async function saveCompany() {
    const form = document.getElementById('addCompanyForm');
    const formData = new FormData(form);
    const company = {
        name: formData.get('name'),
        address: formData.get('address'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        tax_number: formData.get('tax_number')
    };
    
    try {
        const response = await fetch(`${API_URL}/companies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(company)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        companyModal.hide();
        form.reset();
        await loadCompanies();
        alert('Company created successfully!');
    } catch (error) {
        console.error('Error saving company:', error);
        alert('Failed to save company: ' + error.message);
    }
}

// Invoice management
function addInvoiceItem() {
    const itemsContainer = document.getElementById('invoice-items');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'card mb-2';
    itemDiv.innerHTML = `
        <div class="card-body">
            <div class="row">
                <div class="col-md-5">
                    <input type="text" class="form-control" placeholder="Description" 
                           onchange="calculateTotal()" required>
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control" placeholder="Quantity" 
                           value="1" min="1" onchange="calculateTotal()" required>
                </div>
                <div class="col-md-3">
                    <input type="number" class="form-control" placeholder="Unit Price" 
                           step="0.01" min="0" onchange="calculateTotal()" required>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger" onclick="removeInvoiceItem(this)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    itemsContainer.appendChild(itemDiv);
}

function removeInvoiceItem(button) {
    button.closest('.card').remove();
    calculateTotal();
}

function calculateTotal() {
    const items = document.querySelectorAll('#invoice-items .card');
    let total = 0;
    
    items.forEach(item => {
        const quantity = parseFloat(item.querySelector('input[placeholder="Quantity"]').value) || 0;
        const unitPrice = parseFloat(item.querySelector('input[placeholder="Unit Price"]').value) || 0;
        total += quantity * unitPrice;
    });
    
    document.getElementById('invoice-total').textContent = total.toFixed(2);
}

function showAddInvoiceModal() {
    const form = document.getElementById('addInvoiceForm');
    form.reset();
    document.getElementById('invoice-items').innerHTML = '';
    addInvoiceItem(); // Add one item row by default
    
    // Load companies into select
    fetch(`${API_URL}/companies`)
        .then(response => response.json())
        .then(companies => {
            const select = form.querySelector('select[name="company_id"]');
            select.innerHTML = '<option value="">Select a company...</option>';
            companies.forEach(company => {
                select.innerHTML += `<option value="${company.id}">${company.name}</option>`;
            });
        });
    
    invoiceModal.show();
}

async function saveInvoice() {
    const form = document.getElementById('addInvoiceForm');
    const formData = new FormData(form);
    
    // Collect items data
    const items = [];
    document.querySelectorAll('#invoice-items .card').forEach(item => {
        const inputs = item.querySelectorAll('input');
        items.push({
            description: inputs[0].value,
            quantity: inputs[1].value,
            unit_price: inputs[2].value
        });
    });
    
    const invoice = {
        company_id: parseInt(formData.get('company_id')),
        issue_date: formData.get('issue_date'),
        due_date: formData.get('due_date'),
        items: items
    };
    
    try {
        const response = await fetch(`${API_URL}/invoices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoice)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        invoiceModal.hide();
        form.reset();
        document.getElementById('invoice-items').innerHTML = '';
        await loadInvoices();
        alert('Invoice created successfully!');
    } catch (error) {
        console.error('Error saving invoice:', error);
        alert('Failed to save invoice: ' + error.message);
    }
}

async function loadInvoices() {
    try {
        const response = await fetch(`${API_URL}/invoices`);
        const invoices = await response.json();
        
        const tableBody = document.getElementById('invoices-table-body');
        tableBody.innerHTML = '';
        
        invoices.forEach(invoice => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${invoice.invoice_number}</td>
                <td>${invoice.company_name || 'Unknown'}</td>
                <td>${invoice.issue_date}</td>
                <td>${invoice.due_date}</td>
                <td>$${invoice.total_amount.toFixed(2)}</td>
                <td><span class="badge bg-${invoice.status === 'paid' ? 'success' : 'warning'}">${invoice.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="previewInvoice(${invoice.id})">
                        <i class="bi bi-eye"></i> Preview
                    </button>
                    <button class="btn btn-sm btn-success" onclick="downloadInvoice(${invoice.id})">
                        <i class="bi bi-download"></i> Download
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading invoices:', error);
        alert('Failed to load invoices');
    }
}

async function previewInvoice(invoiceId) {
    try {
        const response = await fetch(`${API_URL}/invoices/${invoiceId}`);
        const data = await response.json();
        
        const previewDiv = document.getElementById('invoice-preview');
        previewDiv.innerHTML = `
            <div class="row mb-4">
                <div class="col-6">
                    <h2>INVOICE</h2>
                    <p>Invoice #: ${data.invoice.invoice_number}</p>
                    <p>Date: ${data.invoice.issue_date}</p>
                    <p>Due Date: ${data.invoice.due_date}</p>
                </div>
                <div class="col-6 text-end">
                    <h3>${data.company.name}</h3>
                    <p>${data.company.address || ''}</p>
                    <p>Tax Number: ${data.company.tax_number || ''}</p>
                    <p>Email: ${data.company.email || ''}</p>
                    <p>Phone: ${data.company.phone || ''}</p>
                </div>
            </div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.unit_price.toFixed(2)}</td>
                            <td>$${item.total.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="text-end"><strong>Total:</strong></td>
                        <td><strong>$${data.invoice.total_amount.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        `;
        
        currentInvoiceId = invoiceId;
        previewModal.show();
    } catch (error) {
        console.error('Error previewing invoice:', error);
        alert('Failed to preview invoice');
    }
}

async function downloadInvoice(invoiceId = null) {
    const id = invoiceId || currentInvoiceId;
    if (!id) return;
    
    try {
        const response = await fetch(`${API_URL}/invoices/${id}/download`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error('Error downloading invoice:', error);
        alert('Failed to download invoice');
    }
}

// Dashboard data
async function loadDashboardData() {
    try {
        const [invoicesResponse, companiesResponse] = await Promise.all([
            fetch(`${API_URL}/invoices`),
            fetch(`${API_URL}/companies`)
        ]);
        
        const invoices = await invoicesResponse.json();
        const companies = await companiesResponse.json();
        
        const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);
        
        document.getElementById('total-invoices').textContent = invoices.length;
        document.getElementById('total-companies').textContent = companies.length;
        document.getElementById('total-amount').textContent = `$${totalAmount.toFixed(2)}`;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Failed to load dashboard data');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    showDashboard();
});
