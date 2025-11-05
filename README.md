# Organ-and-Blood-Donation-Inventory-Management-System

A comprehensive inventory management system designed to streamline the processes of organ and blood donation tracking, donor management, and distribution coordination. This project aims to bridge the gap between donors, recipients, and healthcare facilities through an efficient, user-friendly interface.

## About This Project

This system provides a centralized platform for managing:
- **Blood donation inventories** with real-time tracking of blood types and availability
- **Organ donation registrations** and matching algorithms
- **Donor and recipient databases** with secure information management
- **Request and distribution workflows** for healthcare facilities
- **Analytics and visualizations** for donation trends and patterns

## Built With

● ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) - Backend API

● ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white) - Web Framework

● ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) - Frontend UI

● ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) - Database

● ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white) - Data Visualization


## Features

### Core Functionality

- **Comprehensive Donor Management**
  - Register new blood and organ donors with detailed profiles
  - Track medical history and eligibility status
  - Support for all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
  - Track necessary information such as date of birth, address, etc.

- **Recipient Registration & Tracking**
  - Patient registration with medical condition documentation
  - Required blood type and organ specification
  - Priority-based management system
  - Comprehensive medical history tracking

- **Donation Recording System**
  - Record blood donations with quantity tracking
  - Organ donation logging with type specification
  - Staff verification system for donation authenticity
  - Date-based donation tracking
  - Support for multiple donation types per donor

- **Real-Time Inventory Management**
  - Separate views for blood and organ inventories
  - Live inventory status monitoring
  - Searchable and filterable inventory lists
  - Comprehensive inventory data tables

- **Request Processing Workflow**
  - View pending requests from hospitals and recipients
  - Request fulfillment system with staff verification
  - Automated request tracking
  - Quantity and urgency tracking

- **Donor Information Dashboard**
  - Complete donor listing with search functionality
  - Donation history for each donor
  - Status indicators (Blood, Organs, or Both)
  - Total donation count per donor
  - Last donation date tracking
  - Real-time data refresh capability

### Additional Features

- **Secure Authentication System**
  - Staff login with bcrypt password hashing
  - Role-based access control
  - Session management
  - Secure credential storage

- **Interactive Dashboard**
  - Quick action buttons for common tasks
  - Quick Facts, motivational messages, and statistics
  - Animated blood cell background visualization

- **Data Visualization & Analytics**
  - **Line Chart**: Daily donation trends over the last 7 days
  - **Pie Chart**: Donation type distribution (Blood vs. different organ types)
  - Real-time chart updates after new donations
  - Visual insights into donation patterns

- **Form Validation & User Feedback**
  - Email format validation
  - Phone number format checking
  - Date format validation (YYYY-MM-DD)
  - Success/error message notifications with auto-fade
  - Loading states for all operations
  - Clear form functionality

- **Data Integrity Features**
  - Input sanitization and validation
  - Required field enforcement
  - Numeric ID verification
  - Foreign key relationship enforcement
  - CORS-enabled API for secure cross-origin requests

## Project Structure
```
DONATION_INVENTORY/
│
├── backend/
│   ├── app.py                    # Flask API with all endpoints
│   └── requirements.txt          # Python dependencies
│
├── frontend/
│   ├── public/
│   │   └── vite.svg             # Vite logo
│   │
│   ├── src/
│   │   ├── assets/              # Static assets
│   │   ├── components/
│   │   │   └── RBCCanvas.jsx    # Animated blood cell background
│   │   ├── App.css              # Component-specific styles
│   │   ├── App.jsx              # Main React application
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # Application entry point
│   │
│   ├── .gitignore
│   ├── index.html               # HTML entry point
│   ├── package.json             # Node dependencies
│   ├── package-lock.json        # Locked dependency versions
│   └── vite.config.js           # Vite configuration
│
└── README.md                     # Project documentation
```

## Getting Started

### Prerequisites
```bash
Python 3.x
pip install tkinter
pip install mysql-connector-python
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/nehanpnair/Organ-and-Blood-Donation-Inventory-Management-System.git
```

2. Navigate to the project directory
```bash
cd Organ-and-Blood-Donation-Inventory-Management-System
```

3. Install required dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Configure environment variables (or update app.py directly)
```bash
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=Donation_inventory
```

5. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Install additional required packages
npm install @fortawesome/fontawesome-free chart.js react-chartjs-2
```

6. Running the application:
   
**Terminal 1 - Start Backend:**
```bash
cd backend
python app.py
```
Sample Output: Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Sample Output: Frontend will run on `http://localhost:5173`

7. **Access the Application**
- Open your browser and navigate to `http://localhost:5173`
- Login with your staff/admin credentials to access the system

## Usage

1. **Admin Panel**: Manage system settings, user accounts, and oversee all operations
2. **Donor Interface**: Register as a donor, update information, view donation history
3. **Staff Interface**: Submit requests, check inventory, manage patient records
4. **Inventory Dashboard**: Monitor real-time blood and organ availability



## Contributors

* **Neha Nair** - [@nehanpnair](https://github.com/nehanpnair)
* **Prerana MN** - [@pmn2305](https://github.com/pmn2305)

