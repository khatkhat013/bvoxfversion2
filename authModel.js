const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Data file path
const adminsFile = path.join(__dirname, '..', 'admins.json');

/**
 * Hash password
 */
function hashPassword(password) {
    return crypto.createHash('sha256').update(password + 'BVOX_SALT_2024').digest('hex');
}

/**
 * Generate JWT-like token (simple implementation)
 */
function generateToken(adminId) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({
        adminId: adminId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    })).toString('base64');
    const signature = crypto.createHmac('sha256', 'BVOX_SECRET_2024')
        .update(`${header}.${payload}`)
        .digest('base64');
    
    return `${header}.${payload}.${signature}`;
}

/**
 * Verify token
 */
function verifyToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const [header, payload, signature] = parts;
        const expectedSignature = crypto.createHmac('sha256', 'BVOX_SECRET_2024')
            .update(`${header}.${payload}`)
            .digest('base64');

        if (signature !== expectedSignature) return null;

        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        if (decoded.exp < Math.floor(Date.now() / 1000)) return null; // Token expired

        return decoded;
    } catch (e) {
        return null;
    }
}

/**
 * Get all admins
 */
function getAllAdmins() {
    try {
        if (!fs.existsSync(adminsFile)) {
            return [];
        }
        const data = fs.readFileSync(adminsFile, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading admins:', e);
        return [];
    }
}

/**
 * Get admin by username
 */
function getAdminByUsername(username) {
    const admins = getAllAdmins();
    return admins.find(a => a.username === username);
}

/**
 * Get admin by ID
 */
function getAdminById(adminId) {
    const admins = getAllAdmins();
    return admins.find(a => a.id === adminId);
}

/**
 * Register new admin
 */
function registerAdmin(fullname, username, email, password) {
    const admins = getAllAdmins();

    // Check if username already exists
    if (admins.find(a => a.username === username)) {
        throw new Error('Username already exists');
    }

    // Check if email already exists
    if (admins.find(a => a.email === email)) {
        throw new Error('Email already registered');
    }

    const admin = {
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
        fullname: fullname,
        username: username,
        email: email,
        password: hashPassword(password),
        created_at: new Date().toISOString(),
        status: 'active',
        lastLogin: null
    };

    admins.push(admin);
    fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2));

    return admin;
}

/**
 * Login admin
 */
function loginAdmin(username, password) {
    const admin = getAdminByUsername(username);

    if (!admin) {
        throw new Error('Invalid username or password');
    }

    const hashedPassword = hashPassword(password);
    if (admin.password !== hashedPassword) {
        throw new Error('Invalid username or password');
    }

    if (admin.status !== 'active') {
        throw new Error('Account is not active');
    }

    // Update last login
    const admins = getAllAdmins();
    const adminIndex = admins.findIndex(a => a.id === admin.id);
    admins[adminIndex].lastLogin = new Date().toISOString();
    fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2));

    // Generate token
    const token = generateToken(admin.id);

    return {
        adminId: admin.id,
        username: admin.username,
        fullname: admin.fullname,
        token: token
    };
}

/**
 * Change password
 */
function changePassword(adminId, oldPassword, newPassword) {
    const admin = getAdminById(adminId);

    if (!admin) {
        throw new Error('Admin not found');
    }

    const oldHashedPassword = hashPassword(oldPassword);
    if (admin.password !== oldHashedPassword) {
        throw new Error('Old password is incorrect');
    }

    const admins = getAllAdmins();
    const adminIndex = admins.findIndex(a => a.id === adminId);
    admins[adminIndex].password = hashPassword(newPassword);
    fs.writeFileSync(adminsFile, JSON.stringify(admins, null, 2));

    return admins[adminIndex];
}

module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminById,
    getAdminByUsername,
    getAllAdmins,
    changePassword,
    generateToken,
    verifyToken,
    hashPassword
};
