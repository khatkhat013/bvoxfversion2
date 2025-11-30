/**
 * Backend Server with Wallet Authentication
 * Handles user authentication, database, and API endpoints
 * 
 * Setup:
 * 1. npm install express cors dotenv ethers mongoose
 * 2. Create .env file with database credentials
 * 3. Run: node backend-server.js
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ethers = require('ethers');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ========== DATABASE SETUP ==========

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bvox-finance';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✓ MongoDB connected'))
    .catch(err => console.error('✗ MongoDB error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    address: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    username: String,
    email: String,
    balance: { type: Number, default: 0 },
    creditScore: { type: Number, default: 0 },
    kycStatus: {
        type: String,
        enum: ['none', 'basic', 'advanced'],
        default: 'none',
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'banned'],
        default: 'active',
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
    ],
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date,
});

// Create index for userId for faster queries
userSchema.index({ userId: 1 });

const User = mongoose.model('User', userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['mining', 'trading', 'loan', 'arbitrage', 'transfer'],
        required: true,
    },
    amount: { type: Number, required: true },
    currency: String,
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    txHash: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Session Schema
const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: String,
    token: String,
    signature: String,
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model('Session', sessionSchema);

// Device Session Schema - Track wallet → User ID mapping with device info
const deviceSessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    address: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
    },
    sessionToken: String,
    ipAddress: String,
    userAgent: String,
    walletType: {
        type: String,
        enum: ['metamask', 'walletconnect', 'coinbase', 'other'],
        default: 'metamask',
    },
    isActive: { type: Boolean, default: true },
    lastActivityAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, // 30 days
});

// TTL index to auto-delete expired sessions
deviceSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const DeviceSession = mongoose.model('DeviceSession', deviceSessionSchema);

// ========== AUTHENTICATION ==========

/**
 * Generate unique user ID (5-6 digit format)
 */
function generateUserId() {
    // Format: YYMMDD + 5 random digits
    // Example: 250130-37283
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `${year}${month}${day}-${random}`;
}

/**
 * Verify wallet signature
 */
function verifySignature(message, signature, address) {
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

/**
 * Generate JWT token (simple implementation)
 */
function generateToken() {
    return require('crypto').randomBytes(32).toString('hex');
}

// ========== API ENDPOINTS ==========

/**
 * POST /auth/login-wallet
 * Authenticate user with wallet signature
 */
app.post('/auth/login-wallet', async (req, res) => {
    try {
        const { address, signature, message } = req.body;

        if (!address || !signature || !message) {
            return res.json({
                code: 0,
                info: 'Missing required parameters',
            });
        }

        // Verify signature
        if (!verifySignature(message, signature, address)) {
            return res.json({
                code: 0,
                info: 'Invalid signature',
            });
        }

        // Find or create user
        let user = await User.findOne({ address: address.toLowerCase() });

        if (!user) {
            user = await User.create({
                address: address.toLowerCase(),
                username: `User_${address.substring(2, 8)}`,
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create session
        const token = generateToken();
        const session = await Session.create({
            userId: user._id,
            address: address.toLowerCase(),
            token: token,
            signature: signature,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        res.json({
            code: 1,
            info: 'Login successful',
            data: {
                userid: user._id,
                username: user.username,
                address: user.address,
                token: token,
                kycStatus: user.kycStatus,
                creditScore: user.creditScore,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.json({
            code: 0,
            info: 'Login failed',
        });
    }
});

/**
 * POST /auth/logout
 * Logout user
 */
app.post('/auth/logout', async (req, res) => {
    try {
        const { token } = req.body;
        await Session.deleteOne({ token });

        res.json({
            code: 1,
            info: 'Logout successful',
        });
    } catch (error) {
        res.json({
            code: 0,
            info: 'Logout failed',
        });
    }
});

/**
 * GET /user/profile
 * Get user profile
 */
app.get('/user/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({
                code: 0,
                info: 'No token provided',
            });
        }

        const session = await Session.findOne({ token });
        if (!session) {
            return res.json({
                code: 0,
                info: 'Invalid token',
            });
        }

        const user = await User.findById(session.userId);
        res.json({
            code: 1,
            data: {
                userid: user._id,
                address: user.address,
                username: user.username,
                email: user.email,
                balance: user.balance,
                creditScore: user.creditScore,
                kycStatus: user.kycStatus,
                status: user.status,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.json({
            code: 0,
            info: 'Failed to get profile',
        });
    }
});

/**
 * GET /user/transactions
 * Get user transactions
 */
app.get('/user/transactions', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const session = await Session.findOne({ token });

        if (!session) {
            return res.json({
                code: 0,
                info: 'Unauthorized',
            });
        }

        const transactions = await Transaction.find({
            userId: session.userId,
        }).sort({ createdAt: -1 });

        res.json({
            code: 1,
            data: transactions,
        });
    } catch (error) {
        res.json({
            code: 0,
            info: 'Failed to get transactions',
        });
    }
});

/**
 * POST /transaction/create
 * Create new transaction
 */
app.post('/transaction/create', async (req, res) => {
    try {
        const { token, type, amount, currency, description } = req.body;

        const session = await Session.findOne({ token });
        if (!session) {
            return res.json({
                code: 0,
                info: 'Unauthorized',
            });
        }

        const transaction = await Transaction.create({
            userId: session.userId,
            type,
            amount,
            currency,
            description,
            status: 'pending',
        });

        res.json({
            code: 1,
            info: 'Transaction created',
            data: transaction,
        });
    } catch (error) {
        res.json({
            code: 0,
            info: 'Failed to create transaction',
        });
    }
});

/**
 * POST /wallet/getuserzt
 * Get user status and KYC info
 */
app.post('/wallet/getuserzt', async (req, res) => {
    try {
        const { userid } = req.body;

        const user = await User.findById(userid);
        if (!user) {
            return res.json({
                code: 0,
                info: 'User not found',
            });
        }

        // Map KYC status to number
        const kycMap = { none: 0, basic: 1, advanced: 2 };

        res.json({
            code: 1,
            data: {
                renzhengzhuangtai: kycMap[user.kycStatus],
                xinyongfen: user.creditScore,
                balance: user.balance,
                status: user.status,
            },
        });
    } catch (error) {
        res.json({
            code: 0,
            info: 'Failed to get user status',
        });
    }
});

/**
 * POST /kyc/submit
 * Submit KYC information
 */
app.post('/kyc/submit', async (req, res) => {
    try {
        const { userid, kycData } = req.body;

        const user = await User.findById(userid);
        if (!user) {
            return res.json({
                code: 0,
                info: 'User not found',
            });
        }

        // Store KYC data (in production, use secure storage)
        user.kycStatus = 'basic'; // Mark as submitted
        await user.save();

        res.json({
            code: 1,
            info: 'KYC submitted successfully',
            data: {
                status: user.kycStatus,
            },
        });
    } catch (error) {
        res.json({
            code: 0,
            info: 'Failed to submit KYC',
        });
    }
});

/**
 * POST /wallet/get-or-create-user
 * Get existing user ID or create new user with ID
 * Used for wallet connection on frontend
 */
app.post('/wallet/get-or-create-user', async (req, res) => {
    try {
        const { address, walletType, userAgent, ipAddress } = req.body;

        if (!address) {
            return res.json({
                code: 0,
                message: 'Address is required',
            });
        }

        const lowerAddress = address.toLowerCase();

        // Check if user already exists with this address
        let user = await User.findOne({ address: lowerAddress });
        let isNewUser = false;

        if (!user) {
            // Create new user with generated ID
            const userId = generateUserId();
            
            user = await User.create({
                userId: userId,
                address: lowerAddress,
                username: `User_${address.substring(2, 8)}`,
                lastLogin: new Date(),
            });

            isNewUser = true;
            console.log('✓ New user created:', userId, 'Address:', lowerAddress);
        } else {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            console.log('✓ Existing user accessed:', user.userId, 'Address:', lowerAddress);
        }

        // Create device session record
        const sessionToken = generateToken();
        await DeviceSession.create({
            userId: user.userId,
            address: lowerAddress,
            sessionToken: sessionToken,
            ipAddress: ipAddress || 'unknown',
            userAgent: userAgent || 'unknown',
            walletType: walletType || 'metamask',
            isActive: true,
        });

        console.log('✓ Device session created for user:', user.userId);

        res.json({
            code: 1,
            message: isNewUser ? 'User created successfully' : 'User found',
            data: {
                userId: user.userId,
                address: user.address,
                isNew: isNewUser,
                sessionToken: sessionToken,
            },
        });
    } catch (error) {
        console.error('Error in get-or-create-user:', error);
        res.json({
            code: 0,
            message: 'Failed to process wallet connection',
            error: error.message,
        });
    }
});

/**
 * POST /wallet/save-session
 * Save session data to backend
 */
app.post('/wallet/save-session', async (req, res) => {
    try {
        const { userId, address, walletType, connectedAt } = req.body;

        if (!userId || !address) {
            return res.json({
                code: 0,
                message: 'Missing required fields',
            });
        }

        // Update device session
        await DeviceSession.updateOne(
            { userId: userId, address: address.toLowerCase() },
            {
                $set: {
                    walletType: walletType,
                    lastActivityAt: new Date(),
                    isActive: true,
                }
            }
        );

        res.json({
            code: 1,
            message: 'Session saved successfully',
        });
    } catch (error) {
        console.error('Error saving session:', error);
        res.json({
            code: 0,
            message: 'Failed to save session',
        });
    }
});

/**
 * POST /wallet/get-user-by-address
 * Get user ID by wallet address (for auto-login)
 */
app.post('/wallet/get-user-by-address', async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.json({
                code: 0,
                message: 'Address is required',
            });
        }

        const user = await User.findOne({ address: address.toLowerCase() });

        if (!user) {
            return res.json({
                code: 0,
                message: 'User not found',
            });
        }

        // Update last activity
        await DeviceSession.updateMany(
            { address: address.toLowerCase() },
            { lastActivityAt: new Date() }
        );

        res.json({
            code: 1,
            message: 'User found',
            data: {
                userId: user.userId,
                address: user.address,
                username: user.username,
                kycStatus: user.kycStatus,
                creditScore: user.creditScore,
            },
        });
    } catch (error) {
        console.error('Error getting user by address:', error);
        res.json({
            code: 0,
            message: 'Failed to get user',
        });
    }
});

/**
 * GET /wallet/user/:userId/devices
 * Get all devices/sessions for a user ID
 */
app.get('/wallet/user/:userId/devices', async (req, res) => {
    try {
        const { userId } = req.params;

        const devices = await DeviceSession.find({ userId: userId }).sort({ createdAt: -1 });

        res.json({
            code: 1,
            data: devices.map(d => ({
                address: d.address,
                ipAddress: d.ipAddress,
                userAgent: d.userAgent,
                walletType: d.walletType,
                isActive: d.isActive,
                lastActivityAt: d.lastActivityAt,
                createdAt: d.createdAt,
            })),
        });
    } catch (error) {
        console.error('Error getting user devices:', error);
        res.json({
            code: 0,
            message: 'Failed to get user devices',
        });
    }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
    });
});

// ========== ERROR HANDLING ==========

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.json({
        code: 0,
        info: 'Server error',
    });
});

// ========== START SERVER ==========

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   BVOX Finance Backend Server          ║
╚════════════════════════════════════════╝

🚀 Server running at: http://localhost:${PORT}
📊 Database: ${mongoURI}

Available endpoints:
  POST   /auth/login-wallet              - Wallet authentication
  POST   /auth/logout                    - User logout
  GET    /user/profile                   - Get user profile
  GET    /user/transactions              - Get transactions
  POST   /transaction/create             - Create transaction
  POST   /wallet/getuserzt               - Get user status
  POST   /wallet/get-or-create-user      - Get/create user with ID ⭐ NEW
  POST   /wallet/save-session            - Save session data ⭐ NEW
  POST   /wallet/get-user-by-address     - Get user by wallet address ⭐ NEW
  GET    /wallet/user/:userId/devices    - Get user devices ⭐ NEW
  POST   /kyc/submit                     - Submit KYC
  GET    /health                         - Health check

Press Ctrl+C to stop the server
    `);
});

module.exports = app;
