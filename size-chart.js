document.addEventListener('DOMContentLoaded', function() {
    const sizeChartItems = document.querySelectorAll('.size-chart-item');
    const zoomModal = document.querySelector('.zoom-modal');
    const zoomImage = zoomModal.querySelector('img');
    const closeZoom = document.querySelector('.close-zoom');

    sizeChartItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const img = this.querySelector('img');
            zoomImage.src = img.src;
            zoomModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add smooth entrance animation
            zoomImage.style.opacity = '0';
            setTimeout(() => {
                zoomImage.style.opacity = '1';
            }, 50);
        });
    });

    function closeModal() {
        zoomImage.style.opacity = '0';
        setTimeout(() => {
            zoomModal.classList.remove('active');
            document.body.style.overflow = '';
        }, 200);
    }

    closeZoom.addEventListener('click', closeModal);

    zoomModal.addEventListener('click', function(e) {
        if (e.target === zoomModal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && zoomModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Add drag to close functionality
    let startY = 0;
    let currentY = 0;

    zoomModal.addEventListener('mousedown', function(e) {
        startY = e.clientY;
    });

    zoomModal.addEventListener('mousemove', function(e) {
        if (startY) {
            currentY = e.clientY;
            const delta = Math.abs(currentY - startY);
            
            if (delta > 100) {
                closeModal();
                startY = 0;
            }
        }
    });

    zoomModal.addEventListener('mouseup', function() {
        startY = 0;
    });

    // Touch events for mobile
    zoomModal.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });

    zoomModal.addEventListener('touchmove', function(e) {
        if (startY) {
            currentY = e.touches[0].clientY;
            const delta = Math.abs(currentY - startY);
            
            if (delta > 100) {
                closeModal();
                startY = 0;
            }
        }
    });

    zoomModal.addEventListener('touchend', function() {
        startY = 0;
    });
});
