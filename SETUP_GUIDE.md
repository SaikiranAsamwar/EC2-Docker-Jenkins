# Bank Management System - Local Setup Guide (Without Docker)

## Prerequisites
1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)

## Step-by-Step Setup

### 1. Setup MySQL Database

**Option A: Using MySQL Workbench or Command Line Client**

1. Start MySQL server
2. Open MySQL client and run the initialization script:
```sql
source A:\Resume-Projects\EC2-Docker-Jenkins\database\init.sql
```

**Option B: Using MySQL Command Line**
```bash
mysql -u root -p < database/init.sql
```

### 2. Configure Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file with your MySQL credentials:
   - Open `backend/.env`
   - Set `DB_PASSWORD` to your MySQL root password
   - Adjust other settings if needed (DB_USER, DB_HOST, etc.)

### 3. Configure Frontend

1. Open a new terminal and navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend will run on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

### 5. Access the Application

Open your browser and navigate to: **http://localhost:3000**

## API Endpoints

- Health Check: http://localhost:5000/api/health
- Accounts: http://localhost:5000/api/accounts
- Transactions: http://localhost:5000/api/transactions

## Troubleshooting

### MySQL Connection Issues
- Ensure MySQL service is running
- Verify credentials in `backend/.env`
- Check if MySQL is listening on port 3306

### Port Already in Use
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (3000): React will prompt to use a different port

### Database Not Found
- Run the `database/init.sql` script again
- Verify database was created: `SHOW DATABASES;`

## Development Mode

For development with auto-reload:

**Backend:**
```bash
cd backend
npm run dev
```
(Requires nodemon)

**Frontend:**
```bash
cd frontend
npm start
```
(Auto-reloads by default with React)
