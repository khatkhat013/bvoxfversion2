/**
 * Auth Check - Redirect to wallet connect if not authenticated
 * Include this in pages that require authentication
 */

function checkAndRequireAuth() {
    const uid = getCookie('userid');
    
    if (!uid) {
        // Redirect to wallet connect page
        window.location.href = 'wallet-connect.html';
        return false;
    }
    
    return true;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Auto-check on page load if data attribute is set
document.addEventListener('DOMContentLoaded', function() {
    const htmlElement = document.documentElement;
    if (htmlElement.getAttribute('data-require-auth') === 'true') {
        checkAndRequireAuth();
    }
});
