const fs = require('fs');
const path = require('path');

// Data file path
const arbitrageFile = path.join(__dirname, 'arbitrage_products.json');

/**
 * Initialize arbitrage products file if it doesn't exist
 */
function initializeArbitrageProducts() {
    if (!fs.existsSync(arbitrageFile)) {
        const defaultProducts = [
            {
                id: '1',
                name: 'Smart Plan A',
                duration: '1 Day',
                duration_days: 1,
                min_amount: 500,
                max_amount: 5000,
                daily_return_min: 1.60,
                daily_return_max: 1.80,
                times: 1,
                arbitrage_types: ['BTC', 'ETH', 'USDT', 'USDC', 'PYUSD'],
                image: 'tl1.jpg',
                status: 'active',
                created_at: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Smart Plan B',
                duration: '3 Days',
                duration_days: 3,
                min_amount: 1000,
                max_amount: 10000,
                daily_return_min: 2.00,
                daily_return_max: 2.50,
                times: 1,
                arbitrage_types: ['BTC', 'ETH', 'USDT', 'USDC'],
                image: 'tl2.jpg',
                status: 'active',
                created_at: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Smart Plan C',
                duration: '7 Days',
                duration_days: 7,
                min_amount: 5000,
                max_amount: 50000,
                daily_return_min: 2.50,
                daily_return_max: 3.00,
                times: 1,
                arbitrage_types: ['BTC', 'ETH', 'USDT'],
                image: 'tl3.jpg',
                status: 'active',
                created_at: new Date().toISOString()
            }
        ];
        fs.writeFileSync(arbitrageFile, JSON.stringify(defaultProducts, null, 2));
    }
}

/**
 * Get all arbitrage products
 */
function getAllArbitrageProducts() {
    try {
        initializeArbitrageProducts();
        const data = fs.readFileSync(arbitrageFile, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading arbitrage products:', e);
        return [];
    }
}

/**
 * Get arbitrage product by ID
 */
function getArbitrageProductById(productId) {
    const products = getAllArbitrageProducts();
    return products.find(p => p.id === productId);
}

/**
 * Get active arbitrage products
 */
function getActiveArbitrageProducts() {
    const products = getAllArbitrageProducts();
    return products.filter(p => p.status === 'active');
}

/**
 * Create new arbitrage subscription
 */
function createArbitrageSubscription(userId, productId, amount) {
    let subscriptionFile = path.join(__dirname, 'arbitrage_subscriptions.json');
    let subscriptions = [];
    
    try {
        if (fs.existsSync(subscriptionFile)) {
            subscriptions = JSON.parse(fs.readFileSync(subscriptionFile, 'utf8'));
        }
    } catch (e) {
        console.error('Error reading subscriptions:', e);
    }

    const product = getArbitrageProductById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    if (amount < product.min_amount || amount > product.max_amount) {
        throw new Error(`Amount must be between $${product.min_amount} and $${product.max_amount}`);
    }

    const subscription = {
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        product_id: productId,
        product_name: product.name,
        amount: amount,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + product.duration_days * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        total_income: 0,
        daily_income: 0,
        created_at: new Date().toISOString()
    };

    subscriptions.push(subscription);
    fs.writeFileSync(subscriptionFile, JSON.stringify(subscriptions, null, 2));

    return subscription;
}

/**
 * Get user's arbitrage subscriptions
 */
function getUserArbitrageSubscriptions(userId) {
    let subscriptionFile = path.join(__dirname, 'arbitrage_subscriptions.json');
    
    try {
        if (!fs.existsSync(subscriptionFile)) {
            return [];
        }
        const subscriptions = JSON.parse(fs.readFileSync(subscriptionFile, 'utf8'));
        return subscriptions.filter(s => s.user_id === userId);
    } catch (e) {
        console.error('Error reading subscriptions:', e);
        return [];
    }
}

/**
 * Get all arbitrage subscriptions
 */
function getAllArbitrageSubscriptions() {
    let subscriptionFile = path.join(__dirname, 'arbitrage_subscriptions.json');
    
    try {
        if (!fs.existsSync(subscriptionFile)) {
            return [];
        }
        const subscriptions = JSON.parse(fs.readFileSync(subscriptionFile, 'utf8'));
        return subscriptions;
    } catch (e) {
        console.error('Error reading subscriptions:', e);
        return [];
    }
}

/**
 * Calculate arbitrage income
 */
function calculateArbitrageIncome(subscription) {
    const product = getArbitrageProductById(subscription.product_id);
    if (!product) {
        return { daily: 0, total: 0 };
    }

    // Calculate daily income (use middle value of range)
    const avgDailyReturnRate = (product.daily_return_min + product.daily_return_max) / 2 / 100;
    const dailyIncome = subscription.amount * avgDailyReturnRate;

    // Calculate total income for the duration
    const startDate = new Date(subscription.start_date);
    const endDate = new Date(subscription.end_date);
    const daysElapsed = Math.min(
        Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24)),
        product.duration_days
    );
    
    const totalIncome = dailyIncome * daysElapsed;

    return {
        daily: Math.round(dailyIncome * 100) / 100,
        total: Math.round(totalIncome * 100) / 100
    };
}

/**
 * Get user's arbitrage statistics
 */
function getUserArbitrageStats(userId) {
    const subscriptions = getUserArbitrageSubscriptions(userId);
    
    let totalInvested = 0;
    let totalIncome = 0;
    let activeCount = 0;
    let completedCount = 0;

    subscriptions.forEach(sub => {
        totalInvested += sub.amount;
        const income = calculateArbitrageIncome(sub);
        totalIncome += income.total;
        
        if (sub.status === 'active') {
            activeCount++;
        } else if (sub.status === 'completed') {
            completedCount++;
        }
    });

    return {
        total_invested: Math.round(totalInvested * 100) / 100,
        total_income: Math.round(totalIncome * 100) / 100,
        active_plans: activeCount,
        completed_plans: completedCount,
        total_plans: subscriptions.length
    };
}

module.exports = {
    getAllArbitrageProducts,
    getArbitrageProductById,
    getActiveArbitrageProducts,
    createArbitrageSubscription,
    getUserArbitrageSubscriptions,
    getAllArbitrageSubscriptions,
    calculateArbitrageIncome,
    getUserArbitrageStats,
    initializeArbitrageProducts
};
