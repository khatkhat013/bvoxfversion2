/**
 * Withdrawal Record Model
 * Handles saving and retrieving withdrawal records from withdrawals_records.json
 */

const fs = require('fs');
const path = require('path');

const WITHDRAWAL_DB = path.join(__dirname, 'withdrawals_records.json');

/**
 * Initialize the withdrawal database
 */
function initWithdrawalDB() {
    if (!fs.existsSync(WITHDRAWAL_DB)) {
        fs.writeFileSync(WITHDRAWAL_DB, JSON.stringify([], null, 2));
    }
}

/**
 * Save a withdrawal record
 * @param {Object} withdrawalData - { user_id, coin, address, quantity, status }
 * @returns {Object} - Saved record with id and timestamps
 */
function saveWithdrawalRecord(withdrawalData) {
    initWithdrawalDB();
    
    const { user_id, coin, address, quantity, status = 'pending' } = withdrawalData;
    
    // Validate required fields
    if (!user_id || !coin || !address || !quantity) {
        throw new Error('Missing required fields: user_id, coin, address, quantity');
    }
    
    // Generate record ID
    const id = 'withdrawal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();
    const created_at = new Date().toISOString();
    
    // Create record object
    const record = {
        id,
        user_id,
        coin,
        address,
        quantity: parseFloat(quantity),
        status,
        timestamp,
        created_at
    };
    
    // Read existing records
    let records = [];
    try {
        const data = fs.readFileSync(WITHDRAWAL_DB, 'utf8');
        records = JSON.parse(data);
    } catch (e) {
        records = [];
    }
    
    // Add new record
    records.push(record);
    
    // Write back to file
    fs.writeFileSync(WITHDRAWAL_DB, JSON.stringify(records, null, 2));
    
    return record;
}

/**
 * Get all withdrawal records for a user
 * @param {String} user_id - User ID
 * @returns {Array} - Array of withdrawal records
 */
function getUserWithdrawalRecords(user_id) {
    initWithdrawalDB();
    
    try {
        const data = fs.readFileSync(WITHDRAWAL_DB, 'utf8');
        const records = JSON.parse(data);
        
        // Filter records by user_id
        const userRecords = records.filter(record => record.user_id === user_id);
        
        // Return records in reverse chronological order (newest first)
        return userRecords.reverse();
    } catch (e) {
        console.error('Error reading withdrawal records:', e.message);
        return [];
    }
}

/**
 * Get all withdrawal records
 * @returns {Array} - Array of all withdrawal records
 */
function getAllWithdrawalRecords() {
    initWithdrawalDB();
    
    try {
        const data = fs.readFileSync(WITHDRAWAL_DB, 'utf8');
        const records = JSON.parse(data);
        return records.reverse();
    } catch (e) {
        console.error('Error reading withdrawal records:', e.message);
        return [];
    }
}

/**
 * Update withdrawal record status
 * @param {String} id - Withdrawal record ID
 * @param {String} status - New status (pending, approved, rejected)
 * @returns {Object} - Updated record or null if not found
 */
function updateWithdrawalStatus(id, status) {
    initWithdrawalDB();
    
    try {
        let records = [];
        const data = fs.readFileSync(WITHDRAWAL_DB, 'utf8');
        records = JSON.parse(data);
        
        // Find and update record
        const record = records.find(r => r.id === id);
        if (record) {
            record.status = status;
            fs.writeFileSync(WITHDRAWAL_DB, JSON.stringify(records, null, 2));
            return record;
        }
        return null;
    } catch (e) {
        console.error('Error updating withdrawal record:', e.message);
        return null;
    }
}

module.exports = {
    saveWithdrawalRecord,
    getUserWithdrawalRecords,
    getAllWithdrawalRecords,
    updateWithdrawalStatus
};
