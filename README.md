# ReWear - Sustainable Fashion Exchange Platform

## 🌱 Overview

ReWear is a web-based platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

## 🚀 Features

### User Authentication
- Email/password signup and login
- JWT token-based authentication
- User profile management

### Landing Page
- Platform introduction with sustainable messaging
- Calls-to-action: "Start Swapping", "Browse Items", "List an Item"
- Featured items carousel
- Impact statistics

### User Dashboard
- Profile details and points balance
- Uploaded items overview
- Ongoing and completed swaps list
- User statistics

### Item Management
- Upload images with drag-and-drop
- Enter title, description, category, type, size, condition, and tags
- Submit items for listing
- Item status tracking

### Item Detail Page
- Image gallery and full item description
- Uploader information
- Options: "Swap Request" or "Redeem via Points"
- Item availability status

### Swap System
- Direct clothing swaps between users
- Point-based redemption system
- Swap request management
- Status tracking (pending, accepted, completed)

### Admin Role
- Moderate and approve/reject item listings
- Remove inappropriate or spam items
- Lightweight admin panel for oversight
- Platform statistics and analytics

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **multer** for file uploads
- **express-validator** for input validation
- **helmet** for security headers

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Icons** for icons
- **Axios** for API calls
- **React Hot Toast** for notifications

## 📁 Project Structure

```
Odoo-Hackathon/
├── server/
│   ├── index.js              # Main server file
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── items.js          # Item management routes
│   │   ├── swaps.js          # Swap system routes
│   │   └── admin.js          # Admin panel routes
│   └── uploads/              # Image upload directory
├── client/
│   ├── public/
│   │   └── index.html        # Main HTML file
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/            # Page components
│   │   ├── App.js            # Main app component
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   └── postcss.config.js     # PostCSS configuration
├── package.json              # Backend dependencies
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Odoo-Hackathon
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Create uploads directory**
   ```bash
   mkdir -p server/uploads
   ```

5. **Start the development servers**

   **Option 1: Run both servers simultaneously**
   ```bash
   npm run dev
   ```

   **Option 2: Run servers separately**
   ```bash
   # Terminal 1 - Backend server
   npm run server
   
   # Terminal 2 - Frontend server
   cd client && npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Default Admin Account
The system comes with a default admin account:
- Email: `admin@rewear.com`
- Password: `password`

## 📱 Usage

### For Users
1. **Register/Login**: Create an account or sign in
2. **Browse Items**: Explore available clothing items
3. **List Items**: Upload your unused clothing
4. **Swap or Redeem**: Request swaps or use points to redeem items
5. **Manage Profile**: Update your information and view your activity

### For Admins
1. **Login**: Use admin credentials
2. **Moderate Items**: Approve or reject new listings
3. **Manage Users**: View user statistics and manage accounts
4. **Monitor Platform**: View analytics and recent activity

## 🎨 Design System

### Color Palette
- **Primary Green**: `#22c55e` - Represents sustainability and growth
- **Secondary Gray**: `#64748b` - Neutral tones for content
- **Accent Yellow**: `#eab308` - Highlights and calls-to-action

### Typography
- **Font Family**: Inter - Clean, modern, and highly readable
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons**: Primary, secondary, and accent variants
- **Cards**: Clean, elevated design with hover effects
- **Forms**: Consistent input styling with validation states
- **Badges**: Status indicators with color coding

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Security headers with helmet
- File upload restrictions

## 🧪 Testing

### Backend Testing
```bash
# Run server tests (when implemented)
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure environment variables
3. Build the frontend: `cd client && npm run build`
4. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

**CodeX Team**
- Email: 24ic02it002.ppsu.ac.in
- Project: ReWear - Community Clothing Exchange
- Hackathon: Odoo Hackathon

## 🌟 Future Enhancements

- Real-time chat for swap negotiations
- Advanced search and filtering
- Mobile app development
- Integration with shipping services
- Blockchain-based point system
- AI-powered item recommendations
- Social features and user reviews

---

**Made with ❤️ for a sustainable future**
