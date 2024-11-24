// Initialize EmailJS (put your actual public key)
(function() {
    emailjs.init("Du3lYdEFe4AAaU540");
})();

// JSONBin configuration with working API key
const JSONBIN_API_KEY = "$2a$10$ecN6fjgbGla2pDCn7zYV1uaxDxNAQ.8chczGAcSCuGMQAFhPcXhEC";
const JSONBIN_BIN_ID = "6730c801ad19ca34f8c785b1";

document.addEventListener('DOMContentLoaded', function() {
    // Check if user already registered
    const userData = JSON.parse(localStorage.getItem('userData'));
    const signupBtn = document.querySelector('.signup-btn');
    
    if (userData) {
        signupBtn.textContent = `Welcome back, ${userData.firstName}`;
        signupBtn.classList.add('registered');
        
        // Remove any existing click listeners
        signupBtn.replaceWith(signupBtn.cloneNode(true));
        
        // Add new click listener for registered users
        document.querySelector('.signup-btn').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showToast('You are already registered!', 'info');
        });
    } else {
        // Only add signup modal listener if user is not registered
        signupBtn.addEventListener('click', function() {
            const modal = document.getElementById('signupModal');
            modal.classList.add('active');
        });
    }

    const targetDate = new Date('December 22, 2024 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM elements
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }

    // Update countdown immediately and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    document.querySelector('.close-btn').addEventListener('click', function() {
        const modal = document.getElementById('signupModal');
        modal.classList.remove('active');
    });

    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;

        try {
            // Save to local storage
            localStorage.setItem('userData', JSON.stringify({
                firstName,
                lastName,
                email
            }));

            // Save email to JSONBin
            await saveEmailToJSONBin(email);

            // Send welcome email
            await sendWelcomeEmail(firstName, email);

            // Close signup modal
            document.getElementById('signupModal').classList.remove('active');

            // Show success modal
            const successModal = document.querySelector('.success-modal');
            successModal.style.display = 'block';
            setTimeout(() => {
                successModal.classList.add('show');
            }, 10);
            
            // Update signup button
            const signupBtn = document.querySelector('.signup-btn');
            signupBtn.textContent = `Welcome back, ${firstName}`;
            signupBtn.classList.add('registered');

        } catch (error) {
            console.error('Registration error:', error);
            showToast('Registration failed. Please try again.', 'error');
        }
    });

    // Close modal if clicking outside the form
    document.getElementById('signupModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

async function saveEmailToJSONBin(email) {
    try {
        // Get current emails
        const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        if (!getResponse.ok) {
            throw new Error(`Failed to fetch: ${getResponse.status}`);
        }

        const data = await getResponse.json();
        let emails = data.record.emails || [];
        
        // Add new email if not exists
        if (!emails.includes(email)) {
            emails.push(email);
            
            // Update JSONBin
            const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify({ emails: emails })
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update JSONBin');
            }
        }
        
        return true;
    } catch (error) {
        console.error('JSONBin error:', error);
        throw new Error('Failed to save email');
    }
}

async function sendWelcomeEmail(name, email) {
    try {
        await emailjs.send(
            'service_jpmpjhn',
            'template_8279m3r',
            {
                to_name: name,
                to_email: email
            }
        );
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send welcome email');
    }
}

function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Update the button click handler in HTML