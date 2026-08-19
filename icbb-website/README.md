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

Access the admin dashboard at `/admin`.

There are no default credentials. Create the first admin account by setting
`ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env` and running:

```bash
npm run seed
```

Re-running the seed with a different `ADMIN_PASSWORD` rotates the password of an
existing account.

> Never commit real credentials. `server/.env.example` is a template of variable
> names only — real values belong in `server/.env` (gitignored) or in the Vercel
> project's environment variables.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `POST /api/services/request` - Submit service request
- `GET /api/services/request/:id` - Get request by ID

### Training
- `GET /api/training/programs` - List available programs
- `GET /api/training/programs/:id` - Get one program
- `POST /api/training/register` - Express interest in a programme

### Participants (learner accounts)
- `POST /api/participants/register` - Create a learner account
- `POST /api/participants/login` - Sign in
- `GET /api/participants/me` - Current participant
- `POST /api/participants/enrol` - Enrol in a course
- `POST /api/participants/quiz-attempts` - Submit a unit quiz
- `GET /api/participants/progress/:courseId` - Best score per unit

> Quiz submissions send **only the chosen option indices**. The API grades them
> against `server/data/quiz-keys.json` and stores its own result, because a score
> reported by the learner's browser is not evidence. Participant tokens carry
> `type: "participant"` and are rejected on staff routes, and staff tokens are
> rejected on participant routes.

## Course materials

`npm run build:materials` regenerates everything under
`client/public/materials/` from `client/src/content/`, plus the API's answer key.
Nothing restates the curriculum, so the site, the slides and the handouts cannot
disagree.

Per module it produces:

| Output | Format | Notes |
| --- | --- | --- |
| `unit-NN-slides.pptx` | PowerPoint | Native bullet paragraphs, fully editable |
| `unit-NN-handout.pdf` | PDF | Unit handout with worked examples, quiz and answer key |
| `<course>-slides.pptx` | PowerPoint | The whole module in one deck |
| `<course>-workbook.pdf` | PDF | Every unit in one document |
| `<course>-syllabus.pdf` | PDF | Outline, assessment and rubric |

Only `.pptx` and `.pdf` are shipped. The HTML used to lay the PDFs out is an
intermediate written to a scratch directory, and the generator deletes anything
else it finds in `materials/`.

Typography is Constantia for reading text and Corbel for labels and tables, in
both the decks and the PDFs. These ship with Windows and Microsoft Office, so
the build is reproducible and a deck looks the same on the lecturer's machine.
Web fonts were tried and abandoned: only families already in Chrome's cache
rendered, so the same source produced different PDFs on different runs.

All documents and decks carry the ICBB watermark and are authored to
**Jesse Anak**. PDFs are rendered with headless Chrome; set `CHROME_PATH` if it
is not found automatically. Generated files are committed because Vercel's build
image has no Chrome.

### Contact
- `POST /api/contact` - Submit contact message

### Payments
- `POST /api/payments/initiate` - Get MoMo payment instructions for a request
- `POST /api/payments/confirm` - Client reports having paid (records a claim only)
- `POST /api/payments/verify` - **Admin only.** Confirms the money arrived
- `GET /api/payments/status/:requestId` - Payment status

> A client reporting payment does **not** mark a request paid. An admin must
> check the MoMo account and call `/verify`. Anything else lets a stranger mark
> their own request as settled.

### Admin (Protected)
- `GET /api/admin/dashboard` - Dashboard statistics and recent requests
- `GET /api/admin/requests` - All service requests
- `GET /api/admin/requests/:id` - One service request
- `PUT /api/admin/requests/:id/status` - Update request status
- `POST /api/admin/requests/:id/upload-results` - Upload results (field name: `files`)
- `GET /api/admin/registrations` - Training registrations
- `PUT /api/admin/registrations/:id/status` - Update registration status
- `GET /api/admin/contacts` - Contact submissions
- `PUT /api/admin/contacts/:id/status` - Update contact status

All admin responses are shaped `{ success, data }`.

## Deployment

The site and the API deploy together to Vercel from this directory. The API runs
as a Vercel Function (`api/index.js`) that wraps the same Express app used
locally, so `/api/*` is served from the same origin as the site — no CORS, and no
second host to keep alive.

### Vercel project settings
- **Root Directory:** `icbb-website`
- **Framework Preset:** Other (build and output come from `vercel.json`)

### Required environment variables
Set these in the Vercel project (Production and Preview):

| Variable | Notes |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string. Allow Vercel's IPs, or `0.0.0.0/0` with a strong password. |
| `JWT_SECRET` | Required. The API refuses to start in production without it. |
| `ADMIN_EMAIL` | Notification recipient, and the account created by `npm run seed`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Email. Gmail needs an App Password. |
| `EMAIL_FROM` | Sender shown on outgoing mail. |
| `MOMO_ACCOUNT_NAME`, `MOMO_ACCOUNT_NUMBER`, `MOMO_NETWORK` | Shown to clients as payment instructions. |
| `CORS_ORIGINS` | Only needed if the API is called from another origin. |
| `BLOB_READ_WRITE_TOKEN` | Required for file uploads. See below. |

### File uploads
Serverless functions have no persistent disk — anything written there vanishes
when the request ends. Create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN`;
the upload middleware then stores files in Blob instead of on disk. Without the
token uploads fall back to local disk, which is correct for a normal server but
silently loses files on Vercel.

### Alternative: a separate API host
The API still runs as an ordinary Node process (`cd server && npm start`) on
Render, Railway, Fly or a VPS. In that case set `REACT_APP_API_URL` on the
frontend to that host's URL, and add the site's domain to `CORS_ORIGINS`.

## Payment Integration

The website uses MTN Mobile Money (MoMo) for payments in Ghana.

Payment is currently **manual**: the client is shown transfer instructions, sends
the money, and reports the transaction ID. An admin verifies it against the MoMo
account before the request is treated as paid.

Account details are read from `MOMO_ACCOUNT_NAME`, `MOMO_ACCOUNT_NUMBER` and
`MOMO_NETWORK` so the payee can be changed without a code deploy.

## Support

For questions or support, contact:
- Email: info@icbb.org
- Phone: +233 55 975 9592

## License

Copyright © 2024 ICBB. All rights reserved.
