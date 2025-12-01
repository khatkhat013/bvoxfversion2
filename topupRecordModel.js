// topupRecordModel.js
const fs = require('fs');
const path = require('path');

const TOPUP_RECORDS_FILE = path.join(__dirname, 'topup_records.json');

function loadRecords() {
    if (!fs.existsSync(TOPUP_RECORDS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(TOPUP_RECORDS_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
}

function saveRecords(records) {
    fs.writeFileSync(TOPUP_RECORDS_FILE, JSON.stringify(records, null, 2));
}

/**
 * Save a topup record
 * @param {string} user_id - User ID from registration
 * @param {string} coin - Coin type (USDT, BTC, ETH, USDC, PYUSD, SOL)
 * @param {string} address - Wallet address for the coin
 * @param {string} photo_url - URL/path to uploaded proof image
 * @param {number} amount - Top-up amount
 * @returns {Object} Saved record with id and timestamp
 */
function saveTopupRecord({ user_id, coin, address, photo_url, amount }) {
    if (!user_id || !coin || !address || !photo_url || !amount) {
        throw new Error('Missing required fields: user_id, coin, address, photo_url, amount');
    }

    const records = loadRecords();
    const record = {
        id: `topup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id,
        coin: coin.toUpperCase(),
        address,
        photo_url,
        amount: parseFloat(amount),
        status: 'pending', // pending, approved, rejected
        timestamp: Date.now(),
        created_at: new Date().toISOString()
    };

    records.push(record);
    saveRecords(records);
    return record;
}

/**
 * Get all topup records for a specific user
 * @param {string} user_id - User ID
 * @returns {Array} Array of topup records
 */
function getUserTopupRecords(user_id) {
    const records = loadRecords();
    return records.filter(r => r.user_id === user_id).sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get all topup records (admin view)
 * @returns {Array} All records
 */
function getAllTopupRecords() {
    return loadRecords().sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Update record status
 * @param {string} record_id - Record ID
 * @param {string} new_status - New status (pending, approved, rejected)
 * @returns {Object} Updated record or null
 */
function updateRecordStatus(record_id, new_status) {
    const records = loadRecords();
    const idx = records.findIndex(r => r.id === record_id);
    if (idx === -1) return null;

    records[idx].status = new_status;
    records[idx].updated_at = new Date().toISOString();
    saveRecords(records);
    return records[idx];
}

module.exports = {
    saveTopupRecord,
    getUserTopupRecords,
    getAllTopupRecords,
    updateRecordStatus
};
