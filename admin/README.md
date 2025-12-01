# Admin Dashboard

Admin dashboard for managing users, balances, and transactions.

## File Structure

```
admin/
├── index.html        # Entry point (redirects to login/dashboard)
├── login.html        # Admin login page
├── register.html     # Admin registration page
├── dashboard.html    # Main admin dashboard
├── dashboard.js      # Dashboard logic and API calls
├── style.css         # Styling
└── README.md         # This file
```

## Accessing the Admin Dashboard

- **Entry Point**: `http://localhost:3000/admin/`
- **Login**: `http://localhost:3000/admin/login.html`
- **Register**: `http://localhost:3000/admin/register.html`
- **Dashboard**: `http://localhost:3000/admin/dashboard.html`

## Features

### Authentication
- **Admin Registration** - Create new admin accounts with secure password requirements
- **Admin Login** - Authenticate and receive JWT-like tokens
- **Session Management** - Remember me functionality or session-based storage
- **Logout** - Securely logout and clear authentication tokens

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&*)

### User Management
- **View All Users** - List all registered users with search functionality
- **User Details** - View user information and transaction history
- **Balance Management** - Update user balances for any supported cryptocurrency

### Supported Coins
- USDT
- BTC
- ETH
- USDC
- PYUSD
- SOL

### Operations
- **Update Balance** - Directly set user balance for any coin
- **Add Top-up** - Credit a user's account with coins
- **Add Withdrawal** - Record a withdrawal transaction for a user
- **View Statistics** - See transaction totals and user statistics

## API Endpoints

### Authentication
- `POST /api/admin/register` - Register new admin account
- `POST /api/admin/login` - Login and receive token

### User Management
- `GET /api/admin/users` - Fetch all users
- `GET /api/admin/user-stats?user_id=<id>` - Get user details and statistics
- `POST /api/admin/update-balance` - Update user balance
- `POST /api/admin/add-topup` - Add top-up record
- `POST /api/admin/add-withdrawal` - Add withdrawal record
- `POST /api/admin/delete-transaction` - Delete transaction record

## Default Admin Account

Username: `admin`
Password: `Admin123!`

**Note**: Change this password after first login in production.

## Development

The admin dashboard uses:
- jQuery for AJAX and DOM manipulation
- Responsive CSS Grid layout
- JWT-like tokens for authentication
- RESTful API for backend communication
- localStorage/sessionStorage for token management

## Security Features

- Password hashing using SHA256
- Token expiration (24 hours)
- Token verification on protected endpoints
- Session-based or persistent login options
- Password strength validation on registration

## Troubleshooting

### Can't login
- Verify username and password are correct
- Check if admin account exists in admins.json
- Verify the server is running

### Password requirements not met
- Ensure password has at least 8 characters
- Include uppercase letter, number, and special character
- Try a password like: `Admin123!`

### Dashboard not loading after login
- Check browser console for errors
- Verify token is stored in localStorage/sessionStorage
- Try clearing browser cache and logging in again

