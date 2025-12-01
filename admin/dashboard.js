let selectedUserId = null;
let allUsers = [];

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Logout
$('#logoutBtn').on('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminId');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminId');
        window.location.href = 'login.html';
    }
});

// Load users on page load
function loadUsers() {
    $.ajax({
        url: '/api/admin/users',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
        },
        success: function(response) {
            if (response.success) {
                allUsers = response.users;
                displayUsers(allUsers);
            }
        },
        error: function(err) {
            console.error('Failed to load users:', err);
            if (err.status === 401) {
                window.location.href = 'login.html';
            }
            $('#userList').html('<div class="no-user">Failed to load users</div>');
        }
    });
}

function displayUsers(users) {
    const userList = $('#userList');
    userList.empty();

    if (users.length === 0) {
        userList.html('<div class="no-user">No users found</div>');
        return;
    }

    users.forEach(user => {
        const userItem = $(`
            <div class="user-item" data-user-id="${user.userid}">
                <strong>User #${user.userid}</strong>
                <small>Created: ${new Date(user.created_at).toLocaleDateString()}</small>
            </div>
        `);

        userItem.on('click', function() {
            selectUser(user.userid);
        });

        userList.append(userItem);
    });
}

function selectUser(userId) {
    selectedUserId = userId;
    $('.user-item').removeClass('active');
    $(`.user-item[data-user-id="${userId}"]`).addClass('active');

    loadUserDetails(userId);
}

function loadUserDetails(userId) {
    $.ajax({
        url: `/api/admin/user-stats?user_id=${userId}`,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
        },
        success: function(response) {
            if (response.success) {
                displayUserDetails(response.user, response.stats);
            }
        },
        error: function(err) {
            console.error('Failed to load user details:', err);
            if (err.status === 401) {
                window.location.href = 'login.html';
            }
            showMessage('Failed to load user details', 'error');
        }
    });
}

function displayUserDetails(user, stats) {
    $('#noUserSelected').hide();
    $('#userDetails').show();

    $('#detailUserId').text(user.userid);
    $('#statTopups').text(stats.topupTotal || 0);
    $('#statWithdrawals').text(stats.withdrawalTotal || 0);

    // Display balances
    const balanceDisplay = $('#balanceDisplay');
    balanceDisplay.empty();

    const coins = ['USDT', 'BTC', 'ETH', 'USDC', 'PYUSD', 'SOL'];
    coins.forEach(coin => {
        const amount = user.balances[coin.toLowerCase()] || 0;
        const balanceItem = $(`
            <div class="balance-item">
                <div class="coin">${coin}</div>
                <div class="amount">${parseFloat(amount).toFixed(2)}</div>
            </div>
        `);
        balanceDisplay.append(balanceItem);
    });
}

// Tab switching
$('.tab').on('click', function() {
    const tabName = $(this).data('tab');
    $('.tab').removeClass('active');
    $('.tab-content').removeClass('active');
    $(this).addClass('active');
    $(`#tab-${tabName}`).addClass('active');
});

// Update Balance Form
$('#updateBalanceForm').on('submit', function(e) {
    e.preventDefault();
    const coin = $('#coinSelect').val();
    const amount = $('#newAmount').val();

    if (!selectedUserId || !coin || !amount) {
        showMessage('Please fill all fields', 'error');
        return;
    }

    $.ajax({
        url: '/api/admin/update-balance',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
        },
        data: JSON.stringify({
            user_id: selectedUserId,
            coin: coin,
            amount: parseFloat(amount)
        }),
        success: function(response) {
            if (response.success) {
                showMessage(`Balance updated for ${coin}`, 'success');
                loadUserDetails(selectedUserId);
                $('#updateBalanceForm')[0].reset();
            }
        },
        error: function(err) {
            if (err.status === 401) {
                window.location.href = 'login.html';
            }
            showMessage('Failed to update balance', 'error');
        }
    });
});

// Add Top-up Form
$('#addTopupForm').on('submit', function(e) {
    e.preventDefault();
    const coin = $('#topupCoin').val();
    const amount = $('#topupAmount').val();

    if (!selectedUserId || !coin || !amount) {
        showMessage('Please fill all fields', 'error');
        return;
    }

    $.ajax({
        url: '/api/admin/add-topup',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
        },
        data: JSON.stringify({
            user_id: selectedUserId,
            coin: coin,
            amount: parseFloat(amount)
        }),
        success: function(response) {
            if (response.success) {
                showMessage(`Top-up added for ${coin}`, 'success');
                loadUserDetails(selectedUserId);
                $('#addTopupForm')[0].reset();
            }
        },
        error: function(err) {
            if (err.status === 401) {
                window.location.href = 'login.html';
            }
            showMessage('Failed to add top-up', 'error');
        }
    });
});

// Add Withdrawal Form
$('#addWithdrawalForm').on('submit', function(e) {
    e.preventDefault();
    const coin = $('#withdrawalCoin').val();
    const address = $('#withdrawalAddress').val();
    const quantity = $('#withdrawalQuantity').val();

    if (!selectedUserId || !coin || !address || !quantity) {
        showMessage('Please fill all fields', 'error');
        return;
    }

    $.ajax({
        url: '/api/admin/add-withdrawal',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
        },
        data: JSON.stringify({
            user_id: selectedUserId,
            coin: coin,
            address: address,
            quantity: parseFloat(quantity)
        }),
        success: function(response) {
            if (response.success) {
                showMessage(`Withdrawal added for ${coin}`, 'success');
                loadUserDetails(selectedUserId);
                $('#addWithdrawalForm')[0].reset();
            }
        },
        error: function(err) {
            if (err.status === 401) {
                window.location.href = 'login.html';
            }
            showMessage('Failed to add withdrawal', 'error');
        }
    });
});

// User search
$('#userSearch').on('keyup', function() {
    const searchTerm = $(this).val().toLowerCase();
    const filteredUsers = allUsers.filter(user => {
        return user.userid.toLowerCase().includes(searchTerm);
    });
    displayUsers(filteredUsers);
});

function showMessage(message, type) {
    const messageBox = $('#message');
    messageBox.removeClass('success error');
    messageBox.addClass(type);
    messageBox.text(message).show();
    setTimeout(() => messageBox.fadeOut(), 3000);
}

// Initialize
$(document).ready(function() {
    checkAuth();
    loadUsers();
});
