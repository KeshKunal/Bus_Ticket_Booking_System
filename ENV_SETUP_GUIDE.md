# Environment Variables Setup Guide

This guide explains all environment variables required to run the Bus Ticket Booking application locally.

---

## 📋 Environment Variables Reference

| Variable Name | Purpose | How to Populate | Required |
|--------------|---------|-----------------|----------|
| **DB_HOST** | MySQL database server hostname | Use `localhost` for local development. For remote databases, use the provided hostname (e.g., `mysql-abc123.example.com`) | ✅ Yes |
| **DB_PORT** | MySQL database server port | Use `3306` (default MySQL port). Change only if your MySQL instance runs on a different port | ✅ Yes |
| **DB_USER** | MySQL database username | Use `root` for local development, or create a dedicated user with appropriate permissions (`CREATE`, `SELECT`, `INSERT`, `UPDATE`, `DELETE` on the database) | ✅ Yes |
| **DB_PASSWORD** | MySQL database password | Set this to your MySQL user's password. For local development, use your root password or the password you set when creating a dedicated user | ✅ Yes |
| **DB_NAME** | MySQL database name | Use `bus_booking` (or create a database with this name using `CREATE DATABASE bus_booking;`) | ✅ Yes |
| **DB_SSL** | Enable SSL for database connection | Set to `true` only if connecting to a managed database service (Aiven, AWS RDS, Azure Database, etc.) that requires SSL. Use `false` for local MySQL | ❌ No (defaults to `false`) |
| **DB_SSL_CA_PATH** | Path to SSL CA certificate file | Only needed if `DB_SSL=true`. Download the CA certificate from your database provider and provide the absolute path (e.g., `/path/to/ca-certificate.crt` or `C:\certs\ca.pem` on Windows) | ❌ No (only if SSL enabled) |
| **PORT** | Backend Express server port | Use `5000` (default). Change if port 5000 is already in use on your system | ❌ No (defaults to `5000`) |
| **VITE_API_URL** | Frontend API endpoint URL | Use `http://localhost:5000` for local development. Must match the backend PORT. If deploying, use your production API URL (e.g., `https://api.yourdomain.com`) | ❌ No (defaults to `http://localhost:5000`) |

---

## 🚀 Quick Start Setup

### 1. Create the `.env` file
Copy the provided `.env` template to the root of your project.

### 2. Set up MySQL Database

**Option A: Local MySQL Installation**
```bash
# Install MySQL (if not already installed)
# - Windows: Download from https://dev.mysql.com/downloads/installer/
# - macOS: brew install mysql
# - Linux: sudo apt-get install mysql-server

# Start MySQL service
# - Windows: Start via Services or MySQL Workbench
# - macOS: brew services start mysql
# - Linux: sudo systemctl start mysql

# Create the database
mysql -u root -p
CREATE DATABASE bus_booking;
EXIT;
```

**Option B: Using Docker**
```bash
docker run --name bus-booking-mysql \
  -e MYSQL_ROOT_PASSWORD=your_password_here \
  -e MYSQL_DATABASE=bus_booking \
  -p 3306:3306 \
  -d mysql:8.0
```

### 3. Update `.env` with your credentials
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=bus_booking
DB_SSL=false
DB_SSL_CA_PATH=

PORT=5000

VITE_API_URL=http://localhost:5000
```

### 4. Install dependencies and run
```bash
# Install dependencies
npm install

# Run backend server (in one terminal)
npm run server

# Run frontend dev server (in another terminal)
npm run dev
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` to version control** - It's already in `.gitignore`
2. **Use strong passwords** for production databases
3. **Create dedicated database users** with minimal required permissions instead of using root
4. **Enable SSL** (`DB_SSL=true`) when connecting to production databases
5. **Rotate credentials regularly** in production environments

---

## 🌐 Production Deployment Notes

When deploying to production:

1. **Database Configuration**:
   - Use a managed database service (AWS RDS, Azure Database, Aiven, PlanetScale, etc.)
   - Enable SSL: `DB_SSL=true`
   - Download and reference the CA certificate: `DB_SSL_CA_PATH=/path/to/ca.crt`
   - Use strong, randomly generated passwords

2. **Backend Configuration**:
   - `PORT` may be set by your hosting provider (Heroku, Railway, etc.)
   - Ensure firewall rules allow database connections

3. **Frontend Configuration**:
   - Update `VITE_API_URL` to your production API URL
   - Rebuild the frontend after changing this value: `npm run build`

---

## 🐛 Troubleshooting

### Connection Refused / ECONNREFUSED
- Verify MySQL is running: `mysql -u root -p`
- Check `DB_HOST` and `DB_PORT` are correct
- Ensure firewall allows connections on port 3306

### Authentication Failed
- Verify `DB_USER` and `DB_PASSWORD` are correct
- Check user has permissions: `GRANT ALL PRIVILEGES ON bus_booking.* TO 'your_user'@'localhost';`

### SSL Connection Errors
- If using managed database, ensure `DB_SSL=true`
- Verify `DB_SSL_CA_PATH` points to valid certificate file
- Check certificate hasn't expired

### Frontend Can't Connect to Backend
- Verify backend is running on the port specified in `PORT`
- Ensure `VITE_API_URL` matches the backend URL
- Check CORS is properly configured (already handled in `server.js`)

---

## 📝 Additional Notes

- The application uses **mysql2** with connection pooling (max 10 connections)
- Database transactions are supported via the `withTransaction` helper
- The frontend uses **Vite** for development and build tooling
- Environment variables prefixed with `VITE_` are exposed to the frontend code
