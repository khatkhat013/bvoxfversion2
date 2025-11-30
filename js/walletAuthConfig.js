/**
 * Configuration file for Wallet Authentication System
 * Update these values according to your environment
 */

// ==================== API CONFIGURATION ====================

// Backend API URL (update this for your environment)
const WALLET_AUTH_CONFIG = {
    // API endpoint
    apiUrl: typeof apiurl !== 'undefined' ? apiurl : 'http://localhost:5000',
    
    // Wallet Connect Project ID (optional, for WalletConnect)
    walletConnectProjectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',
    
    // Supported wallet types
    supportedWallets: ['metamask', 'walletconnect', 'coinbase'],
    
    // User ID storage settings
    storage: {
        // Cookie expiration (in days)
        cookieExpires: 365,
        
        // Use localStorage
        useLocalStorage: true,
        
        // Use sessionStorage
        useSessionStorage: true,
    },
    
    // Session settings
    session: {
        // Session timeout (in milliseconds)
        timeout: 7 * 24 * 60 * 60 * 1000, // 7 days
        
        // Auto-renew session on activity
        autoRenew: true,
        
        // Check session validity on page load
        checkOnLoad: true,
    },
    
    // UI settings
    ui: {
        // Show wallet modal on page load if not connected
        showModalOnLoad: true,
        
        // Modal animation duration (in milliseconds)
        animationDuration: 300,
        
        // Auto-close modal after successful connection
        autoCloseAfterConnect: true,
        
        // Show user ID after connection
        showUserIdNotification: true,
    },
    
    // Security settings
    security: {
        // Enable device fingerprinting
        enableFingerprinting: true,
        
        // Track IP address
        trackIpAddress: true,
        
        // Require HTTPS for production (enforce in real deployment)
        requireHttps: false,
    },
    
    // Language settings
    language: {
        // Default language
        default: 'en',
        
        // Fallback language
        fallback: 'en',
        
        // Auto-detect user language
        autoDetect: true,
    },
    
    // Development settings
    debug: {
        // Enable console logging
        enableLogging: true,
        
        // Log API calls
        logApiCalls: true,
        
        // Log user data
        logUserData: false, // Security: keep false in production
    }
};

// ==================== WALLET TYPES ====================

const WALLET_TYPES = {
    METAMASK: 'metamask',
    WALLETCONNECT: 'walletconnect',
    COINBASE: 'coinbase',
    OTHER: 'other'
};

// ==================== API ENDPOINTS ====================

const WALLET_AUTH_ENDPOINTS = {
    // Create or get user
    getOrCreateUser: '/wallet/get-or-create-user',
    
    // Save session
    saveSession: '/wallet/save-session',
    
    // Get user by address
    getUserByAddress: '/wallet/get-user-by-address',
    
    // Get user devices
    getUserDevices: '/wallet/user/{userId}/devices',
    
    // Traditional auth endpoints
    loginWallet: '/auth/login-wallet',
    logout: '/auth/logout',
    
    // User profile
    getUserProfile: '/user/profile',
    getUserTransactions: '/user/transactions',
    
    // KYC
    kycSubmit: '/kyc/submit',
    kycStatus: '/wallet/getuserzt',
};

// ==================== ERROR MESSAGES ====================

const WALLET_AUTH_ERRORS = {
    METAMASK_NOT_INSTALLED: {
        en: 'MetaMask is not installed. Please install it first.',
        zh: '未安装MetaMask。请先安装。',
        my: 'MetaMask ကို install လုပ်ရန်လိုအပ်ပါသည်။',
    },
    
    WALLET_CONNECTION_FAILED: {
        en: 'Failed to connect wallet. Please try again.',
        zh: '钱包连接失败。请重试。',
        my: 'ပိုက်ဆံအိတ်ချိတ်ဆက်ခြင်းမailed။ ထပ်မံကြိုးစားပါ။',
    },
    
    INVALID_ADDRESS: {
        en: 'Invalid wallet address.',
        zh: '无效的钱包地址。',
        my: 'မမှန်လျှောက်ဂ်ပိုက်ဆံအိတ်လိပ်စာ။',
    },
    
    NO_ACCOUNTS_FOUND: {
        en: 'No accounts found in your wallet.',
        zh: '在您的钱包中未找到账户。',
        my: 'သင့်ပိုက်ဆံအိတ်တွင်အကောင့်များမတွေ့ရှိ။',
    },
    
    USER_CREATION_FAILED: {
        en: 'Failed to create user. Please try again.',
        zh: '用户创建失败。请重试。',
        my: 'အသုံးပြုသူဖန်တီးမی failed။ ထပ်မံကြိုးစားပါ။',
    },
    
    SESSION_EXPIRED: {
        en: 'Your session has expired. Please reconnect your wallet.',
        zh: '您的会话已过期。请重新连接您的钱包。',
        my: 'သင့်အလုပ်ခွင့်သည်ကုန်ဆုံးသွားသည်။ သင့်ပိုက်ဆံအိတ်ကိုပြန်ချိတ်ဆက်ပါ။',
    }
};

// ==================== SUCCESS MESSAGES ====================

const WALLET_AUTH_SUCCESS = {
    USER_CREATED: {
        en: 'New Account Created!',
        zh: '新账户已创建！',
        my: 'အသုံးပြုသူအကောင့်ဖန်တီးခြင်းအောင်မြင်!',
    },
    
    USER_RECOGNIZED: {
        en: 'Welcome Back!',
        zh: '欢迎回来！',
        my: 'ပြန်လည်ကြိုဆိုပါသည်!',
    },
    
    CONNECTION_SUCCESS: {
        en: 'Wallet connected successfully!',
        zh: '钱包连接成功！',
        my: 'ပိုက်ဆံအိတ်ချိတ်ဆက်မျ ့ အောင်မြင်!',
    },
    
    USER_ID_GENERATED: {
        en: 'Your User ID:',
        zh: '你的用户ID:',
        my: 'သင့်အသုံးပြုသူ ID:',
    }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get API endpoint URL
 */
function getEndpointUrl(endpoint, params = {}) {
    let url = WALLET_AUTH_CONFIG.apiUrl + WALLET_AUTH_ENDPOINTS[endpoint];
    
    // Replace path parameters
    Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key]);
    });
    
    return url;
}

/**
 * Get error message by key and language
 */
function getErrorMessage(errorKey, language = WALLET_AUTH_CONFIG.language.default) {
    if (WALLET_AUTH_ERRORS[errorKey] && WALLET_AUTH_ERRORS[errorKey][language]) {
        return WALLET_AUTH_ERRORS[errorKey][language];
    }
    if (WALLET_AUTH_ERRORS[errorKey] && WALLET_AUTH_ERRORS[errorKey]['en']) {
        return WALLET_AUTH_ERRORS[errorKey]['en'];
    }
    return 'An error occurred. Please try again.';
}

/**
 * Get success message by key and language
 */
function getSuccessMessage(messageKey, language = WALLET_AUTH_CONFIG.language.default) {
    if (WALLET_AUTH_SUCCESS[messageKey] && WALLET_AUTH_SUCCESS[messageKey][language]) {
        return WALLET_AUTH_SUCCESS[messageKey][language];
    }
    if (WALLET_AUTH_SUCCESS[messageKey] && WALLET_AUTH_SUCCESS[messageKey]['en']) {
        return WALLET_AUTH_SUCCESS[messageKey]['en'];
    }
    return 'Success!';
}

/**
 * Log debug message
 */
function walletAuthDebug(message, data = null) {
    if (WALLET_AUTH_CONFIG.debug.enableLogging) {
        console.log(`[WalletAuth] ${message}`, data || '');
    }
}

/**
 * Log API call
 */
function walletAuthLogApiCall(endpoint, method, data) {
    if (WALLET_AUTH_CONFIG.debug.logApiCalls) {
        console.log(`[WalletAuth API] ${method} ${endpoint}`, data || '');
    }
}

// ==================== EXPORT ====================

// Make globally available
if (typeof window !== 'undefined') {
    window.WALLET_AUTH_CONFIG = WALLET_AUTH_CONFIG;
    window.WALLET_TYPES = WALLET_TYPES;
    window.WALLET_AUTH_ENDPOINTS = WALLET_AUTH_ENDPOINTS;
    window.WALLET_AUTH_ERRORS = WALLET_AUTH_ERRORS;
    window.WALLET_AUTH_SUCCESS = WALLET_AUTH_SUCCESS;
    window.getEndpointUrl = getEndpointUrl;
    window.getErrorMessage = getErrorMessage;
    window.getSuccessMessage = getSuccessMessage;
    window.walletAuthDebug = walletAuthDebug;
    window.walletAuthLogApiCall = walletAuthLogApiCall;
}
