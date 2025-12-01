const fs = require('fs');
const path = require('path');

// Data file path
const dataFile = path.join(__dirname, 'exchange_records.json');

/**
 * Initialize exchange records file if it doesn't exist
 */
function initializeFile() {
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
    }
}

/**
 * Read all exchange records from file
 */
function getAllRecords() {
    initializeFile();
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading exchange records:', e);
        return [];
    }
}

/**
 * Write records to file
 */
function writeRecords(records) {
    fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));
}

/**
 * Save an exchange record
 * @param {Object} data - { user_id, from_coin, to_coin, from_amount, to_amount, status }
 * @returns {Object} saved record with id and timestamps
 */
function saveExchangeRecord(data) {
    const { user_id, from_coin, to_coin, from_amount, to_amount, status = 'completed' } = data;
    
    const records = getAllRecords();
    
    const record = {
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
        user_id,
        from_coin: from_coin.toUpperCase(),
        to_coin: to_coin.toUpperCase(),
        from_amount: parseFloat(from_amount),
        to_amount: parseFloat(to_amount),
        status,
        created_at: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    records.push(record);
    writeRecords(records);
    
    console.error('[exchange-record] Saved:', record.id);
    return record;
}

/**
 * Get user's exchange records
 * @param {string} user_id - user ID
 * @returns {Array} user's exchange records in reverse chronological order
 */
function getUserExchangeRecords(user_id) {
    const records = getAllRecords();
    const userRecords = records.filter(r => r.user_id === user_id);
    
    // Sort by timestamp in descending order (newest first)
    return userRecords.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get all exchange records (admin function)
 * @returns {Array} all exchange records
 */
function getAllExchangeRecords() {
    return getAllRecords().sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Update exchange record status
 * @param {string} id - record ID
 * @param {string} status - new status
 * @returns {Object|null} updated record or null if not found
 */
function updateExchangeStatus(id, status) {
    const records = getAllRecords();
    const record = records.find(r => r.id === id);
    
    if (record) {
        record.status = status;
        writeRecords(records);
        return record;
    }
    
    return null;
}

module.exports = {
    saveExchangeRecord,
    getUserExchangeRecords,
    getAllExchangeRecords,
    updateExchangeStatus
};
