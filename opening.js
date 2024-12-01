// Initialize EmailJS
(function() {
    emailjs.init("Du3lYdEFe4AAaU540"); // Add your EmailJS public key here
})();

// Configuration
const config = {
    jsonBinId: '674bf7c5ad19ca34f8d373c9',
    jsonBinApiKey: '$2a$10$2Ek9aJESqmae0JuYhOa7yuEwHkXiJtXhEhNDRQ/.gbdMr0sl2J52e', // Add your JSONBin master key here
    emailJsTemplateId: 'template_dxcjevh' // Add your EmailJS template ID here
};

// Fetch whitelisted emails
async function fetchWhitelistedEmails() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${config.jsonBinId}`, {
            headers: {
                'X-Master-Key': config.jsonBinApiKey
            }
        });
        const data = await response.json();
        return data.record.emails;
    } catch (error) {
        console.error('Error fetching emails:', error);
        return [];
    }
}

// Display emails in the UI
function displayEmails(emails) {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';
    
    const totalEmails = document.getElementById('totalEmails');
    totalEmails.textContent = emails.length;
    
    emails.forEach((email, index) => {
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';
        emailItem.style.animationDelay = `${index * 0.1}s`;
        
        emailItem.innerHTML = `
            <div class="email-content">
                <span class="email-number">#${index + 1}</span>
                <i class="fas fa-envelope"></i>
                <span class="email-address">${email}</span>
            </div>
            <div class="email-status">
                <span class="status-badge">
                    <i class="fas fa-check-circle"></i> Whitelisted
                </span>
                <span class="timestamp">
                    <i class="fas fa-clock"></i> ${new Date().toLocaleDateString()}
                </span>
            </div>
        `;
        
        emailList.appendChild(emailItem);
    });
}

// Send notifications
async function sendNotifications(emails) {
    const loading = document.getElementById('loading');
    loading.classList.add('active');

    try {
        for (const email of emails) {
            await emailjs.send(
                'service_jpmpjhn', // Add your EmailJS service ID
                config.emailJsTemplateId,
                {
                    to_email: email,
                    // Add other template parameters as needed
                }
            );
        }
        alert('Notifications sent successfully!');
    } catch (error) {
        console.error('Error sending notifications:', error);
        alert('Error sending notifications. Please try again.');
    } finally {
        loading.classList.remove('active');
    }
}

// Initialize the page
async function init() {
    const emails = await fetchWhitelistedEmails();
    displayEmails(emails);

    document.getElementById('sendNotification').addEventListener('click', () => {
        sendNotifications(emails);
    });
}

// Create particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and size
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 5 + 'px';
        particle.style.height = particle.style.width;
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 3 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles on load
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    init();
});
