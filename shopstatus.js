// Shop Status Configuration
const JSONBIN_API_KEY = '$2a$10$ecN6fjgbGla2pDCn7zYV1uaxDxNAQ.8chczGAcSCuGMQAFhPcXhEC'; // Replace with your actual JSONBin API key
const JSONBIN_BIN_ID = '673b2043acd3cb34a8aa76d6'; // Replace with your actual bin ID
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`;

// HTML templates
const CLOSED_SHOP_HTML = `
    <div style="height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column; background: #f5f5f5;">
        <img src="https://raw.githubusercontent.com/Sambath99/anxiety/refs/heads/main/img/logo2.png" alt="Anxiety Logo" style="width: 200px; margin-bottom: 2rem;">
        <h1 style="color: #333; margin-bottom: 1rem;">Shop is Currently Closed</h1>
        <p style="color: #666; text-align: center; max-width: 500px;">We're temporarily closed. Please check back later or follow our social media for updates.</p>
        <div style="margin-top: 2rem;">
            <a href="https://instagram.com/anxiety" style="color: #42569C; margin: 0 1rem;"><i class="fab fa-instagram"></i></a>
            <a href="https://facebook.com/anxiety" style="color: #42569C; margin: 0 1rem;"><i class="fab fa-facebook"></i></a>
            <a href="https://twitter.com/anxiety" style="color: #42569C; margin: 0 1rem;"><i class="fab fa-twitter"></i></a>
        </div>
    </div>
`;

// Loading template
const LOADING_HTML = `
    <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
        <img src="https://raw.githubusercontent.com/Sambath99/anxiety/refs/heads/main/img/logo2.png" alt="Anxiety Logo" style="width: 150px;">
    </div>
`;

// Hide all content initially
document.body.style.display = 'none';

async function checkShopStatus() {
    try {
        const response = await fetch(JSONBIN_URL, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch shop status');
        }

        const data = await response.json();
        const { status, whitelist } = data.record;

        // Check shop status
        if (status === 0) {
            // Shop is closed
            document.body.innerHTML = CLOSED_SHOP_HTML;
            document.body.style.display = 'block';
            return;
        }

        // Check whitelist status
        if (whitelist === 1) {
            // Redirect immediately to registration page
            window.location.href = '/register.html';
            return;
        }

        // If shop is open and no whitelist, show the original content
        document.body.style.display = 'block';

    } catch (error) {
        console.error('Error checking shop status:', error);
        // Optionally handle error state
    }
}

// Check status when page loads
document.addEventListener('DOMContentLoaded', checkShopStatus);

// Optional: Periodically check status (every 5 minutes)
setInterval(checkShopStatus, 300000); 