# 🏛️ Citizen Complaint Resolution System

A comprehensive web application for managing citizen complaints and grievances with role-based access control, file uploads, and real-time status tracking.

🔗 **Live Demo**: [CitiSolve - Smarter Complaint Resolution](https://citisolve-smarter-complaint-resolution.onrender.com)

<img width="1154" height="596" alt="complaints-process-explained-EN" src="https://github.com/user-attachments/assets/714aca66-b93b-4055-b56c-f440d51d4034" />

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration**: Citizens and Admins can create accounts
- **Role-based Access**: Different permissions for Citizens vs Admins
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Persistent login with localStorage

### 👥 Citizen Features
- **Submit Complaints**: Form with fields for name, ward, location, category, description, and photo upload
- **Track Complaints**: View all submitted complaints with real-time status updates
- **Photo Evidence**: Upload images (JPG, PNG, GIF) up to 5MB
- **Complaint History**: Complete audit trail with timestamps

### 👨‍💼 Admin Features
- **Dashboard Overview**: Statistics and metrics for all complaints
- **Complaint Management**: View, filter, and search all complaints
- **Status Updates**: Change complaint status (Open → In Progress → Resolved)
- **Resolution Notes**: Add detailed notes when resolving complaints
- **Advanced Filtering**: Filter by status, category, and search terms

### 🎯 Complaint Categories
- Roads & Infrastructure
- Water Supply
- Sanitation & Waste
- Street Lighting
- Public Safety
- Environmental Issues
- Noise Pollution
- Other

### 📱 Responsive Design
- Mobile-first approach
- Full-screen layout
- Touch-friendly interface
- Cross-browser compatibility

## 🚀 Technology Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **CSS3** - Custom styling (no external UI frameworks)
- **Local Storage** - Client-side data persistence

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Token authentication
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing
- **nanoid** - Unique ID generation

## 📁 Project Structure

```
citizen-resolution/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth & validation
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API endpoints
│   │   ├── config/          # Database connection
│   │   └── server.js        # Main server file
│   ├── uploads/             # File upload directory
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd citizen-resolution/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your MongoDB connection string and JWT secret:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES=7d
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Complaints
- `POST /api/complaints` - Create new complaint (Citizens only)
- `GET /api/complaints` - Get complaints (filtered by role)
- `PATCH /api/complaints/:id/status` - Update complaint status (Admins only)

## 🎨 Key Features Implementation

### File Upload System
- **Multer middleware** for handling multipart/form-data
- **File validation** (image types only, 5MB limit)
- **Secure file naming** with unique identifiers
- **Static file serving** for uploaded images

### Role-based Access Control
- **JWT tokens** with embedded role information
- **Middleware protection** for sensitive routes
- **Conditional UI rendering** based on user role
- **Route protection** with automatic redirects

### Real-time Status Updates
- **Optimistic updates** for immediate UI feedback
- **Form validation** with client-side error handling
- **Loading states** and error messages
- **Auto-refresh** with useEffect hooks

## 🔒 Security Features

- **Password hashing** with bcryptjs
- **JWT token expiration** (configurable)
- **Input validation** and sanitization
- **File type restrictions** for uploads
- **Role-based route protection**
- **CORS configuration** for cross-origin requests

## 📱 Responsive Design

- **Mobile-first** CSS approach
- **Flexbox and Grid** layouts
- **Media queries** for different screen sizes
- **Touch-friendly** interface elements
- **Full-screen** layout utilization

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables
4. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- **Real-time notifications** with WebSockets
- **Email notifications** for status updates
- **Advanced analytics** and reporting
- **Mobile app** development
- **Multi-language support**
- **API rate limiting**
- **Advanced search** with Elasticsearch
- **Dashboard charts** and visualizations


📌 Note: This project was developed as part of my internship project to demonstrate full-stack development, role-based access, and complaint resolution workflow.




