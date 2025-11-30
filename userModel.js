// userModel.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function registerUser({ address, session, token, ip, user_agent }) {
    const users = loadUsers();
    const id = uuidv4();
    const timestamp = Date.now();
    const user = { id, address, session, token, ip, user_agent, timestamp };
    users.push(user);
    saveUsers(users);
    return user;
}

module.exports = { registerUser };
