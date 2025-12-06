# Blazin' Paddles 🏓

A modern, mobile-responsive web application for booking pickleball courts, joining classes, and signing up for open play sessions.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Features

- **Court Reservations**: Book your preferred court time with an intuitive calendar interface
- **Class Bookings**: Join expert-led classes for all skill levels
- **Open Play**: Sign up for community play sessions
- **Credit System**: Simple credit-based booking (3 credits/court, 1 credit/class)
- **User Dashboard**: View all your upcoming and past sessions
- **Mobile Responsive**: Fully optimized for all device sizes
- **Modern UI**: Minimalist design with bold typography and high contrast

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ocs-blazingpaddles
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Demo Login

Use these credentials to test the application:

- **Email**: `member@blazinpaddles.com`
- **Password**: `password`

Demo account includes 15 credits and sample bookings.

## 📱 Pages

### Landing Page (`/`)
- Welcome message and facility overview
- How it works section
- Features showcase
- Call-to-action for member login

### Login (`/login`)
- Simple authentication form
- Demo credentials displayed
- Redirects to member dashboard on success

### Member Dashboard (`/member`)
- Interactive calendar for date selection
- Booking type selector (Court/Class/Open Play)
- Time slot availability grid (7 AM - 8 PM)
- Real-time credit tracking
- Instant booking confirmation

### My Sessions (`/my-sessions`)
- View all upcoming reservations
- Historical booking records
- Booking details (date, time, credits, court/class)
- Quick actions (book more, print schedule)

## 🎨 Design System

### Visual Identity
- **Style**: Minimalist, playful, modern flat design with retro halftones
- **Colors**: Black (#000), White (#FFF), Yellow accent (#FBBF24)
- **Typography**: Bold sans-serif (Geist), uppercase headings
- **Layout**: Clean grids, generous negative space, high contrast borders

### Accessibility
- WCAG compliant contrast ratios
- Keyboard navigation support
- Focus visible states
- Semantic HTML
- Screen reader friendly

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Persistence**: LocalStorage (demo) → Ready for Supabase

## 📂 Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── Calendar.tsx
│   ├── Footer.tsx
│   └── Navbar.tsx
├── context/            # State management
│   └── AuthContext.tsx
├── types/              # TypeScript definitions
│   └── index.ts
├── utils/              # Utilities and mock data
│   └── mockData.ts
├── login/              # Login page
├── member/             # Member booking page
├── my-sessions/        # User sessions page
└── page.tsx           # Landing page
```

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🎯 Business Rules

### Operating Hours
- **Daily**: 7:00 AM - 8:00 PM
- 13 hourly time slots available

### Credit Costs
- Court Reservation: **3 credits** per hour
- Class Booking: **1 credit** per class
- Open Play: **1 credit** per session

### Booking Rules
- Past dates are disabled
- One booking per time slot
- Instant credit deduction
- Real-time availability updates

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository to [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js and configures settings
4. Your app is live!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🔮 Future Enhancements

### Phase 1: Backend Integration
- [ ] Supabase authentication
- [ ] Database schema implementation
- [ ] Real-time availability updates
- [ ] API endpoints for bookings

### Phase 2: Additional Features
- [ ] Payment integration for credit purchases
- [ ] User profile management
- [ ] Booking cancellation/modification
- [ ] Email confirmations
- [ ] Admin dashboard
- [ ] Waitlist functionality
- [ ] Membership tiers

## 📖 Documentation

For detailed documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Blazin' Paddles.

## 📞 Support

For questions or support, please contact:
- Email: info@blazinpaddles.com
- Phone: (555) 123-4567

---

Built with ❤️ using Next.js and Tailwind CSS
