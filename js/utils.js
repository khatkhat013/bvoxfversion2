/**
 * Shared Utilities and Helper Functions
 */

// WebSocket Price Update Handler
class PriceWebSocketManager {
    constructor(wsUrl = WS_CONFIG.huobi) {
        this.wsUrl = wsUrl;
        this.socket = null;
        this.subscriptions = [];
    }

    connect() {
        try {
            this.socket = new WebSocket(this.wsUrl);
            this.socket.onopen = () => this.handleOpen();
            this.socket.onmessage = (event) => this.handleMessage(event);
            this.socket.onerror = (error) => this.handleError(error);
            this.socket.onclose = () => this.handleClose();
        } catch (error) {
            console.error('WebSocket connection failed:', error);
        }
    }

    handleOpen() {
        console.log('WebSocket connected to Huobi');
        // Subscribe to all configured cryptocurrencies
        Object.values(CRYPTOCURRENCIES).forEach(crypto => {
            this.subscribe(`market.${crypto.pair}.kline.1day`);
        });
    }

    handleMessage(event) {
        const blob = event.data;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const ploydata = new Uint8Array(e.target.result);
                const msg = pako.inflate(ploydata, { to: 'string' });
                this.processData(msg);
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };
        reader.readAsArrayBuffer(blob);
    }

    processData(msg) {
        const data = JSON.parse(msg);

        if (data.ping) {
            this.sendHeartbeat(data.ping);
        } else if (data.status === 'ok') {
            console.log('WebSocket subscription confirmed:', data);
        } else if (data.ch) {
            // Dispatch event with price data
            window.dispatchEvent(new CustomEvent('priceUpdate', { detail: data }));
        }
    }

    subscribe(channel) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = { sub: channel };
            this.socket.send(JSON.stringify(message));
            this.subscriptions.push(channel);
        }
    }

    sendHeartbeat(ping) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ pong: ping }));
        }
    }

    handleError(error) {
        console.error('WebSocket error:', error);
    }

    handleClose() {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

// Utility: Copy text to clipboard
function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    return text;
}

// Utility: Format currency values
function formatCurrency(value, decimals = 2) {
    if (!value) return '0.00';
    return parseFloat(value).toFixed(decimals);
}

// Utility: Calculate percentage change
function calculatePercentageChange(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(2);
}

// Utility: Get currency color based on change
function getPriceChangeColor(change) {
    return change >= 0 ? 'green' : 'red';
}

// Utility: Update price display
function updatePriceDisplay(elementSelector, price, change, isPositive) {
    const element = document.querySelector(elementSelector);
    if (!element) return;

    const color = isPositive ? 'green' : 'red';
    const colorClass = isPositive ? 'fgreen' : 'fred';
    
    element.innerHTML = `<span class="${colorClass}" style="font-weight: 500;">${price}</span>`;
}

// Utility: Validate wallet address format
function isValidWalletAddress(address) {
    // Basic validation - adjust regex based on your wallet format
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Utility: Make API calls with error handling
async function makeApiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Utility: Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Utility: Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
