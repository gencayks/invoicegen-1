from flask import Flask, jsonify, request, send_file, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
import tempfile
from decimal import Decimal
import json
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, 
    static_url_path='/static',
    static_folder='static',
    template_folder='templates')

# Enable CORS for all routes with all origins
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///invoices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)
app.config['JSON_SORT_KEYS'] = False

db = SQLAlchemy(app)

# Models
class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    tax_number = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    invoices = db.relationship('Invoice', backref='company', lazy=True)

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    issue_date = db.Column(db.DateTime, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='draft')
    items = db.relationship('InvoiceItem', backref='invoice', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class InvoiceItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoice.id'), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)

# Create database tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/companies', methods=['GET', 'POST', 'OPTIONS'])
def handle_companies():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        if request.method == 'POST':
            data = request.json
            logger.debug(f"Received company data: {data}")
            
            new_company = Company(
                name=data['name'],
                address=data.get('address', ''),
                email=data.get('email', ''),
                phone=data.get('phone', ''),
                tax_number=data.get('tax_number', '')
            )
            db.session.add(new_company)
            db.session.commit()
            
            response_data = {
                'id': new_company.id,
                'name': new_company.name,
                'address': new_company.address,
                'email': new_company.email,
                'phone': new_company.phone,
                'tax_number': new_company.tax_number
            }
            logger.debug(f"Created company: {response_data}")
            return jsonify(response_data), 201
        
        companies = Company.query.all()
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'address': c.address or '',
            'email': c.email or '',
            'phone': c.phone or '',
            'tax_number': c.tax_number or ''
        } for c in companies])
    except Exception as e:
        logger.error(f"Error in handle_companies: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/invoices', methods=['GET', 'POST', 'OPTIONS'])
def handle_invoices():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        if request.method == 'POST':
            data = request.json
            logger.debug(f"Received invoice data: {data}")
            
            # Validate required fields
            if not data.get('company_id'):
                return jsonify({'error': 'company_id is required'}), 400
            if not data.get('issue_date'):
                return jsonify({'error': 'issue_date is required'}), 400
            if not data.get('due_date'):
                return jsonify({'error': 'due_date is required'}), 400
            if not data.get('items'):
                return jsonify({'error': 'items are required'}), 400

            # Create new invoice
            new_invoice = Invoice(
                invoice_number=f"INV-{datetime.now().strftime('%Y%m%d')}-{Invoice.query.count() + 1:04d}",
                company_id=int(data['company_id']),
                issue_date=datetime.strptime(data['issue_date'], '%Y-%m-%d'),
                due_date=datetime.strptime(data['due_date'], '%Y-%m-%d'),
                total_amount=sum(float(item['quantity']) * float(item['unit_price']) for item in data['items']),
                status='draft'
            )
            db.session.add(new_invoice)
            db.session.commit()

            # Create invoice items
            for item in data['items']:
                invoice_item = InvoiceItem(
                    invoice_id=new_invoice.id,
                    description=item['description'],
                    quantity=int(item['quantity']),
                    unit_price=float(item['unit_price']),
                    total=float(item['quantity']) * float(item['unit_price'])
                )
                db.session.add(invoice_item)
            
            db.session.commit()
            
            response_data = {
                'id': new_invoice.id,
                'invoice_number': new_invoice.invoice_number,
                'company_id': new_invoice.company_id,
                'issue_date': new_invoice.issue_date.strftime('%Y-%m-%d'),
                'due_date': new_invoice.due_date.strftime('%Y-%m-%d'),
                'total_amount': new_invoice.total_amount,
                'status': new_invoice.status
            }
            logger.debug(f"Created invoice: {response_data}")
            return jsonify(response_data), 201

        invoices = Invoice.query.all()
        return jsonify([{
            'id': i.id,
            'invoice_number': i.invoice_number,
            'company_id': i.company_id,
            'company_name': Company.query.get(i.company_id).name,
            'issue_date': i.issue_date.strftime('%Y-%m-%d'),
            'due_date': i.due_date.strftime('%Y-%m-%d'),
            'total_amount': i.total_amount,
            'status': i.status
        } for i in invoices])
    except Exception as e:
        logger.error(f"Error in handle_invoices: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/invoices/<int:invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    company = Company.query.get_or_404(invoice.company_id)
    items = InvoiceItem.query.filter_by(invoice_id=invoice_id).all()
    
    return jsonify({
        'invoice': {
            'id': invoice.id,
            'invoice_number': invoice.invoice_number,
            'issue_date': invoice.issue_date.strftime('%Y-%m-%d'),
            'due_date': invoice.due_date.strftime('%Y-%m-%d'),
            'total_amount': invoice.total_amount,
            'status': invoice.status
        },
        'company': {
            'name': company.name,
            'address': company.address,
            'email': company.email,
            'phone': company.phone,
            'tax_number': company.tax_number
        },
        'items': [{
            'description': item.description,
            'quantity': item.quantity,
            'unit_price': item.unit_price,
            'total': item.total
        } for item in items]
    })

@app.route('/api/invoices/<int:invoice_id>/download', methods=['GET'])
def download_invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    company = Company.query.get_or_404(invoice.company_id)
    items = InvoiceItem.query.filter_by(invoice_id=invoice_id).all()

    # Create a temporary file for the PDF
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    pdf_path = temp_file.name

    # Create PDF
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter

    # Add company details
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, height - 50, "INVOICE")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, f"Invoice #: {invoice.invoice_number}")
    c.drawString(50, height - 100, f"Date: {invoice.issue_date.strftime('%Y-%m-%d')}")
    c.drawString(50, height - 120, f"Due Date: {invoice.due_date.strftime('%Y-%m-%d')}")

    # Company information
    c.setFont("Helvetica-Bold", 14)
    c.drawString(400, height - 80, company.name)
    c.setFont("Helvetica", 12)
    if company.address:
        c.drawString(400, height - 100, company.address)
    if company.email:
        c.drawString(400, height - 120, f"Email: {company.email}")
    if company.phone:
        c.drawString(400, height - 140, f"Phone: {company.phone}")
    if company.tax_number:
        c.drawString(400, height - 160, f"Tax Number: {company.tax_number}")

    # Create items table
    data = [['Description', 'Quantity', 'Unit Price', 'Total']]
    for item in items:
        data.append([
            item.description,
            str(item.quantity),
            f"${item.unit_price:.2f}",
            f"${item.total:.2f}"
        ])
    
    # Add total row
    data.append(['', '', 'Total:', f"${invoice.total_amount:.2f}"])

    # Create table
    table = Table(data, colWidths=[250, 75, 100, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, -1), (-1, -1), colors.beige),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.black),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -2), 1, colors.black),
        ('GRID', (-2, -1), (-1, -1), 1, colors.black),
        ('ALIGN', (-1, 0), (-1, -1), 'RIGHT'),
        ('ALIGN', (-2, 0), (-2, -1), 'RIGHT'),
    ]))

    # Draw table
    table.wrapOn(c, width, height)
    table.drawOn(c, 50, height - 400)

    c.save()

    return send_file(
        pdf_path,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f'invoice_{invoice.invoice_number}.pdf'
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)
