# Bank Management System 🏦

A complete 3-tier banking application with frontend, backend, and database layers. This application provides full CRUD operations for managing bank accounts and performing banking transactions.

## 🌟 Features

### Account Management
- ✅ Create new bank accounts
- ✅ View all accounts with details
- ✅ Update account information
- ✅ Delete accounts
- ✅ Support for multiple account types (Savings, Current, Fixed Deposit)

### Banking Operations
- 💰 Deposit money
- 💸 Withdraw money
- 📊 View transaction history
- 💳 Check account balance

### Additional Features
- 🔒 Account status management (Active, Inactive, Closed)
- 📱 Responsive design for mobile and desktop
- 🎨 Modern and intuitive UI
- ⚡ Real-time balance updates

## 🏗️ Architecture

This is a 3-tier application:

```
┌─────────────────────────────────────────┐
│          Frontend (React)               │
│  - User Interface                       │
│  - Account Management UI                │
│  - Transaction Forms                    │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│       Backend (Node.js + Express)       │
│  - REST API Endpoints                   │
│  - Business Logic                       │
│  - Request Validation                   │
└──────────────┬──────────────────────────┘
               │ MySQL Connection
┌──────────────▼──────────────────────────┐
│          Database (MySQL)               │
│  - Accounts Table                       │
│  - Transactions Table                   │
│  - Data Persistence                     │
└─────────────────────────────────────────┘
```

## 📁 Project Structure

```
EC2-Docker-Jenkins/
├── frontend/                 # React frontend application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── AccountList.js
│   │   │   ├── AccountForm.js
│   │   │   ├── TransactionForm.js
│   │   │   └── TransactionList.js
│   │   ├── services/         # API service layer
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── config/
│   │   └── database.js       # Database connection
│   ├── controllers/          # Request handlers
│   │   ├── accountController.js
│   │   └── transactionController.js
│   ├── routes/               # API routes
│   │   ├── accountRoutes.js
│   │   └── transactionRoutes.js
│   ├── server.js             # Main server file
│   ├── Dockerfile
│   ├── .env
│   └── package.json
├── database/                 # Database scripts
│   └── init.sql              # Database initialization
├── docker-compose.yml        # Docker orchestration
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Docker and Docker Compose (for containerized deployment)

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   cd a:\Resume-Projects\EC2-Docker-Jenkins
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:3307

4. **Stop the services**
   ```bash
   docker-compose down
   ```

### Option 2: Manual Setup

#### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the initialization script
source a:\Resume-Projects\EC2-Docker-Jenkins\database\init.sql
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Update .env file with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=bank_management
# DB_PORT=3306

# Start the backend server
npm start

# For development with auto-reload
npm run dev
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📡 API Endpoints

### Account Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | Get all accounts |
| GET | `/api/accounts/:id` | Get account by ID |
| POST | `/api/accounts` | Create new account |
| PUT | `/api/accounts/:id` | Update account |
| DELETE | `/api/accounts/:id` | Delete account |
| POST | `/api/accounts/:id/deposit` | Deposit money |
| POST | `/api/accounts/:id/withdraw` | Withdraw money |

### Transaction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/account/:accountId` | Get transactions by account |

### Example API Requests

**Create Account:**
```bash
curl -X POST http://localhost:5000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "account_holder_name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "account_type": "Savings",
    "initial_balance": 1000
  }'
```

**Deposit Money:**
```bash
curl -X POST http://localhost:5000/api/accounts/1/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 500}'
```

**Withdraw Money:**
```bash
curl -X POST http://localhost:5000/api/accounts/1/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 200}'
```

## 🗄️ Database Schema

### Accounts Table
```sql
- account_id (Primary Key)
- account_number (Unique)
- account_holder_name
- email (Unique)
- phone
- account_type (Savings/Current/Fixed Deposit)
- balance
- status (Active/Inactive/Closed)
- created_at
- updated_at
```

### Transactions Table
```sql
- transaction_id (Primary Key)
- account_id (Foreign Key)
- transaction_type (Deposit/Withdrawal/Transfer)
- amount
- balance_after
- description
- transaction_date
```

## 🛠️ Technologies Used

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL 8.0** - Relational database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server for frontend

## 🎨 Screenshots & Features

### User Interface Features:
- 🎨 Modern gradient design
- 📱 Fully responsive layout
- ⚡ Real-time updates
- 🔔 Success/error notifications
- 💳 Interactive account cards
- 📊 Transaction history view

## 🔒 Security Notes

⚠️ **Important:** This is a demo application. For production use, implement:
- User authentication and authorization
- Password encryption
- Input validation and sanitization
- Rate limiting
- HTTPS/TLS encryption
- SQL injection prevention
- CSRF protection

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify port 5000 is not in use

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API URL in frontend service

### Docker issues
- Ensure Docker daemon is running
- Check if ports 3000, 5000, 3307 are available
- Try `docker-compose down -v` to reset volumes

## 📝 Future Enhancements

- [ ] User authentication and login system
- [ ] Fund transfer between accounts
- [ ] Account statements and reports
- [ ] Email notifications
- [ ] Transaction filters and search
- [ ] Admin dashboard
- [ ] Multi-currency support
- [ ] Loan management
- [ ] Credit/Debit card management

## 👨‍💻 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend production build
cd frontend
npm run build

# Backend can run directly with
cd backend
npm start
```

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please create an issue in the repository.

---

**Happy Banking! 🏦💰**
