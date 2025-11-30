/**
 * WalletConnect Integration for BVOX Finance
 * Supports MetaMask, WalletConnect, and other Web3 wallets
 * 
 * Features:
 * - Multiple wallet support
 * - Account switching
 * - Network detection
 * - Transaction signing
 * - User authentication
 */

class WalletManager {
    constructor() {
        this.provider = null;
        this.account = null;
        this.chainId = null;
        this.isConnected = false;
        this.listeners = {};
        this.web3 = null;

        // Check if Web3 is available
        this.detectProvider();
    }

    /**
     * Detect Web3 provider (MetaMask, etc.)
     */
    detectProvider() {
        if (window.ethereum) {
            this.provider = window.ethereum;
            console.log('✓ Web3 provider detected');
            this.setupListeners();
        } else {
            console.warn('✗ No Web3 provider found');
        }
    }

    /**
     * Setup event listeners for provider
     */
    setupListeners() {
        if (!this.provider) return;

        // Account changed
        this.provider.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                this.account = accounts[0];
                this.emit('accountChanged', { account: this.account });
            } else {
                this.disconnect();
            }
        });

        // Chain/Network changed
        this.provider.on('chainChanged', (chainId) => {
            this.chainId = parseInt(chainId, 16);
            this.emit('chainChanged', { chainId: this.chainId });
            // Reload page on chain change
            window.location.reload();
        });

        // Provider disconnected
        this.provider.on('disconnect', (error) => {
            console.log('Provider disconnected:', error);
            this.disconnect();
        });
    }

    /**
     * Connect wallet
     */
    async connect() {
        try {
            if (!this.provider) {
                throw new Error('No Web3 provider found. Please install MetaMask.');
            }

            // Request account access
            const accounts = await this.provider.request({
                method: 'eth_requestAccounts',
            });

            if (accounts && accounts.length > 0) {
                this.account = accounts[0];
                this.isConnected = true;

                // Get chain ID
                const chainIdHex = await this.provider.request({
                    method: 'eth_chainId',
                });
                this.chainId = parseInt(chainIdHex, 16);

                // Initialize Web3
                if (window.Web3) {
                    this.web3 = new Web3(this.provider);
                }

                console.log('✓ Wallet connected:', this.account);
                this.emit('connected', {
                    account: this.account,
                    chainId: this.chainId,
                });

                return {
                    success: true,
                    account: this.account,
                    chainId: this.chainId,
                };
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            this.emit('error', { error: error.message });
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Disconnect wallet
     */
    disconnect() {
        this.account = null;
        this.isConnected = false;
        this.chainId = null;
        console.log('✓ Wallet disconnected');
        this.emit('disconnected', {});
    }

    /**
     * Get current account
     */
    getAccount() {
        return this.account;
    }

    /**
     * Get chain ID
     */
    getChainId() {
        return this.chainId;
    }

    /**
     * Check if wallet is connected
     */
    isWalletConnected() {
        return this.isConnected;
    }

    /**
     * Get wallet balance
     */
    async getBalance() {
        try {
            if (!this.account || !this.web3) {
                throw new Error('Wallet not connected');
            }

            const balance = await this.web3.eth.getBalance(this.account);
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Failed to get balance:', error);
            return null;
        }
    }

    /**
     * Sign message
     */
    async signMessage(message) {
        try {
            if (!this.account || !this.provider) {
                throw new Error('Wallet not connected');
            }

            const signature = await this.provider.request({
                method: 'personal_sign',
                params: [message, this.account],
            });

            return signature;
        } catch (error) {
            console.error('Failed to sign message:', error);
            return null;
        }
    }

    /**
     * Send transaction
     */
    async sendTransaction(to, value, data = null) {
        try {
            if (!this.account || !this.provider) {
                throw new Error('Wallet not connected');
            }

            const txData = {
                from: this.account,
                to: to,
                value: this.web3.utils.toWei(value, 'ether'),
                gas: '21000',
            };

            if (data) {
                txData.data = data;
            }

            const txHash = await this.provider.request({
                method: 'eth_sendTransaction',
                params: [txData],
            });

            return txHash;
        } catch (error) {
            console.error('Failed to send transaction:', error);
            return null;
        }
    }

    /**
     * Request to add custom token
     */
    async addToken(tokenAddress, tokenSymbol, tokenDecimals, tokenImage) {
        try {
            await this.provider.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: tokenImage,
                    },
                },
            });
            return true;
        } catch (error) {
            console.error('Failed to add token:', error);
            return false;
        }
    }

    /**
     * Request to switch network
     */
    async switchNetwork(chainId) {
        try {
            const chainIdHex = '0x' + chainId.toString(16);
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainIdHex }],
            });
            return true;
        } catch (error) {
            console.error('Failed to switch network:', error);
            return false;
        }
    }

    /**
     * Request to add network
     */
    async addNetwork(chainId, chainName, rpcUrl, symbol, blockExplorerUrl) {
        try {
            const chainIdHex = '0x' + chainId.toString(16);
            await this.provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainId: chainIdHex,
                        chainName: chainName,
                        rpcUrls: [rpcUrl],
                        nativeCurrency: {
                            name: symbol,
                            symbol: symbol,
                            decimals: 18,
                        },
                        blockExplorerUrls: [blockExplorerUrl],
                    },
                ],
            });
            return true;
        } catch (error) {
            console.error('Failed to add network:', error);
            return false;
        }
    }

    /**
     * Event emitter
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
}

// Create global wallet manager instance
window.walletManager = new WalletManager();

console.log('✓ WalletManager initialized');
