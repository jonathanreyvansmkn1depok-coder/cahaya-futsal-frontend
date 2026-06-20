# Cahaya Futsal - Frontend

Frontend website booking futsal Cahaya Futsal menggunakan Next.js dan React.

## Requirements

- Node.js 16+
- npm atau yarn

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
# atau
yarn install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```

Edit file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
# atau
yarn dev
```

Server akan berjalan di `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── pages/              # Next.js pages
│   ├── index.js       # Homepage
│   ├── contact.js     # Contact page
│   ├── auth/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── forgot-password.js
│   ├── user/
│   │   ├── dashboard.js
│   │   ├── bookings.js
│   │   └── profile.js
│   ├── admin/
│   │   ├── dashboard.js
│   │   ├── courts.js
│   │   ├── bookings.js
│   │   ├── users.js
│   │   └── messages.js
│   ├── booking/
│   │   └── [id].js
│   ├── _app.js
│   └── _document.js
├── components/        # React components
│   ├── Layout.js
│   ├── Navbar/
│   ├── Admin/
│   └── User/
├── lib/              # Utilities
│   └── api.js       # API client
├── store/           # Zustand store
│   └── index.js
├── styles/          # Global styles
│   └── globals.css
├── public/          # Static files
│   └── images/
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Key Features

### Authentication
- Login/Register
- Forgot Password
- JWT Token Management
- Role-based Access (Admin/User)

### User Features
- Browse Courts
- Book Courts
- View Bookings
- Cancel Bookings
- Review Courts
- View Profile

### Admin Features
- Dashboard with Statistics
- Court Management (CRUD)
- Booking Management
- User Management
- Contact Message Management

### Public Features
- Homepage with Court Listing
- Contact Form with Google Maps
- Operating Hours Information
- Location Information

## Styling

Project menggunakan **Tailwind CSS** untuk styling. Konfigurasi ada di `tailwind.config.js`.

### Color Scheme
```
Primary: #1B8045 (Green)
Secondary: #F5A623 (Orange)
Accent: #FFE5B4 (Light Orange)
Dark: #1a1a1a
Light: #f8f9fa
```

## API Integration

API client sudah dikonfigurasi di `lib/api.js` dengan:
- Automatic token inclusion
- Error handling
- Auto redirect on 401

## State Management

Menggunakan **Zustand** untuk state management:
- `useAuthStore` - Authentication state
- `useBookingStore` - Booking state
- `useCourtsStore` - Courts data

## Components

### Layout Component
Wrapper untuk semua pages dengan Navbar dan Footer.

### Navbar Component
Navigation bar dengan:
- Logo
- Menu links
- User menu
- Mobile responsive

### Form Components
- Login form
- Register form
- Forgot password form
- Booking form
- Contact form

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token disimpan di localStorage
4. Token included dalam setiap API request
5. Automatic logout jika token expired

## Deployment

### Vercel Deployment (Recommended)

1. Push code ke GitHub
2. Connect repo ke Vercel
3. Set environment variables
4. Deploy

### Manual Deployment

```bash
# Build
npm run build

# Start server
npm start
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=         # Backend API URL
NEXT_PUBLIC_MAPS_API_KEY=    # Google Maps API key
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

1. Image optimization dengan Next.js Image
2. Code splitting otomatis
3. CSS purging dengan Tailwind
4. API caching strategy

## Troubleshooting

### CORS Error
Pastikan backend sudah configure CORS dengan frontend URL.

### API Not Responding
Cek apakah backend server sudah running di `http://localhost:8000`

### Token Expired
Token akan auto refresh menggunakan `/api/auth/refresh`

## Support

Untuk bantuan, hubungi: info@cahayafutsal.com
