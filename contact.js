

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    const mobileCartCount = document.querySelector('.mobile-cart-count');
    
    // Update both desktop and mobile cart counts
    cartCount.textContent = cart.length;
    if (mobileCartCount) {
        mobileCartCount.textContent = cart.length;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Size selector functionality - UPDATED VERSION
document.addEventListener('DOMContentLoaded', () => {
    // Size selector functionality
    const sizeButtons = document.querySelectorAll('.size-selector button');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Size button clicked'); // Debug log
            
            // Get the parent product card
            const productCard = this.closest('.product-card');
            
            // Get all size buttons within this product card
            const allSizeButtons = productCard.querySelectorAll('.size-selector button');
            
            // Remove active class from all buttons in this product card
            allSizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Store the selected size in the product card's dataset
            productCard.dataset.selectedSize = this.getAttribute('data-size');
            
            console.log('Selected size:', this.getAttribute('data-size')); // Debug log
        });
    });

    // Add to cart functionality - UPDATED VERSION
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productImage = productCard.querySelector('.product-image img').src; // Get image source
            
            // Check if it's a cap (doesn't require size selection)
            const isCap = productName.toLowerCase().includes('cap');
            const selectedSize = isCap ? 'One Size' : productCard.dataset.selectedSize;
            
            // For non-cap items, check if size is selected
            if (!isCap && !selectedSize) {
                alert('Please select a size first');
                return;
            }

            const item = {
                name: productName,
                size: selectedSize,
                price: productName.includes('Hoodie') ? 89.99 : 34.99,
                image: productImage, // Add image to cart item
                id: Date.now()
            };

            cart.push(item);
            updateCart();
            updateCartDisplay();
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check"></i> Added';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            }, 2000);
        });
    });

    // Add cart close button functionality
    const cartModal = document.querySelector('.cart-modal');
    const cartIcon = document.querySelector('.cart-icon');
    
    // Create and add close button
    const closeButton = document.createElement('div');
    closeButton.className = 'cart-close';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    cartModal.appendChild(closeButton);

    // Close cart when clicking close button
    closeButton.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Close cart when clicking outside (keep existing functionality)
    document.addEventListener('click', (e) => {
        if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
            cartModal.classList.remove('active');
        }
    });

    // Add mobile cart button functionality
    const mobileCartBtn = document.querySelector('.mobile-cart-btn');
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Close mobile nav
            mobileNav.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Open cart modal
            cartModal.classList.add('active');
            updateCartDisplay();
        });
    }
});

// Initialize
updateCart();

// Smooth Scroll - Updated
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Special case for home link
        if(this.getAttribute('href') === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            const headerOffset = 100; // Adjust based on your header height
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Functionality - Minimal changes to your original code
document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.menu-icon');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeMenu = document.querySelector('.close-menu');
    
    menuIcon.addEventListener('click', () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent main content scrolling
    });

    function closeMenuHandler() {
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable main content scrolling
    }

    closeMenu.addEventListener('click', closeMenuHandler);

    // Mobile cart button functionality
    const cartModal = document.querySelector('.cart-modal');
    const mobileCartBtn = document.querySelector('.mobile-cart-btn');
    
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenuHandler(); // Close mobile nav first
            
            setTimeout(() => {
                cartModal.classList.add('active');
                updateCartDisplay();
            }, 300);
        });
    }
});

// Update mobile cart button functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = document.querySelector('.mobile-nav');
    const cartModal = document.querySelector('.cart-modal');
    const mobileCartBtn = document.querySelector('.mobile-cart-btn');
    
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile nav and overlay
            mobileNav.classList.remove('active');
            document.querySelector('.mobile-overlay').classList.remove('active');
            
            setTimeout(() => {
                // Show cart modal
                cartModal.classList.add('active');
                updateCartDisplay();
            }, 300);
        });
    }
});

// Scroll Progress Indicator
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalScroll) * 100;
    scrollProgress.style.width = `${progress}%`;
});

// Scroll Indicator
const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollIndicator.style.width = scrolled + '%';
});

// Enhanced Mobile Menu
const menuIcon = document.querySelector('.menu-icon');
const mobileNav = document.querySelector('.mobile-nav');
const closeMenu = document.querySelector('.close-menu');

menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !menuIcon.contains(e.target)) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Smooth scroll for mobile menu links
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all product cards
document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});

// Progress bar
const progressBar = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.transform = `scaleX(${scrolled / 100})`;
});

// Cart count animation
function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    cartCount.classList.add('updating');
    cartCount.textContent = count;
    setTimeout(() => cartCount.classList.remove('updating'), 500);
}


// Add cart modal functionality
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');

cartIcon.addEventListener('click', () => {
    cartModal.classList.toggle('active');
    updateCartDisplay();
});

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    let total = 0;
    
    // Clear current cart display
    cartItems.innerHTML = '';
    
    // Add each item to cart display
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Size: ${item.size}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price;
    });
    
    // Update total amount
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Add remove item functionality
document.querySelector('.cart-items').addEventListener('click', (e) => {
    if (e.target.closest('.remove-item')) {
        const itemId = parseInt(e.target.closest('.remove-item').dataset.id);
        cart = cart.filter(item => item.id !== itemId);
        updateCart();
        updateCartDisplay();
    }
});

// Close cart modal when clicking outside
document.addEventListener('click', (e) => {
    if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
        cartModal.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = document.querySelector('.mobile-nav');
    const cartModal = document.querySelector('.cart-modal');
    const mobileCartBtn = document.querySelector('.mobile-cart-btn');
    
    // Mobile cart button click handler
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // First close the mobile nav
            mobileNav.classList.remove('active');
            
            // Small delay to allow mobile nav to close
            setTimeout(() => {
                // Show cart modal
                cartModal.classList.add('active');
                // Update cart display
                updateCartDisplay();
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
            }, 300); // Adjust timing if needed
        });
    }

    // Close cart modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Update the updateCartDisplay function to ensure proper tiny images
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        // Updated HTML structure with minimal image container
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover;">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Size: ${item.size}</p>
                <p>$${item.price}</p>
            </div>
            <button class="remove-item" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
        total += parseFloat(item.price);
    });
    
    totalAmount.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            updateCart();
            updateCartDisplay();
        });
    });
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