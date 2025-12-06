# Blazin' Paddles - Application Documentation

## Overview
A Next.js application for booking pickleball courts, joining classes, and signing up for open play at Blazin' Paddles facility.

## Tech Stack
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Client-side authentication (mock implementation ready for Supabase)

## Features Implemented

### 1. Landing Page (`/`)
- **Hero Section**: Bold yellow background with welcoming message
- **How It Works**: Three-step process explanation
- **What We Offer**: Overview of courts, classes, and open play
- **CTA Section**: Call to action for member login
- **Auto-redirect**: Authenticated users are redirected to member page

### 2. Login Page (`/login`)
- Clean login form with email and password fields
- Demo credentials displayed for easy testing
- Form validation
- Error handling for invalid credentials
- Redirects to member page on successful login

**Demo Credentials:**
- Email: `member@blazinpaddles.com`
- Password: `password`

### 3. Member/Booking Page (`/member`)
- **Protected Route**: Requires authentication
- **Interactive Calendar**: Select dates for bookings
- **Booking Type Selector**: Choose between Court (3 credits), Class (1 credit), or Open Play (1 credit)
- **Court Selection**: Choose from 4 available courts
- **Class Selection**: Dropdown with available classes
- **Time Slot Picker**: Visual grid showing available/unavailable time slots
- **Credit Display**: Shows remaining credits in navbar
- **Real-time Updates**: Time slots regenerate when date changes
- **Success Notifications**: Confirmation message after booking

### 4. My Sessions Page (`/my-sessions`)
- **Protected Route**: Requires authentication
- **Upcoming Sessions**: Display future bookings with visual cards
- **Past Sessions**: Shows historical bookings (grayed out)
- **Empty State**: Helpful message when no bookings exist
- **Booking Details**: Date, time, credit cost, court/class name
- **Action Buttons**: Book another session or print schedule

### 5. Shared Components

#### Navbar
- Responsive design
- Dynamic content based on authentication state
- Credit counter for authenticated users
- Navigation links: "Reserve A Court" and "My Sessions"
- Logout functionality

#### Footer
- Business hours display
- Contact information
- Copyright notice
- Clean three-column layout

#### Calendar
- Month navigation (previous/next)
- Visual indicators for today, selected date, and past dates
- Disabled past dates
- Accessible controls
- Legend for date states

## Design System

### Visual Aesthetic
- **Minimalist & Bold**: Clean lines, strong typography
- **Flat Design**: Modern flat aesthetic with sharp borders
- **High Contrast**: Black borders on white backgrounds
- **Yellow Accents**: Yellow-400 for highlights and CTAs
- **Shadow Effects**: Neo-brutalism shadow effects on hover

### Typography
- **Font**: Geist Sans (Google Font)
- **Weights**: 400, 500, 600, 700, 800
- **Style**: Bold, uppercase headers with tight tracking
- **Hierarchy**: Clear size differentiation

### Colors
- **Primary Background**: White (#FFFFFF)
- **Text**: Black (#000000)
- **Accent**: Yellow-400 (#FBBF24)
- **Borders**: Black (#000000) with 2-4px thickness
- **Gray Tones**: For disabled states and secondary content

### Components
- **Buttons**: Bold borders, uppercase text, high contrast
- **Cards**: Thick black borders with optional shadow effects
- **Inputs**: 2px black borders, yellow focus rings
- **Layout**: Generous negative space, clean grids

## Authentication System

### Current Implementation
- Client-side mock authentication using React Context
- LocalStorage for session persistence
- Protected routes with automatic redirects

### Mock Data
- 1 demo user with 15 credits
- 2 sample bookings
- Dynamic time slot generation (7 AM - 8 PM)
- 4 available classes

### Ready for Supabase
The authentication context (`AuthContext.tsx`) is structured to easily integrate with Supabase:
- User management
- Booking CRUD operations
- Credit system
- Session handling

## Business Rules

### Operating Hours
- **Daily**: 7:00 AM - 8:00 PM
- 13 available time slots per day

### Credit System
- **Court Reservation**: 3 credits per hour
- **Class Booking**: 1 credit per class
- **Open Play**: 1 credit per session
- Credits can be purchased (UI ready, backend TBD)

### Booking System
- Past dates are disabled
- Time slots show availability
- Real-time credit deduction
- Instant booking confirmation

## File Structure

```
app/
├── components/
│   ├── Calendar.tsx       # Interactive calendar component
│   ├── Footer.tsx         # Shared footer
│   └── Navbar.tsx         # Shared navigation
├── context/
│   └── AuthContext.tsx    # Authentication state management
├── types/
│   └── index.ts           # TypeScript type definitions
├── utils/
│   └── mockData.ts        # Mock data and utilities
├── login/
│   └── page.tsx           # Login page
├── member/
│   └── page.tsx           # Member booking page
├── my-sessions/
│   └── page.tsx           # User sessions page
├── globals.css            # Global styles and theme
├── layout.tsx             # Root layout with AuthProvider
└── page.tsx               # Landing page
```

## Running the Application

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Access at: `http://localhost:3000` (or next available port)

### Build for Production
```bash
npm run build
npm start
```

## Mobile Responsiveness
All pages are fully responsive with breakpoints for:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Accessibility Features
- WCAG compliant contrast ratios
- Semantic HTML structure
- Keyboard navigation support
- Focus visible states (yellow outlines)
- Screen reader friendly
- Proper ARIA labels
- Alt text for images

## Future Enhancements (Ready for Implementation)

### Backend Integration
1. **Supabase Authentication**
   - Replace mock auth with Supabase Auth
   - Email/password and social login
   - Password reset functionality

2. **Database Schema**
   - Users table with credits
   - Bookings table
   - Courts/Classes tables
   - Transactions/Credits table

3. **Real-time Features**
   - Live availability updates
   - Booking notifications
   - Calendar sync

### Additional Features
- Payment integration for credit purchases
- User profile management
- Booking cancellation/modification
- Email confirmations
- Admin dashboard
- Waitlist functionality
- Membership tiers

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing Checklist
✅ Landing page loads with hero section
✅ Navigation between pages works
✅ Login form validation
✅ Authentication redirects
✅ Protected routes work correctly
✅ Calendar date selection
✅ Booking type switching
✅ Time slot selection
✅ Booking creation and credit deduction
✅ My Sessions displays bookings
✅ Logout functionality
✅ Mobile responsive design
✅ No linting errors

## Notes
- LocalStorage is used for demo purposes
- All mock data can be replaced with API calls
- The design system is consistent across all pages
- Code is well-commented and organized
- TypeScript provides type safety throughout

