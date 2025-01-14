# Pro Invoice Generator

A professional invoice generator application that allows you to create, preview, and download invoices for companies. Built with Flask and modern web technologies.

## Features

- Dashboard with key metrics
- Company management
- Invoice creation with multiple line items
- PDF invoice generation and download
- Invoice preview
- Modern and responsive UI
- Easy to use interface

## Prerequisites

- Python 3.8+
- pip (Python package manager)

## Installation

1. Clone the repository
2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

4. Install the required packages:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Activate the virtual environment (if not already activated)
2. Run the Flask application:
```bash
python app.py
```
3. Open your browser and navigate to `http://localhost:5000`

## Usage

1. First, add your companies through the Companies section
2. Create invoices for your companies with multiple line items
3. Preview invoices before generating PDFs
4. Download invoices as PDFs
5. Track all your invoices and companies through the dashboard

## Project Structure

```
pro-invoice-generator/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/
│   └── js/
│       └── main.js    # Frontend JavaScript
└── templates/
    └── index.html     # Main HTML template
```

## Technologies Used

- Backend:
  - Flask (Python web framework)
  - SQLAlchemy (Database ORM)
  - WeasyPrint (PDF generation)
  
- Frontend:
  - Bootstrap 5 (UI framework)
  - JavaScript (ES6+)
  - Fetch API (AJAX requests)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
