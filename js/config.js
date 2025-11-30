/**
 * Global Configuration File
 * Contains API URLs, constants, and shared settings
 */

// API Configuration
const API_CONFIG = {
    // Change this to your actual API server URL
    baseURL: 'http://localhost:3000/api', // or your production URL
    timeout: 10000, // API request timeout in ms
};

// WebSocket Configuration for Live Data
const WS_CONFIG = {
    huobi: 'wss://api.huobi.pro/ws', // Huobi real-time price feed
};

// App Constants
const APP_CONFIG = {
    cookieExpiry: 7, // Cookie expiry in days
    appName: 'BVOX Finance',
    version: '2.0',
};

// Supported Cryptocurrencies
const CRYPTOCURRENCIES = {
    BTC: { symbol: 'BTC', name: 'Bitcoin', pair: 'btcusdt' },
    ETH: { symbol: 'ETH', name: 'Ethereum', pair: 'ethusdt' },
    DOGE: { symbol: 'DOGE', name: 'Dogecoin', pair: 'dogeusdt' },
    BCH: { symbol: 'BCH', name: 'Bitcoin Cash', pair: 'bchusdt' },
    LTC: { symbol: 'LTC', name: 'Litecoin', pair: 'ltcusdt' },
    XRP: { symbol: 'XRP', name: 'Ripple', pair: 'xrpusdt' },
    TRX: { symbol: 'TRX', name: 'TRON', pair: 'trxusdt' },
    SOL: { symbol: 'SOL', name: 'Solana', pair: 'solusdt' },
    ADA: { symbol: 'ADA', name: 'Cardano', pair: 'adausdt' },
    BSV: { symbol: 'BSV', name: 'Bitcoin SV', pair: 'bsvusdt' },
    LINK: { symbol: 'LINK', name: 'Chainlink', pair: 'linkusdt' },
};

// API URL Helper Function
const apiurl = API_CONFIG.baseURL;

// Helper: Get cookie value
function getCookie(name) {
    if (typeof Cookies !== 'undefined') {
        return Cookies.get(name);
    }
    return null;
}

// Helper: Set cookie value
function setCookie(name, value, days = 7) {
    if (typeof Cookies !== 'undefined') {
        Cookies.set(name, value, { expires: days });
    }
}

// Helper: Remove cookie
function removeCookie(name) {
    if (typeof Cookies !== 'undefined') {
        Cookies.remove(name);
    }
}

// Helper: Get current user ID from cookie
function getCurrentUserId() {
    return getCookie('userid');
}

// Helper: Check if user is logged in
function isUserLoggedIn() {
    return getCookie('userid') != null;
}

// Helper: Logout user
function logoutUser() {
    removeCookie('userid');
    removeCookie('username');
    removeCookie('ytoken');
    window.location.href = '/';
}

// Language/Translation Helper (placeholder - expand as needed)
function gy(text) {
    // This is a placeholder for your translation/globalization function
    return text;
}
