document.addEventListener('DOMContentLoaded', () => {
    // Debug logging for cart data
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Initial cart data:', cart);
    
    // Display cart items
    displayCartItems(cart);
    
    // Handle form submission
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
    
    // Add this to your existing JavaScript
    document.querySelectorAll('.payment-option').forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            document.querySelectorAll('.payment-option').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Get the payment method from data attribute
            const paymentMethod = this.dataset.payment;
            
            // Add a hidden input to store the selected payment method
            let paymentInput = document.getElementById('selected-payment');
            if (!paymentInput) {
                paymentInput = document.createElement('input');
                paymentInput.type = 'hidden';
                paymentInput.id = 'selected-payment';
                document.getElementById('checkout-form').appendChild(paymentInput);
            }
            paymentInput.value = paymentMethod;
        });
    });
    
    let map, marker, satelliteLayer, streetLayer;

    function initMap() {
        // Create map centered on Phnom Penh
        map = L.map('map', {
            zoomControl: false  // Move zoom control to right side
        }).setView([11.5564, 104.9282], 13);
        
        // Add street layer
        streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        });

        // Add satellite layer
        satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        // Add satellite layer by default
        satelliteLayer.addTo(map);

        // Add layer control
        L.control.layers({
            'Satellite': satelliteLayer,
            'Street': streetLayer
        }, null, {
            position: 'bottomright'
        }).addTo(map);

        // Move zoom control to right side
        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        // Add a marker
        marker = L.marker([11.5564, 104.9282], {
            draggable: true
        }).addTo(map);

        // Add search control
        L.Control.geocoder({
            defaultMarkGeocode: false,
            position: 'topleft',
            placeholder: 'Search location...',
            geocoder: L.Control.Geocoder.nominatim({
                geocodingQueryParams: {
                    'accept-language': 'en'
                }
            })
        })
        .on('markgeocode', function(e) {
            const latlng = e.geocode.center;
            marker.setLatLng(latlng);
            map.setView(latlng, 16);
            updateCoordinates(latlng);
        })
        .addTo(map);

        // Update coordinates when marker is dragged
        marker.on('dragend', function(e) {
            updateCoordinates(e.target.getLatLng());
        });

        // Try to get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setView(pos, 16);
                    marker.setLatLng(pos);
                    updateCoordinates(pos);
                },
                () => {
                    console.log('Error: The Geolocation service failed.');
                }
            );
        }

        // Handle map click
        map.on('click', function(e) {
            marker.setLatLng(e.latlng);
            updateCoordinates(e.latlng);
        });
    }

    function updateCoordinates(position) {
        const coords = `${position.lat},${position.lng}`;
        document.getElementById('selected-coordinates').value = coords;
    }

    initMap();
});

function displayCartItems(cart) {
    const cartItemsContainer = document.querySelector('.cart-items');
    let subtotal = 0;
    
    // Add debug logging
    console.log('Displaying cart items:', cart);
    
    if (!cart || cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => {
        const quantity = item.quantity || 1;
        const itemTotal = item.price * quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='img/placeholder.png';">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>Quantity: ${quantity}</p>
                    <p>Price: $${item.price.toFixed(2)}</p>
                </div>
                <div class="item-total">
                    $${itemTotal.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');
    
    // Update totals with delivery fee
    updateTotals(subtotal);
}

function updateTotals(subtotal) {
    const deliveryFee = 2.00; // Fixed $2 delivery fee
    const subtotalElement = document.querySelector('.subtotal .amount');
    const totalElement = document.querySelector('.total .amount');
    const deliveryElement = document.querySelector('.delivery .amount');
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    deliveryElement.textContent = `$${deliveryFee.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + deliveryFee).toFixed(2)}`;
}

// Toast notification function
function showToast(message, type = 'error') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'error' ? "#ff6b6b" : "#51cf66",
        stopOnFocus: true
    }).showToast();
}

// Form validation function
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name.trim()) {
        errors.push("Please enter your full name");
    }
    
    if (!formData.phone.trim()) {
        errors.push("Please enter your phone number");
    } else if (!/^\d{9,10}$/.test(formData.phone.replace(/\D/g, ''))) {
        errors.push("Please enter a valid phone number");
    }
    
    if (!formData.address.trim()) {
        errors.push("Please enter your delivery address");
    }
    
    // Check if payment method is selected
    const selectedPayment = document.getElementById('selected-payment')?.value;
    if (!selectedPayment) {
        errors.push("Please select a payment method");
    }
    
    return errors;
}

let qrCheckInterval;
let timerInterval;

function showQRCode(amount) {
    console.log('Showing QR code for amount:', amount);
    
    // Create modal if it doesn't exist
    let modal = document.querySelector('.qr-modal');
    if (!modal) {
        console.log('Creating new QR modal');
        modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <span class="close-qr">&times;</span>
            <div class="qr-content">
                <h3>Scan QR Code to Pay</h3>
                <div class="timer">03:00</div>
                <img id="qr-image" alt="QR Code">
                <p>Please scan this QR code with your ABA mobile app</p>
            </div>
        `;
        document.body.appendChild(modal);

        // Add close button handler
        modal.querySelector('.close-qr').addEventListener('click', closeQRModal);
    }

    // Show modal
    console.log('Displaying QR modal');
    modal.style.display = 'flex';

    // Fetch QR code from your local API
    console.log('Fetching QR code from API');
    fetch(`http://167.88.167.179:8800/${amount}`)
        .then(response => response.json())
        .then(data => {
            console.log('QR code received:', data);
            document.getElementById('qr-image').src = `data:image/png;base64,${data.qr}`;
            startQRCheck(data.md5);
            startTimer();
        })
        .catch(error => {
            console.error('Error fetching QR code:', error);
            showToast('Failed to generate QR code', 'error');
            closeQRModal();
        });
}

function closeQRModal() {
    const modal = document.querySelector('.qr-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    clearInterval(qrCheckInterval);
    clearInterval(timerInterval);
}

function startQRCheck(md5) {
    clearInterval(qrCheckInterval);
    qrCheckInterval = setInterval(() => {
        fetch(`http://167.88.167.179:8800/check_transaction/${md5}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'successful') {
                    clearInterval(qrCheckInterval);
                    clearInterval(timerInterval);

                    // Get form and cart data for notification
                    const coordinates = document.getElementById('selected-coordinates').value;
                    const mapLink = `https://www.google.com/maps?q=${coordinates}`;
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const formData = {
                        name: document.getElementById('name').value,
                        phone: document.getElementById('phone').value,
                        address: document.getElementById('address').value
                    };

                    // Send Telegram notification
                    const telegramMessage = `
🌟 *New Order #${Date.now().toString().slice(-4)}*

👤 *Customer Details*
▪️ Name: ${formData.name}
▪️ Phone: ${formData.phone}
▪️ Address: ${formData.address}
▪️ Location: ${mapLink}

💳 *Payment Information*
▪️ Method: ABA (Payment Completed)
▪️ Total: $${parseFloat(document.querySelector('.total .amount').textContent.replace('$', '')).toFixed(2)}

🛍️ *Order Items*
${cart.map(item => `▪️ ${item.name}
   Size: ${item.size} | Qty: ${item.quantity || 1} | Price: $${(item.price * (item.quantity || 1)).toFixed(2)}`).join('\n')}

📊 *Order Summary*
▪️ Total Items: ${cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
▪️ Status: 🟡 Paid
▪️ Time: ${new Date().toLocaleString('en-US', { 
    timeZone: 'Asia/Phnom_Penh',
    dateStyle: 'medium',
    timeStyle: 'short'
})}`;

                    fetch(`https://api.telegram.org/bot8176551618:AAGZy2gxoXfxIjCnczbsGYzBeTGxsB6p-Jw/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: '1046129729',
                            text: telegramMessage,
                            parse_mode: 'Markdown'
                        })
                    });

                    showToast('Payment successful!', 'success');
                    setTimeout(() => {
                        localStorage.removeItem('cart');
                        window.location.href = 'shoptest1.html.html';
                    }, 2000);
                }
            })
            .catch(error => console.error('Error checking transaction:', error));
    }, 3000); // Check every 3 seconds
}

function startTimer() {
    let timeLeft = 180; // 3 minutes in seconds
    const timerElement = document.querySelector('.timer');
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            clearInterval(qrCheckInterval);
            closeQRModal();
            showToast('Payment time expired. Please try again.', 'error');
        }
    }, 1000);
}

// Update the handleCheckout function
async function handleCheckout(e) {
    e.preventDefault();
    
    const coordinates = document.getElementById('selected-coordinates').value;
    const mapLink = `https://www.google.com/maps?q=${coordinates}`;
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        mapLink: mapLink,
        coordinates: coordinates,
        paymentMethod: document.getElementById('selected-payment')?.value
    };
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        errors.forEach(error => showToast(error));
        return;
    }
    
    // Get cart data
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
    }

    // Check if it's ABA payment first
    if (formData.paymentMethod === 'aba') {
        const total = parseFloat(document.querySelector('.total .amount').textContent.replace('$', ''));
        showQRCode(total);
        return; // Stop here for ABA payments
    }
    
    // Show loading state
    const submitButton = document.querySelector('.place-order-btn');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
        // Create new order object
        const newOrder = {
            ...formData,
            items: cart,
            orderDate: new Date().toISOString(),
            orderTotal: parseFloat(document.querySelector('.total .amount').textContent.replace('$', '')),
            status: 'pending',
            orderId: Date.now()
        };

        // Enhanced Discord webhook message
        const discordMessage = {
            embeds: [{
                title: "🌟 New Order Received! #" + newOrder.orderId.toString().slice(-4),
                description: "```A new order has been placed through the website```",
                color: 0x2ECC71, // Professional green color
                fields: [
                    {
                        name: "👤 Customer Details",
                        value: [
                            `**Name:** ${formData.name}`,
                            `**Phone:** ${formData.phone}`,
                            `**Address:** ${formData.address}`,
                            `**Location:** [View on Map](${mapLink})`
                        ].join('\n'),
                        inline: false
                    },
                    {
                        name: "💳 Payment Information",
                        value: `**Method:** ${formData.paymentMethod.toUpperCase()}\n**Total Amount:** $${newOrder.orderTotal.toFixed(2)}`,
                        inline: false
                    },
                    {
                        name: "🛍️ Order Items",
                        value: cart.map(item => 
                            `• **${item.name}**\n  └ Size: ${item.size} | Qty: ${item.quantity || 1} | Price: $${(item.price * (item.quantity || 1)).toFixed(2)}`
                        ).join('\n'),
                        inline: false
                    }
                ],
                thumbnail: {
                    url: "https://sambath99.github.io/anxiety/img/logo.PNG" // Replace with your store's logo
                },
                footer: {
                    text: "Anxiety Store | Order Management System",
                    icon_url: "https://i.imgur.com/AfFp7pu.png" // Replace with your store's icon
                },
                timestamp: new Date().toISOString(),
                author: {
                    name: "🛍️ Anxiety Store",
                    url: "https://sambath99.github.io/anxiety/"
                }
            }]
        };

        // Create Telegram message
        const telegramMessage = `
🌟 *New Order #${newOrder.orderId.toString().slice(-4)}*

👤 *Customer Details*
▪️ Name: ${formData.name}
▪️ Phone: ${formData.phone}
▪️ Address: ${formData.address}
▪️ Location: ${mapLink}

💳 *Payment Information*
▪️ Method: ${formData.paymentMethod.toUpperCase()}
▪️ Total: $${newOrder.orderTotal.toFixed(2)}

🛍️ *Order Items*
${cart.map(item => `▪️ ${item.name}
   Size: ${item.size} | Qty: ${item.quantity || 1} | Price: $${(item.price * (item.quantity || 1)).toFixed(2)}`).join('\n')}

📊 *Order Summary*
▪️ Total Items: ${cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
▪️ Status: 🟡 Pending
▪️ Time: ${new Date().toLocaleString('en-US', { 
    timeZone: 'Asia/Phnom_Penh',
    dateStyle: 'medium',
    timeStyle: 'short'
})}`;

        // Execute all three API calls simultaneously
        const [binData, discordResponse, telegramResponse] = await Promise.all([
            // Get existing orders from JSONBin
            fetch('https://api.jsonbin.io/v3/b/672f62feacd3cb34a8a58d90', {
                headers: {
                    'X-Master-Key': '$2a$10$ecN6fjgbGla2pDCn7zYV1uaxDxNAQ.8chczGAcSCuGMQAFhPcXhEC'
                }
            }).then(res => res.json()),
            
            // Send Discord webhook
            fetch('https://discord.com/api/webhooks/1305036953468796928/4ZIYHJjTqjJplpaRT9jJ5JfoQvgKg37rXjq6WRmFSJHOxdjqY6jn78Rkfuw54vOQ1VUJ', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordMessage)
            }),

            // Send Telegram message
            fetch(`https://api.telegram.org/bot8176551618:AAGZy2gxoXfxIjCnczbsGYzBeTGxsB6p-Jw/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: '1046129729',
                    text: telegramMessage,
                    parse_mode: 'Markdown'
                })
            })
        ]);

        // Update JSONBin with new order
        const existingOrders = Array.isArray(binData.record) ? binData.record : [];
        const updatedOrders = [...existingOrders, newOrder];
        
        await fetch('https://api.jsonbin.io/v3/b/672f62feacd3cb34a8a58d90', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2a$10$ecN6fjgbGla2pDCn7zYV1uaxDxNAQ.8chczGAcSCuGMQAFhPcXhEC'
            },
            body: JSON.stringify(updatedOrders)
        });

        // Clear cart and show success
        localStorage.removeItem('cart');
        showToast('Order placed successfully!', 'success');
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'shoptest1.html.html';
        }, 2000);
        
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Failed to place order. Please try again.');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Place Order';
    }
}

document.onkeydown = (e) => {
    if (e.key == 123) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key == 'I') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key == 'C') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key == 'J') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.key == 'U') {
        e.preventDefault();
    }
    if (e.key == 'F12') {
        e.preventDefault();
    }
};
