# NetSurf Custom - Call Management System

A frontend-only web application for managing call operations with React and direct webhook integration.

## 🚀 Features

- Frontend-only authentication with @netsurfdirect.com domain validation
- Phone number input and validation
- Direct call initiation through external webhook
- Responsive UI with Tailwind CSS
- No backend required - everything runs in the browser

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Axios
- **Deployment**: GitHub Pages
- **External Integration**: n8n webhook for call processing

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🔧 Local Development Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```
   Frontend will run on `http://localhost:3000`

That's it! No backend setup required - everything runs in the browser.

## 🚀 Production Deployment

### GitHub Pages Deployment

1. **The homepage is already configured for your GitHub account:**
   ```json
   "homepage": "https://invortoai.github.io/netsurf-custom"
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   cd frontend
   npm run deploy
   # or
   yarn deploy
   ```

3. **Or use GitHub Actions (Automatic):**
   Simply push to the main branch and GitHub Actions will automatically build and deploy your site.

## 🔐 Authentication

- **Email Domain**: Only `@netsurfdirect.com` emails are allowed
- **Password**: `Invorto2025` (for demo purposes)

## 🔌 External Integration

### Webhook Integration
- **Webhook URL**: `https://n8n.srv743759.hstgr.cloud/webhook/netsurf`
- **Purpose**: Processes call initiation requests
- **Payload**: `{ number: "1234567890", call_attempted: "No", PCAP: "netsurf" }`

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
# or
yarn test
```

## 📁 Project Structure

```
netsurf-custom/
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React app with authentication & call logic
│   │   ├── index.css     # Global styles with Tailwind
│   │   └── components/   # UI components (shadcn/ui)
│   ├── public/
│   │   └── index.html    # HTML template
│   ├── package.json      # Frontend dependencies
│   ├── craco.config.js   # CRACO configuration for Tailwind
│   ├── .env.development  # Development environment
│   └── .env.production   # Production environment
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Frontend:**
- `REACT_APP_NODE_ENV`: Environment (development/production)
- `GENERATE_SOURCEMAP`: Whether to generate source maps

## 🚀 CI/CD

The project includes GitHub Actions workflow for automatic deployment:
- Triggers on push to main branch
- Builds and deploys frontend to GitHub Pages
- No backend deployment needed - everything runs client-side

## 🎯 How It Works

1. **User Authentication**: Frontend validates @netsurfdirect.com email domain and password
2. **Call Initiation**: User enters phone number, frontend validates and sends directly to webhook
3. **External Processing**: n8n webhook processes the call request
4. **No Database**: All state is managed in browser localStorage

## 📞 Support

For issues or questions, please check the project documentation or create an issue in the repository.
