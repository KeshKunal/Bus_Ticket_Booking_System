# Bus Ticket Booking System

A modern, responsive full-stack bus ticket booking application built with **React**, **Vite**, **Tailwind CSS**, and **Express.js**. This system allows users to search for buses, select seats, book tickets, process payments, and manage their booking history.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Application Routes](#application-routes)
- [Key Components](#key-components)
- [Backend API](#backend-api)
- [Database Schema](#database-schema)
- [Theme & Styling](#theme--styling)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### User Features

- 🔐 **User Authentication** - Secure login and registration system
- 🔍 **Bus Search** - Search buses by source, destination, and date
- 🪑 **Seat Selection** - Interactive seat selection with real-time availability
- 🛒 **Booking Management** - Add/remove passengers and manage booking details
- 💳 **Payment Processing** - Secure payment integration
- 🎫 **E-Tickets** - Generate and download digital tickets
- 📜 **Booking History** - View past bookings and transactions
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Admin Features

- 🚌 **Bus Management** - Add, edit, and manage bus inventory
- 💰 **Pricing Management** - Dynamic pricing for different routes
- 📊 **Booking Analytics** - View booking trends and revenue
- 🗄️ **Database Management** - MySQL integration with full CRUD operations

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library for building interactive components
- **Vite** - Lightning-fast build tool and dev server
- **React Router v6** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Framer Motion** - Smooth animations and transitions
- **React Icons** - SVG icon library
- **PostCSS** - CSS processing pipeline

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Lightweight web framework
- **MySQL** - Relational database
- **mysql2** - MySQL database driver
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Development Tools

- **ESLint** - Code quality and style enforcement
- **Autoprefixer** - Automatic CSS vendor prefixes

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) - Comes with Node.js
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download](https://git-scm.com/)

### Optional

- **Visual Studio Code** - Recommended code editor
- **MySQL Workbench** - GUI for MySQL management
- **Postman** - For testing API endpoints

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/bus-ticket-booking.git
cd bus-ticket-booking
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up MySQL Database

**Option A: Manual Setup**

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE bus_booking;

# Exit MySQL
EXIT;
```

**Option B: Using Docker**

```bash
docker run --name bus-booking-mysql \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=bus_booking \
  -p 3306:3306 \
  -d mysql:8.0
```

### Step 4: Create Environment Files

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root123
DB_NAME=bus_booking
DB_SSL=false

# Backend Server
PORT=5000

# Frontend API
VITE_API_URL=http://localhost:5000
```

### Step 5: Initialize Database Schema

The database schema will be initialized on first run. Tables include:

- `users` - User account information
- `buses` - Bus details and availability
- `bookings` - Booking records
- `passengers` - Passenger information for each booking
- `payments` - Payment transaction history

### Step 6: Verify Setup

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MySQL connection
mysql -u root -p -e "SELECT VERSION();"
```

---

## 🔐 Environment Variables

Detailed environment variable configuration is available in [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md).

| Variable         | Purpose               | Default                 |
| ---------------- | --------------------- | ----------------------- |
| `DB_HOST`        | MySQL server hostname | `localhost`             |
| `DB_PORT`        | MySQL server port     | `3306`                  |
| `DB_USER`        | MySQL username        | `root`                  |
| `DB_PASSWORD`    | MySQL password        | Required                |
| `DB_NAME`        | Database name         | `bus_booking`           |
| `DB_SSL`         | Enable SSL connection | `false`                 |
| `DB_SSL_CA_PATH` | SSL certificate path  | Optional                |
| `PORT`           | Backend server port   | `5000`                  |
| `VITE_API_URL`   | Frontend API endpoint | `http://localhost:5000` |

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**

```bash
npm run server
```

Output: `Server running on http://localhost:5000`

**Terminal 2 - Start Frontend Dev Server:**

```bash
npm run dev
```

Output: `Local: http://localhost:5173` (or displayed in terminal)

### Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

### Production Mode

**Build the frontend:**

```bash
npm run build
```

**Preview production build:**

```bash
npm run preview
```

---

## 📁 Project Structure

```
Bus_Ticket_Booking_System/
├── public/                          # Static assets
│   └── vite.svg                    # Vite logo
│
├── server/                          # Backend/API server
│   ├── server.js                   # Express server entry point
│   ├── db.js                       # Database connection setup
│   └── routes/                     # API endpoints
│       ├── auth.js                 # Authentication routes (login/register)
│       ├── booking.js              # Booking management routes
│       ├── search.js               # Bus search routes
│       └── seats.js                # Seat availability routes
│
├── src/                             # Frontend React source code
│   ├── main.jsx                    # Application entry point
│   ├── App.jsx                     # Root component with routing
│   ├── index.css                   # Global styles
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── navbar/Navbar.jsx       # Top navigation bar
│   │   ├── footer/Footer.jsx       # Footer component
│   │   └── theme/Theme.jsx         # Dark/light theme toggle
│   │
│   ├── pages/                      # Page components (routes)
│   │   ├── Home.jsx                # Home page
│   │   ├── Login.jsx               # User login
│   │   ├── Bus.jsx                 # Bus search and listing
│   │   ├── SeatSelection.jsx       # Interactive seat picker
│   │   ├── Checkout.jsx            # Booking review
│   │   ├── Payment.jsx             # Payment processing
│   │   ├── Ticket.jsx              # E-ticket display
│   │   ├── History.jsx             # Booking history
│   │   ├── About.jsx               # About page
│   │   └── Services.jsx            # Services page
│   │
│   ├── context/                    # React Context for state management
│   │   └── BookingContext.jsx      # Global booking state
│   │
│   ├── data/                       # Static data
│   │   ├── buses.js                # Bus information
│   │   └── cities.js               # Cities/routes data
│   │
│   └── assets/                     # Images and media
│
├── index.html                      # HTML entry point for Vite
├── package.json                    # Project metadata and dependencies
├── package-lock.json               # Locked dependency versions
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── README.md                       # This file
├── ENV_SETUP_GUIDE.md              # Environment setup guide
└── PROJECT_OVERVIEW.md             # Detailed project overview
```

---

## 📝 Available Scripts

### Frontend Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint
```

### Backend Scripts

```bash
# Start backend server
npm run server
```

### Combined Development

```bash
# Start both frontend and backend (requires two terminals)
# Terminal 1:
npm run server

# Terminal 2:
npm run dev
```

---

## 🗺️ Application Routes

| Route         | Component     | Description                      |
| ------------- | ------------- | -------------------------------- |
| `/`           | Home          | Landing page with featured buses |
| `/login`      | Login         | User authentication              |
| `/bus`        | Bus           | Search and filter buses          |
| `/bus/:busId` | SeatSelection | Interactive seat selection       |
| `/checkout`   | Checkout      | Review booking details           |
| `/payment`    | Payment       | Process payment                  |
| `/ticket`     | Ticket        | View booked ticket               |
| `/history`    | History       | User booking history             |
| `/about`      | About         | About the company                |
| `/services`   | Services      | Services offered                 |
| `*`           | NotFound      | 404 page                         |

---

## 🧩 Key Components

### Navbar Component (`src/components/navbar/Navbar.jsx`)

- Responsive navigation menu
- Mobile hamburger menu
- Theme toggle button
- Logo and branding
- Active route highlighting

### Footer Component (`src/components/footer/Footer.jsx`)

- Company information
- Quick links
- Contact details
- Social media links
- Copyright information

### Theme Toggle (`src/components/theme/Theme.jsx`)

- Light/Dark mode switching
- LocalStorage persistence
- Smooth transitions
- Icon-based toggle

### Booking Context (`src/context/BookingContext.jsx`)

- Global state management for bookings
- Trip information state
- Passenger data management
- Selected seats tracking
- Payment status

---

## 🔌 Backend API

### Authentication Endpoints

```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
POST /api/auth/logout      # Logout user
GET  /api/auth/profile     # Get user profile
```

### Bus Search Endpoints

```
GET /api/search            # Search buses by criteria
GET /api/buses             # Get all buses
GET /api/buses/:id         # Get bus details
```

### Seat Management

```
GET /api/seats/:busId      # Get available seats for a bus
POST /api/seats/select     # Select seats
```

### Booking Endpoints

```
POST /api/bookings         # Create new booking
GET  /api/bookings         # Get user bookings
GET  /api/bookings/:id     # Get booking details
PUT  /api/bookings/:id     # Update booking
DELETE /api/bookings/:id   # Cancel booking
```

### Payment Endpoints

```
POST /api/payments         # Process payment
GET  /api/payments/:id     # Get payment status
```

---

## 🗄️ Database Schema

### Users Table

```sql
- user_id (PK, Auto-increment)
- email (Unique)
- full_name
- phone
- password_hash
- created_at
```

### Buses Table

```sql
- bus_id (PK, Auto-increment)
- bus_name
- operator_name
- route_from
- route_to
- departure_time
- arrival_time
- total_seats
- price
- bus_type
- amenities
```

### Bookings Table

```sql
- booking_id (PK, Auto-increment)
- user_id (FK)
- bus_id (FK)
- booking_date
- travel_date
- total_price
- status
- confirmation_number
```

### Passengers Table

```sql
- passenger_id (PK, Auto-increment)
- booking_id (FK)
- full_name
- email
- phone
- seat_number
```

### Payments Table

```sql
- payment_id (PK, Auto-increment)
- booking_id (FK)
- amount
- payment_method
- payment_status
- transaction_id
- created_at
```

---

## 🎨 Theme & Styling

### Tailwind CSS

- Utility-first CSS framework
- Dark mode support with class strategy
- Custom color scheme
- Responsive breakpoints

### Framer Motion

- Page transitions
- Hover effects
- Loading animations
- Smooth state changes

### Global Styles

- Custom scrollbar styling
- Smooth transitions
- Consistent spacing
- Typography scale

---

## 🏗️ Build & Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory with:

- Minified JavaScript and CSS
- Asset optimization
- Code splitting
- Tree shaking

### Deployment Options

**Netlify:**

```bash
npm run build
# Deploy dist/ folder
```

**Vercel:**

```bash
npm run build
# Deploy dist/ folder
```

**Docker:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5000 3000
CMD ["npm", "run", "server"]
```

### Environment Setup for Production

- Use environment variables from your hosting provider
- Enable SSL for database connections
- Use strong database passwords
- Implement HTTPS
- Set up proper CORS policies

---

## 📋 Checklist for Getting Started

- [ ] Node.js and npm installed
- [ ] MySQL installed and running
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with credentials
- [ ] Database initialized
- [ ] Backend server running (`npm run server`)
- [ ] Frontend dev server running (`npm run dev`)
- [ ] Application accessible at `http://localhost:5173`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Test your changes before submitting
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing documentation in `ENV_SETUP_GUIDE.md` and `PROJECT_OVERVIEW.md`
- Review the backend API route files in `server/routes/`

---

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong, unique passwords for production databases
- Enable SSL for production database connections
- Implement proper authentication and authorization
- Keep dependencies updated
- Regular security audits recommended

---

**Happy Booking! 🚌✨**
