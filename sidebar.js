document.addEventListener('DOMContentLoaded', () => {
    // Side menu functionality
    const menuBtn = document.querySelector('.contact-icon');
    const sideMenu = document.querySelector('.side-menu');
    const closeBtn = document.querySelector('.side-menu-close');
    const overlay = document.querySelector('.side-menu-overlay');
    
    // Cart functionality
    const cartIcon1 = document.querySelector('.cart-icon1');
    const cartModal = document.querySelector('.cart-modal');
    const cartClose = document.querySelector('.cart-close');
    const cartOverlay = document.querySelector('.cart-overlay');

    // Mobile Cart Open
    if (cartIcon1) {
        cartIcon1.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            cartModal.classList.add('active');
            cartOverlay.classList.add('active');
            
        });
    }

    // Cart Close
    if (cartClose) {
        cartClose.addEventListener('click', function() {
            cartModal.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Close cart when clicking overlay
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function() {
            cartModal.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Menu functionality
    menuBtn?.addEventListener('click', () => {
        sideMenu.classList.add('active');
        overlay.classList.add('active');
    });

    closeBtn?.addEventListener('click', () => {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay?.addEventListener('click', () => {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
    });
});
