# Citizen Resolution System - Frontend

A React-based frontend for the Citizen Complaint Resolution System, designed to provide citizens and administrators with an intuitive interface for managing community complaints.

## Features

### 🏠 **Home Page**
- Welcome message and feature overview
- Role-based navigation options
- Call-to-action for new users

### 🔐 **Authentication**
- **Login Page**: Email/password authentication with JWT storage
- **Register Page**: New user registration (default role: Citizen)
- Automatic role-based redirects after authentication

### 👤 **Citizen Features**
- **Submit Complaints**: Form with title, description, category, and location
- **My Complaints**: View and filter personal complaints by status
- Real-time status tracking (Open → In Progress → Resolved)

### ⚙️ **Admin Features**
- **Admin Dashboard**: Comprehensive view of all complaints
- **Status Management**: Update complaint statuses
- **Search & Filter**: Find complaints by various criteria
- **Statistics**: Overview of complaint counts by status

### 🧭 **Navigation**
- Responsive navbar with role-based menu items
- Protected routes for authenticated users
- Admin-only access to administrative features

## Technology Stack

- **React 19** with modern hooks (useState, useEffect)
- **React Router** for client-side routing
- **CSS3** with custom styling (no external UI frameworks)
- **Fetch API** for HTTP requests
- **JWT** for authentication
- **LocalStorage** for session management

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation component
│   │   ├── ComplaintForm.jsx   # Complaint submission form
│   │   ├── MyComplaints.jsx    # Citizen complaint viewer
│   │   ├── AdminDashboard.jsx  # Admin management interface
│   │   └── *.css               # Component-specific styles
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Authentication page
│   │   ├── Register.jsx        # User registration
│   │   └── *.css               # Page-specific styles
│   ├── services/
│   │   └── api.js              # API helper functions
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # Global styles
│   └── main.jsx                # App entry point
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## API Integration

The frontend is designed to work with the Citizen Resolution System backend API:

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT tokens in Authorization headers
- **Endpoints**: 
  - `/auth/login` - User authentication
  - `/auth/register` - User registration
  - `/complaints` - Complaint management
  - `/complaints/my-complaints` - User's complaints
  - `/complaints/:id/status` - Status updates (admin only)

## Key Features

### 🔒 **Route Protection**
- Unauthenticated users redirected to login
- Role-based access control for admin features
- Automatic JWT validation

### 📱 **Responsive Design**
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface elements

### 🎨 **Modern UI/UX**
- Clean, professional design
- Smooth animations and transitions
- Consistent color scheme and typography
- Loading states and error handling

### 📊 **Data Management**
- Real-time status updates
- Efficient state management with React hooks
- Optimistic UI updates for better user experience

## Customization

### Styling
- All styles use custom CSS (no external frameworks)
- CSS variables for consistent theming
- Responsive breakpoints for mobile/tablet/desktop

### Components
- Modular component architecture
- Reusable UI components
- Easy to extend and modify

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and structure
2. Ensure all new features include proper error handling
3. Test on multiple devices and screen sizes
4. Update documentation for any new features

## License

This project is part of the Citizen Resolution System.
