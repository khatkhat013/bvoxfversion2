/**
 * WalletConnect UI Component
 * Provides UI controls for wallet connection
 */

class WalletConnectUI {
    constructor() {
        this.modalId = 'wallet-connect-modal';
        this.isModalOpen = false;
        this.walletManager = window.walletManager;
    }

    /**
     * Initialize UI
     */
    init() {
        this.createModal();
        this.setupEventListeners();
        this.updateUI();

        // Listen to wallet changes
        this.walletManager.on('connected', () => this.updateUI());
        this.walletManager.on('disconnected', () => this.updateUI());
        this.walletManager.on('accountChanged', () => this.updateUI());
    }

    /**
     * Create wallet connect modal
     */
    createModal() {
        const html = `
            <div id="${this.modalId}" class="wallet-modal" style="display: none;">
                <div class="wallet-modal-overlay" onclick="window.walletUI.closeModal()"></div>
                <div class="wallet-modal-content">
                    <div class="wallet-modal-header">
                        <h2>Connect Wallet</h2>
                        <button class="wallet-modal-close" onclick="window.walletUI.closeModal()">×</button>
                    </div>
                    <div class="wallet-modal-body">
                        <button class="wallet-option" onclick="window.walletUI.connectMetaMask()">
                            <img src="./assets/images/metamask.png" alt="MetaMask">
                            <span>MetaMask</span>
                        </button>
                        <button class="wallet-option" onclick="window.walletUI.connectWalletConnect()">
                            <img src="./assets/images/walletconnect.png" alt="WalletConnect">
                            <span>WalletConnect</span>
                        </button>
                        <button class="wallet-option" onclick="window.walletUI.connectCoinbase()">
                            <img src="./assets/images/coinbase.png" alt="Coinbase Wallet">
                            <span>Coinbase Wallet</span>
                        </button>
                        <div class="wallet-info">
                            <p>💡 Don't have a wallet? <a href="https://metamask.io/" target="_blank">Get MetaMask</a></p>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .wallet-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .wallet-modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    cursor: pointer;
                }

                .wallet-modal-content {
                    position: relative;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    max-width: 400px;
                    width: 90%;
                    z-index: 10001;
                }

                .wallet-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #f0f0f0;
                }

                .wallet-modal-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                }

                .wallet-modal-close {
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #999;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .wallet-modal-close:hover {
                    color: #333;
                }

                .wallet-modal-body {
                    padding: 20px;
                }

                .wallet-option {
                    width: 100%;
                    padding: 15px;
                    margin-bottom: 10px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background: #f9f9f9;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    font-weight: 500;
                }

                .wallet-option:hover {
                    background: #f0f0f0;
                    border-color: #ffcc00;
                    transform: translateY(-2px);
                }

                .wallet-option img {
                    width: 32px;
                    height: 32px;
                    object-fit: contain;
                }

                .wallet-info {
                    margin-top: 15px;
                    padding: 12px;
                    background: #f9f9f9;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 12px;
                }

                .wallet-info a {
                    color: #ffcc00;
                    text-decoration: none;
                    font-weight: 600;
                }

                .wallet-connected {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: linear-gradient(135deg, #ffcc00, #ff9900);
                    color: #000;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 12px;
                    cursor: pointer;
                }

                .wallet-connected .dot {
                    width: 8px;
                    height: 8px;
                    background: #00cc00;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(0, 204, 0, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 8px rgba(0, 204, 0, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(0, 204, 0, 0);
                    }
                }

                .wallet-button {
                    padding: 10px 16px;
                    background: linear-gradient(135deg, #ffcc00, #ff9900);
                    color: #000;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .wallet-button:hover {
                    opacity: 0.8;
                    transform: translateY(-2px);
                }

                .wallet-address {
                    font-family: monospace;
                    font-size: 12px;
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Create connect button if it doesn't exist
        if (!document.querySelector('.wallet-button')) {
            const header = document.querySelector('header');
            if (header) {
                const btn = document.createElement('button');
                btn.className = 'wallet-button';
                btn.id = 'wallet-connect-btn';
                btn.textContent = 'Connect Wallet';
                btn.onclick = () => this.openModal();
                header.insertAdjacentElement('afterbegin', btn);
            }
        }
    }

    /**
     * Open modal
     */
    openModal() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.style.display = 'flex';
            this.isModalOpen = true;
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.style.display = 'none';
            this.isModalOpen = false;
        }
    }

    /**
     * Connect MetaMask
     */
    async connectMetaMask() {
        try {
            const result = await this.walletManager.connect();
            if (result.success) {
                this.closeModal();
                this.showSuccess('Wallet connected successfully!');
                // Send to backend for authentication
                await this.authenticateUser(result.account);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Failed to connect wallet: ' + error.message);
        }
    }

    /**
     * Connect WalletConnect
     */
    async connectWalletConnect() {
        // WalletConnect requires additional setup
        this.showError('WalletConnect coming soon');
    }

    /**
     * Connect Coinbase
     */
    async connectCoinbase() {
        // Coinbase requires additional setup
        this.showError('Coinbase Wallet coming soon');
    }

    /**
     * Authenticate user with backend
     */
    async authenticateUser(account) {
        try {
            // Sign message for authentication
            const message = `Sign this message to verify your wallet ownership.\n\nWallet: ${account}\nTime: ${new Date().toISOString()}`;
            const signature = await this.walletManager.signMessage(message);

            if (!signature) {
                this.showError('Failed to sign message');
                return;
            }

            // Send to backend
            const response = await fetch(apiurl + '/auth/login-wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: account,
                    signature: signature,
                    message: message,
                }),
            });

            const data = await response.json();
            if (data.code === 1) {
                // Store credentials
                setCookie('userid', data.data.userid);
                setCookie('username', data.data.username);
                setCookie('ytoken', data.data.token);
                setCookie('wallet', account);

                // Redirect to dashboard
                window.location.href = '/';
            } else {
                this.showError(data.info || 'Authentication failed');
            }
        } catch (error) {
            this.showError('Authentication error: ' + error.message);
        }
    }

    /**
     * Update UI based on connection status
     */
    updateUI() {
        const btn = document.getElementById('wallet-connect-btn');
        if (!btn) return;

        if (this.walletManager.isWalletConnected()) {
            const account = this.walletManager.getAccount();
            const shortAddress = account.substring(0, 6) + '...' + account.substring(38);
            btn.innerHTML = `<span class="dot"></span><span class="wallet-address">${shortAddress}</span>`;
            btn.classList.add('wallet-connected');
            btn.onclick = () => this.showAccountMenu();
        } else {
            btn.textContent = 'Connect Wallet';
            btn.classList.remove('wallet-connected');
            btn.onclick = () => this.openModal();
        }
    }

    /**
     * Show account menu
     */
    showAccountMenu() {
        const account = this.walletManager.getAccount();
        const balance = this.walletManager.getBalance();

        const menu = `
            <div class="account-menu" style="
                position: fixed;
                top: 60px;
                right: 20px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 12px;
                z-index: 10000;
                min-width: 250px;
            ">
                <div style="font-size: 12px; color: #999; margin-bottom: 8px;">Account</div>
                <div style="font-family: monospace; font-size: 12px; margin-bottom: 12px; padding: 8px; background: #f9f9f9; border-radius: 4px; word-break: break-all;">
                    ${account}
                </div>
                <button onclick="window.walletUI.copyAddress('${account}')" style="
                    width: 100%;
                    padding: 8px;
                    background: #f9f9f9;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-bottom: 8px;
                ">📋 Copy Address</button>
                <button onclick="window.walletUI.disconnect()" style="
                    width: 100%;
                    padding: 8px;
                    background: #fee;
                    border: 1px solid #fcc;
                    border-radius: 4px;
                    cursor: pointer;
                    color: #c00;
                ">Disconnect</button>
            </div>
        `;

        // Remove existing menu if any
        const existing = document.querySelector('.account-menu');
        if (existing) existing.remove();

        document.body.insertAdjacentHTML('beforeend', menu);

        // Close menu on click outside
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.account-menu') && !e.target.closest('.wallet-connected')) {
                    document.querySelector('.account-menu')?.remove();
                }
            }, { once: true });
        }, 100);
    }

    /**
     * Copy address to clipboard
     */
    copyAddress(address) {
        copyToClipboard(address);
        this.showSuccess('Address copied to clipboard!');
    }

    /**
     * Disconnect wallet
     */
    disconnect() {
        this.walletManager.disconnect();
        removeCookie('userid');
        removeCookie('username');
        removeCookie('ytoken');
        removeCookie('wallet');
        window.location.href = '/';
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10002;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize UI
window.walletUI = new WalletConnectUI();
document.addEventListener('DOMContentLoaded', () => {
    window.walletUI.init();
});

console.log('✓ WalletConnectUI loaded');
