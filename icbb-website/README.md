# ICBB - Institute of Computational Biology and Bioinformatics

A professional website for the Institute of Computational Biology and Bioinformatics (ICBB), providing data analysis services, training programs, and research resources.

## Features

- **Service Request System**: Multi-step form for submitting data analysis requests
- **MTN MoMo Payment Integration**: Ghana mobile money payment processing
- **Training Registration**: Sign up for workshops, courses, and bootcamps
- **Admin Dashboard**: Manage requests, training registrations, and contact messages
- **Responsive Design**: Works on all devices

## Tech Stack

### Frontend
- React 18.2
- React Router DOM 6
- Framer Motion (animations)
- React Icons
- React Toastify (notifications)
- Axios (HTTP client)

### Backend
- Node.js / Express.js
- MongoDB / Mongoose
- JWT Authentication
- Multer (file uploads)
- Nodemailer (email)

## Project Structure

```
icbb-website/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       └── styles/         # CSS files
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
└── package.json            # Root package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd icbb-website
   npm install
   ```

2. **Configure environment variables:**
   
   Create `server/.env` from the example:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Update the following values:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   MOMO_API_KEY=your_momo_api_key
   MOMO_USER_ID=your_momo_user_id
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```
   
   This starts both frontend (port 3000) and backend (port 5000).

### Individual Commands
- `npm run client` - Start React frontend only
- `npm run server` - Start Node.js backend only
- `npm run dev` - Start both concurrently

## Admin Access

Access the admin dashboard at `/admin`

**Default Credentials:**
- Email: jesseanak98@gmail.com
- Password: Jese@1998

> **Note:** Change these credentials in production!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `POST /api/services/request` - Submit service request
- `GET /api/services/request/:id` - Get request by ID

### Training
- `POST /api/training/register` - Register for training

### Contact
- `POST /api/contact` - Submit contact message

### Payments
- `POST /api/payments/initiate` - Initiate MTN MoMo payment
- `POST /api/payments/confirm` - Confirm payment

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/requests` - All service requests
- `PATCH /api/admin/requests/:id/status` - Update request status
- `POST /api/admin/requests/:id/upload` - Upload results file

## Deployment

### Frontend (Vercel/Netlify)
1. Build: `cd client && npm run build`
2. Deploy `client/build` folder

### Backend (Heroku/Railway/VPS)
1. Set environment variables
2. Deploy `server` folder
3. Update `MONGODB_URI` to production database

## Payment Integration

The website uses MTN Mobile Money (MoMo) for payments in Ghana.

**Account Details:**
- Name: Jesse Azebiik Anak
- Number: 0559759592
- Network: MTN Ghana

> Update the MoMo API credentials in `.env` for production.

## Support

For questions or support, contact:
- Email: info@icbb.org
- Phone: +233 55 975 9592

## License

Copyright © 2024 ICBB. All rights reserved.
