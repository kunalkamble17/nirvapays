# NirvaPay - NivraPay Micro Service Foundation

**Innovate • Empower • Grow**

A modern web-based microfinance banking application built with React, Tailwind CSS, and Vite. Serving the financial needs of India with pride.

## About Us

**NivraPay Micro Service Foundation**
- Address: Pole No G-24, Opposite Yamaha Service Center, Guest House Road, Tilak Ward, Warora 442907, Chandrapur, Maharashtra
- Contact: 8767765025, 9226017405
- Email: Nirvapaymicrofou@gmail.com

## Features

### Customer Portal
- Account dashboard with balance overview
- Loan application and tracking
- EMI calculator (Indian Rupee format)
- Payment history
- Profile management
- Available in Marathi and Hindi

### Admin Portal
- Customer management
- Loan approval workflow
- Disbursement tracking
- Repayment monitoring
- Reports and analytics
- Staff management with custom positions

## Tech Stack

- React 18
- React Router 6
- Tailwind CSS (Indian Theme - Saffron, Green, Gold)
- Lucide Icons
- Recharts (charts)
- Vite

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── layouts/            # Page layouts
├── pages/              # Page components
│   ├── public/         # Public pages (login, register, landing)
│   ├── customer/       # Customer portal
│   └── admin/          # Admin/Employee portal
├── data/               # Mock data
├── hooks/              # Custom React hooks
└── utils/              # Utility functions
```

## Demo Credentials

### Customer Login
- **Email**: customer@example.com
- **Password**: password

### Employee Login  
- **Email**: admin@example.com
- **Password**: password

---
## Auth Mode (Mock vs API)
This frontend is designed to run without your backend first.

By default it uses **Mock Auth** (no API calls). It stores the logged-in user in `localStorage`.

To enable real backend authentication later, set:
- `VITE_AUTH_MODE=api`
- `VITE_API_URL` (if your API runs on a different host/port)

© 2024 NivraPay Micro Service Foundation. All rights reserved.
Made with pride in Maharashtra, India 🇮🇳
