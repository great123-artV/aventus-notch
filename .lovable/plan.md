

# Aventus-Notch — Investment Platform

## Design System
- **Dark mode** with deep blue/black base (`#0A0E1A`, `#111827`)
- **Neon accents**: electric blue (`#3B82F6`), green for profit (`#10B981`), red for loss (`#EF4444`)
- **Glassmorphism** cards with `backdrop-blur`, soft borders, subtle gradients
- **Typography**: Clean sans-serif hierarchy, large bold headings, muted secondary text
- **Spacing**: Generous padding, breathing room between sections

## Pages

### 1. Landing Page
- Hero: "Invest Smarter. Grow Without Limits." with animated gradient background
- Two CTAs: "Get Started" (primary neon) and "Explore Markets" (glass outline)
- Trust bar: Security badges, regulated, 500K+ users, global access
- 5 investment category cards (Stocks, Crypto, Forex, Real Estate, Retirement) with icons
- Stats section (AUM, users, countries)
- Clean footer with navigation links

### 2. Dashboard (`/dashboard`)
- Top bar with user avatar, notifications bell, search
- Large portfolio balance card with profit/loss percentage
- Portfolio distribution donut chart (stocks, crypto, forex, real estate, retirement)
- Profit/Loss line chart using Recharts (interactive with tooltips)
- Quick action buttons: Invest, Withdraw, Transfer
- Recent transactions list
- AI Assistant panel (sidebar suggestion widget)

### 3. Markets Page (`/markets`)
- Tab filters: All, Stocks, Crypto, Forex
- Search bar with filters
- Asset list table: name, price, 24h change %, mini sparkline chart
- Live data from CoinGecko (crypto) + mock data for stocks/forex
- Color-coded gains (green) and losses (red)

### 4. Asset Detail Page (`/asset/:id`)
- Large price chart (Recharts area chart with time range selectors: 1D, 1W, 1M, 1Y)
- Buy/Sell action buttons
- Stats grid: Market Cap, Volume, High/Low, P/E ratio
- Market insights panel with AI-generated tips (mock)

### 5. Real Estate Page (`/real-estate`)
- Property cards with placeholder images, location, ROI %
- "Invest from $50,000" badge
- Investment progress bars (funding status)
- Filter by location/ROI

### 6. Retirement Planner (`/retirement`)
- Interactive calculator: monthly contribution slider, years slider, expected return slider
- Real-time projected future value display
- Visual projection chart (area chart showing growth over time)
- Suggested retirement plans cards

### 7. Authentication (`/login`, `/signup`)
- Clean centered auth forms with glassmorphism card
- Email + password fields
- Social login buttons (Google, Apple — visual only)
- Trust indicators: "256-bit encryption", "Regulated platform"
- Smooth transition between login/signup

## Advanced Features
- **AI Investment Assistant**: Floating panel on dashboard suggesting portfolio allocation
- **Notifications panel**: Dropdown from bell icon with recent alerts
- **Responsive design**: Mobile-optimized with hamburger nav, stacked layouts

## Data Integration
- CoinGecko free API for live crypto prices (no key needed)
- Mock data for stocks, forex, real estate with realistic values
- All charts powered by Recharts

## Navigation
- Persistent sidebar on desktop (collapsible), bottom nav on mobile
- Routes: `/`, `/dashboard`, `/markets`, `/asset/:id`, `/real-estate`, `/retirement`, `/login`, `/signup`

