# BVOX Finance - Project Setup Guide

## Project Overview
This is a crypto trading platform with features including:
- Mining
- Contract Trading
- AI Arbitrage
- Lending
- Real-time cryptocurrency price tracking
- User authentication and KYC
- Multi-language support

## Recommended Project Structure

```
boxf version 2/
├── index.html                 # Main homepage
├── pages/                      # Individual feature pages
│   ├── mining.html
│   ├── contract.html
│   ├── ai-arbitrage.html
│   ├── loan.html
│   ├── assets.html
│   └── ... other pages
├── css/                        # Stylesheets
│   ├── style.css              # Main styles
│   └── layer.css              # Additional styling
├── js/                         # JavaScript files
│   ├── config.js              # Configuration settings
│   ├── utils.js               # Utility functions
│   ├── jquery.js              # jQuery library
│   ├── pako.min.js            # Compression library
│   ├── js.cookie.min.js       # Cookie management
│   ├── web3.min.js            # Web3.js library
│   └── web3provider.js        # Web3 provider setup
├── assets/                     # Images and static files
│   ├── images/                # All image files
│   └── icons/                 # Icon files
├── server.js                   # Node.js development server
└── README.md                   # This file
```

## Quick Start

### Option 1: Using Node.js (Recommended)

1. **Install Node.js**
   - Download from https://nodejs.org/
   - Install the LTS version

2. **Start the development server**
   ```powershell
   cd "c:\Users\Black Coder\OneDrive\Desktop\crypto-nest\boxf version 2"
   node server.js
   ```

3. **Open in browser**
   - Navigate to `http://localhost:3000`

### Option 2: Using Python

**Python 3.x:**
```powershell
cd "c:\Users\Black Coder\OneDrive\Desktop\crypto-nest\boxf version 2"
python -m http.server 3000
```

**Python 2.x:**
```powershell
python -m SimpleHTTPServer 3000
```

Then open `http://localhost:3000` in your browser.

### Option 3: Using Live Server VS Code Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Environment Variables

Create a `.env` file in the project root:

```env
API_URL=http://localhost:3000/api
WS_URL=wss://api.huobi.pro/ws
NODE_ENV=development
```

## Configuration

The main configuration is in `js/config.js`. Update these values:

```javascript
const API_CONFIG = {
    baseURL: 'http://your-api-server.com/api',
    timeout: 10000,
};
```

## Supported Cryptocurrencies

The platform currently supports:
- BTC (Bitcoin)
- ETH (Ethereum)
- DOGE (Dogecoin)
- BCH (Bitcoin Cash)
- LTC (Litecoin)
- XRP (Ripple)
- TRX (TRON)
- SOL (Solana)
- ADA (Cardano)
- BSV (Bitcoin SV)
- LINK (Chainlink)

Real-time price data is fetched from Huobi API via WebSocket.

## Key Features

### 1. Real-time Price Updates
- WebSocket connection to Huobi
- Automatic reconnection on disconnect
- Live price and percentage change display

### 2. User Authentication
- Wallet address login
- Security code verification
- Cookie-based session management

### 3. Multi-page Application
- Mining operations
- Contract trading
- AI arbitrage strategies
- Loan management
- Asset management

## Dependencies

### External Libraries
- **jQuery** - DOM manipulation
- **Pako** - Compression/decompression
- **js.cookie** - Cookie management
- **Web3.js** - Blockchain interaction

### Required APIs
- Huobi WebSocket API - Price data
- Backend API - User management, transactions

## Common Issues & Solutions

### Issue: "Cannot GET /"
**Solution:** Make sure you're running the server from the correct directory and the index.html file exists.

### Issue: WebSocket connection fails
**Solution:** The app tries to connect to Huobi's WebSocket. Check if you have internet connection and if `wss://api.huobi.pro/ws` is accessible.

### Issue: API calls return 404
**Solution:** Update the `API_CONFIG.baseURL` in `js/config.js` to match your backend server URL.

### Issue: Images not loading
**Solution:** Ensure all images are in the `assets/images/` folder and paths are correctly updated in HTML files.

## File Organization

### Moving Existing Files

1. **CSS Files** → Move to `css/` folder
2. **Image Files** → Move to `assets/images/` folder
3. **JavaScript Libraries** → Move to `js/` folder
4. **HTML Pages** → Move to `pages/` folder (keep index.html in root)

### Update HTML References

Old reference:
```html
<link rel="stylesheet" href="./Bvox_files/style.css">
```

New reference:
```html
<link rel="stylesheet" href="./css/style.css">
```

## Development Tips

### Debugging
- Open Developer Tools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for failed requests

### Testing
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices (iOS, Android)
- Test API connectivity and error handling

## Deployment

### To Production

1. **Update API URLs**
   ```javascript
   // In js/config.js
   baseURL: 'https://your-production-api.com/api'
   ```

2. **Enable HTTPS**
   - All connections should use HTTPS in production
   - Update WebSocket URL if needed

3. **Optimize Assets**
   - Minify CSS and JavaScript
   - Compress images
   - Use CDN for static files

4. **Environment Variables**
   - Use environment-specific configurations
   - Never commit sensitive data

## Support & Maintenance

### Regular Maintenance
- Monitor WebSocket connection status
- Check API response times
- Update dependencies periodically
- Clear browser cache regularly during development

### Monitoring
- Log API errors to a service
- Monitor user sessions
- Track page load times
- Monitor WebSocket connection health

## Security Considerations

⚠️ **Important:**
- Never expose API keys in frontend code
- Use HTTPS for all API calls
- Validate all user inputs
- Implement proper CORS policies
- Use secure cookie settings (httpOnly, Secure, SameSite)
- Implement rate limiting on API
- Regular security audits

## Future Improvements

- [ ] Implement state management (Redux/Vuex)
- [ ] Add offline support (Service Workers)
- [ ] Implement caching strategies
- [ ] Add unit and integration tests
- [ ] Optimize performance metrics
- [ ] Implement analytics
- [ ] Add dark mode support
- [ ] Improve accessibility (WCAG compliance)

## License

[Add your license information here]

## Contact

For support or questions, please contact the development team.
# bvoxf-nodejs
