/**
 * MongoDB Setup & Seed Script
 * 
 * Usage: node setup-db.js
 * This will:
 * 1. Connect to MongoDB
 * 2. Create indexes
 * 3. Seed sample data
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bvox-finance';

// ========== SCHEMAS ==========

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        index: true,
    },
    username: String,
    email: String,
    balance: { type: Number, default: 0 },
    creditScore: { type: Number, default: 100 },
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
    createdAt: { type: Date, default: Date.now, index: true },
    lastLogin: Date,
});

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ['mining', 'trading', 'loan', 'arbitrage', 'transfer'],
        required: true,
        index: true,
    },
    amount: { type: Number, required: true },
    currency: String,
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
        index: true,
    },
    txHash: String,
    description: String,
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    address: String,
    token: { type: String, index: true },
    signature: String,
    expiresAt: { type: Date, index: true },
    createdAt: { type: Date, default: Date.now },
});

// ========== MODELS ==========

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Session = mongoose.model('Session', sessionSchema);

// ========== SETUP FUNCTION ==========

async function setupDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✓ MongoDB connected');

        // Create indexes
        console.log('🔄 Creating indexes...');
        await userSchema.collection.createIndex({ address: 1 }, { unique: true });
        await userSchema.collection.createIndex({ createdAt: 1 });
        await transactionSchema.collection.createIndex({ userId: 1 });
        await transactionSchema.collection.createIndex({ status: 1 });
        await sessionSchema.collection.createIndex({ userId: 1 });
        await sessionSchema.collection.createIndex({ token: 1 });
        await sessionSchema.collection.createIndex({ expiresAt: 1 });
        console.log('✓ Indexes created');

        // Seed sample data
        console.log('🔄 Seeding sample data...');

        const sampleUsers = [
            {
                address: '0x742d35Cc6634C0532925a3b844Bc9e7595f42bE1',
                username: 'trader_001',
                email: 'trader1@example.com',
                balance: 100.5,
                creditScore: 850,
                kycStatus: 'advanced',
            },
            {
                address: '0x742d35Cc6634C0532925a3b844Bc9e7595f42bE2',
                username: 'miner_001',
                email: 'miner1@example.com',
                balance: 50.25,
                creditScore: 650,
                kycStatus: 'basic',
            },
            {
                address: '0x742d35Cc6634C0532925a3b844Bc9e7595f42bE3',
                username: 'investor_001',
                email: 'investor1@example.com',
                balance: 500,
                creditScore: 900,
                kycStatus: 'advanced',
            },
        ];

        // Clear existing users
        await User.deleteMany({});
        const users = await User.insertMany(sampleUsers);
        console.log(`✓ Inserted ${users.length} sample users`);

        // Seed sample transactions
        const sampleTransactions = [
            {
                userId: users[0]._id,
                type: 'mining',
                amount: 10.5,
                currency: 'ETH',
                status: 'completed',
                description: 'Mining reward',
                txHash: '0x123456...',
            },
            {
                userId: users[0]._id,
                type: 'trading',
                amount: 5,
                currency: 'BTC',
                status: 'completed',
                description: 'BTC purchase',
                txHash: '0x789012...',
            },
            {
                userId: users[1]._id,
                type: 'mining',
                amount: 20,
                currency: 'ETH',
                status: 'pending',
                description: 'Mining in progress',
            },
        ];

        await Transaction.deleteMany({});
        const transactions = await Transaction.insertMany(sampleTransactions);
        console.log(`✓ Inserted ${transactions.length} sample transactions`);

        console.log(`
╔═══════════════════════════════════════╗
║   Database Setup Complete!            ║
╚═══════════════════════════════════════╝

✓ MongoDB connected
✓ Indexes created
✓ Sample data seeded

Sample Users:
${sampleUsers.map((u, i) => `  ${i + 1}. ${u.username} (${u.address})`).join('\n')}

Database: ${mongoURI.split('/').pop()}

You can now start your backend server:
  npm run backend

Or start both servers:
  npm run dev:all
        `);

        await mongoose.connection.close();
    } catch (error) {
        console.error('✗ Database setup error:', error.message);
        process.exit(1);
    }
}

// ========== RUN SETUP ==========

if (require.main === module) {
    setupDatabase();
}

module.exports = { User, Transaction, Session };
