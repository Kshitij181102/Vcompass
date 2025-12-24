# V-Compass 🧭

A modern web application for university students to connect with mentors, stay updated with campus news and events, and get instant answers through an AI-powered chatbot.

## 🎯 What is V-Compass?

V-Compass is an online mentorship and campus information platform designed to help university students:

- **Connect with Mentors** - Book 1-on-1 or group sessions with experienced student mentors
- **Stay Informed** - Access the latest campus news, events, and announcements
- **Get Quick Answers** - Use the AI chatbot for instant university-related FAQs
- **Manage Your Profile** - Track your academic information and bookings

## ✨ Features

### 🎓 Mentor Connect
- Browse available mentors with their specializations and availability
- Book mentorship sessions with flexible time slots
- View mentor profiles with detailed information (program, department, expertise)
- Manage your bookings (book/cancel sessions)
- Group session support with multiple participants

### 🤖 Mentor–Mentee Automation System
An automated scheduling and communication system that connects to MongoDB and creates temporary Discord channels at the exact scheduled time.

**Key Capabilities:**
- Continuously monitors MongoDB for upcoming bookings
- Creates temporary Discord chat rooms at session time
- Handles multiple mentees per mentor with dynamic permissions
- Automatically deletes session rooms after one hour
- Efficient background scheduler with async event handling

**Technical Challenges Solved:**
- Managing overlapping sessions and preventing race conditions
- Ensuring the scheduler reliably triggers without missing events
- Synchronizing dynamic channel permissions for mentor-mentee groups
- Optimized database queries for stable, real-time monitoring

### 📰 Campus Updates
- Latest university news and announcements
- Upcoming events and posters
- Filter by categories: Academic, Cultural, Sports, Placement, Workshop
- Detailed view with registration links for events

### 🤖 AI Chatbot
- Floating chatbot widget available throughout the app
- Instant answers to university FAQs
- Powered by V-Compass Assistant

### 👤 User Profile
- Personal information management
- Academic details (Student ID, Program, Department, Year)
- Discord integration for mentor communication
- Secure password management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
REACT_APP_CHATBOT_URL=https://vcompass-chatbot.vercel.app
```

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication & main pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Main.jsx          # Landing page
│   │   ├── MainPage.jsx      # Campus updates dashboard
│   │   ├── MentorConnect.jsx # Mentor booking system
│   │   ├── Profile.jsx       # User profile management
│   │   └── ...
│   ├── ui/             # Reusable UI components
│   ├── ChatbotWidget.jsx
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
├── utils/
│   └── apis.js         # API endpoint configurations
├── Assets/             # Images and static assets
├── App.jsx             # Main routing configuration
└── index.jsx           # Application entry point
```

## 🔐 Authentication Flow

1. **Register** - Create account with name, email, password, and Discord ID
2. **Login** - Access your account with email and password
3. **Forgot Password** - Reset via OTP verification
4. **Protected Routes** - Main features require authentication

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6
- **Styling**: Tailwind CSS, styled-components, Bootstrap
- **UI Components**: Lucide React, React Icons, React Feather
- **Notifications**: React Hot Toast, React Toastify
- **Carousel**: React Slick, Swiper

## 📱 Pages Overview

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page with app introduction | No |
| `/login` | User login | No |
| `/register` | New user registration | No |
| `/forget/password` | Password recovery | No |
| `/main` | Campus news & events dashboard | Yes |
| `/mentor/connect` | Browse and book mentors | Yes |
| `/profile` | User profile settings | Yes |

## 🔗 API Integration

The app connects to a backend API hosted at:
```
https://vcompass-backend-wahj.vercel.app/
```

Key endpoints:
- User authentication (register, login, password reset)
- Mentor listing and booking management
- News and events fetching
- Profile management

## 🎨 Design

- Modern gradient-based UI with warm amber/orange color scheme
- Responsive design for mobile and desktop
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Clean and intuitive user interface

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for university students
