# NetSurf Custom - Call Management System

A simple, static HTML/CSS/JavaScript application for managing call operations with direct webhook integration.

## 🚀 Features

- Frontend-only authentication with @netsurfdirect.com domain validation
- Phone number input and validation
- Direct call initiation through external webhook
- Responsive UI with pure CSS
- No dependencies - everything runs in the browser

## 🛠️ Tech Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Deployment**: GitHub Pages
- **External Integration**: n8n webhook for call processing

## 🔧 Local Development Setup

1. **Simply open the file in your browser:**
   - Navigate to `frontend/index.html` in your file explorer
   - Right-click and select "Open with" your preferred browser

2. **Or use a local server (recommended):**
   ```bash
   # If you have Python installed
   cd frontend
   python -m http.server 8000
   
   # Or with Node.js (if you have http-server installed)
   cd frontend
   npx http-server
   ```

That's it! No build process or dependencies required - everything runs directly in the browser.

## 🚀 Production Deployment

### GitHub Pages Deployment

Simply push to the main branch and GitHub Actions will automatically deploy your site to:
`https://invortoai.github.io/netsurf-custom`

## 🔌 External Integration

### Webhook Integration
- **Webhook URL**: `https://n8n.srv743759.hstgr.cloud/webhook/netsurf`
- **Purpose**: Processes call initiation requests
- **Payload**: `{ number: "1234567890", call_attempted: "No", PCAP: "netsurf" }`

## 📁 Project Structure

```
netsurf-custom/
├── frontend/
│   └── index.html    # Complete application in a single file
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment
└── README.md
```

## 🎯 How It Works

1. **User Authentication**: Frontend validates @netsurfdirect.com email domain and password
2. **Call Initiation**: User enters phone number, frontend validates and sends directly to webhook
3. **External Processing**: n8n webhook processes the call request
4. **No Database**: All state is managed in browser localStorage

## 📞 Support

For issues or questions, please check the project documentation or create an issue in the repository.
