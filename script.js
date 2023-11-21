// Main page carousels
function setUpCarousel(carouselId, paginationId) {
    let currentSlide = 0;
    const slides = document.querySelectorAll(`#${carouselId} .carousel-item`);
    const pagination = document.getElementById(paginationId);

    // If either slides or pagination elements don't exist, exit the function
    if (!slides.length || !pagination) {
        return;
    }

    function updatePagination() {
        pagination.textContent = `${currentSlide + 1} / ${slides.length}`;
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
        });
        currentSlide = index;
        updatePagination();
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    slides.forEach((slide) => {
        slide.style.transition = 'opacity 1s ease-in-out';
        slide.style.opacity = '0';
    });

    showSlide(0); // Show the first slide initially
    setInterval(nextSlide, 4000); // Change slide every 4 seconds
}

// Initialize carousels
window.addEventListener('load', function() {
    if (document.getElementById('carousel1') && document.getElementById('carousel-pagination1')) {
        setUpCarousel('carousel1', 'carousel-pagination1');
    }
    if (document.getElementById('carousel2') && document.getElementById('carousel-pagination2')) {
        setUpCarousel('carousel2', 'carousel-pagination2');
    }
});

//scroll down button
const scrollDownButton = document.querySelector('.scroll-down-button');
if (scrollDownButton) {
    scrollDownButton.addEventListener('click', function(event) {
        event.preventDefault();
        const scrollDistance = window.innerHeight - 45;
        window.scrollBy({
            top: scrollDistance,
            left: 0,
            behavior: 'smooth'
        });
    });
}

// Main page Our Services carousel
function setUpHomepageServiceCarousel() {
    let currentIndex = 0;
    const slideContainer = document.querySelector("#homepageservicesCarousel .homepage-service-carousel-slide");
    if (!slideContainer) {
        // Element not found, exit the function
        console.warn("Slide container not found. Exiting the setup function.");
        return;
    }
    const totalSlides = slideContainer.children.length / 2; // Adjust for duplicates
    const visibleSlides = 4; // Number of visible slides

    // Create Pagination Lines
    const paginationContainer = document.querySelector(".homepage-services-carousel-pagination");
    for (let i = 0; i < totalSlides; i++) {
        const line = document.createElement("div");
        line.classList.add("homepage-services-carousel-pagination-line");
        if (i === 0) line.classList.add("active");
        line.addEventListener("click", () => moveToSlide(i));
        paginationContainer.appendChild(line);
    }

    // Calculate the width of each slide including margin
    const slideMargin = 10;
    const slideWidth = slideContainer.children[0].offsetWidth + slideMargin;

    function moveSlide(newIndex, instant) {
        if (instant) {
            slideContainer.style.transition = 'none';
        } else {
            slideContainer.style.transition = 'transform 0.5s ease';
        }
        slideContainer.style.transform = `translateX(-${newIndex * slideWidth}px)`;
        updatePaginationLines();
    }

    // Update Pagination Lines
    function updatePaginationLines() {
        const lines = document.querySelectorAll(".homepage-services-carousel-pagination-line");
        lines.forEach((line, index) => {
            line.classList.remove("active");
            if (index === currentIndex) {
                line.classList.add("active");
            }
        });
    }

    function moveToSlide(slideIndex) {
        currentIndex = slideIndex;
        moveSlide(currentIndex, false);
    }

    function nextSlide() {
        currentIndex++;
        if (currentIndex >= totalSlides) {
            moveSlide(0, true);
            requestAnimationFrame(() => moveSlide(1, false));
            currentIndex = 1;
        } else {
            moveSlide(currentIndex, false);
        }
    }

    function previousSlide() {
        currentIndex--;
        if (currentIndex < 0) {
            moveSlide(totalSlides - 1, true);
            requestAnimationFrame(() => moveSlide(totalSlides - 2, false));
            currentIndex = totalSlides - 2;
        } else {
            moveSlide(currentIndex, false);
        }
    }

    document.querySelector(".homepage-services-carousel .right-arrow").addEventListener("click", nextSlide);
    document.querySelector(".homepage-services-carousel .left-arrow").addEventListener("click", previousSlide);

    // Touch Slide Functionality
    let touchstartX = 0;
    let touchendX = 0;
    
    slideContainer.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    });

    slideContainer.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
    });

    function handleGesture() {
        if (touchendX < touchstartX) nextSlide();
        if (touchendX > touchstartX) previousSlide();
    }

    moveSlide(0, true);
}

window.addEventListener('load', setUpHomepageServiceCarousel);

  //service block image change on hover
  document.querySelectorAll('.service-block').forEach(function(block) {
    block.addEventListener('mouseenter', function() {
        const icon = block.querySelector('.service-icon img');
        icon.src = icon.getAttribute('data-hover-src'); // Change to hover image
    });

    block.addEventListener('mouseleave', function() {
        const icon = block.querySelector('.service-icon img');
        icon.src = icon.getAttribute('data-original-src'); // Revert to original image
    });
});

//Gallery carousels and Full modal
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById('fullscreenModal');
    let currentImageIndex = 0;

    // Function to open the modal with the clicked image and specific image array
    function openModal(imageSrc, index, imagesArray) {
        if (modal) {
            const modalContent = modal.querySelector('img');
            modalContent.src = imageSrc;
            modal.style.display = "flex";
            currentImageIndex = index;
            images = imagesArray; // Update images array for modal navigation
        }
    }

    // Function to update the main image and active thumbnail
    function updateMainImage(newIndex, mainImages, thumbnails, initialLoad = false) {
        mainImages.forEach(img => img.style.display = 'none');
        mainImages[newIndex].style.display = 'block';
        thumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));
        thumbnails[newIndex].classList.add('active-thumbnail');
        if (!initialLoad) {
            thumbnails[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
        currentImageIndex = newIndex;
    }

    // Initialize gallery carousels
    document.querySelectorAll('.gallery-carousel-block').forEach(block => {
        const mainImages = block.querySelectorAll('.gallery-carousel-main img');
        const thumbnails = block.querySelectorAll('.gallery-carousel-thumbnails img');

        mainImages.forEach((image, index) => {
            image.addEventListener('click', function() {
                let carouselImages = Array.from(mainImages).map(img => img.src);
                openModal(this.src, index, carouselImages);
            });
        });

        if (thumbnails.length > 0) {
            updateMainImage(0, mainImages, thumbnails, true);
        }

        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', function() {
                updateMainImage(index, mainImages, thumbnails);
            });
        });

        block.querySelectorAll('.thumbnail-arrow').forEach(arrow => {
            arrow.addEventListener('click', function() {
                if (this.classList.contains('right-arrow')) {
                    currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
                } else {
                    currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
                }
                updateMainImage(currentImageIndex, mainImages, thumbnails);
            });
        });
    });

    // Initialize footer gallery
    const footerGalleryImages = document.querySelectorAll('.footer-column#footer-gallery-column .gallery-grid img');
    footerGalleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            let footerImages = Array.from(footerGalleryImages).map(img => img.src);
            openModal(this.src, index, footerImages);
        });
    });

    // Modal functionality
    if (modal) {
        const modalContent = modal.querySelector('img');
        const closeButton = modal.querySelector('.fullscreen-close');
        const modalArrows = modal.querySelectorAll('.modal-arrow');

        modalArrows.forEach(arrow => {
            arrow.addEventListener('click', function() {
                if (this.classList.contains('right-arrow')) {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                } else {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                }
                modalContent.src = images[currentImageIndex];
            });
        });

        closeButton.addEventListener('click', function() {
            modal.style.display = "none";
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        // Keyboard Navigation for Modal
        document.addEventListener('keydown', function(event) {
            if (modal.style.display === "flex") {
                if (event.key === 'ArrowRight') {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    modalContent.src = images[currentImageIndex];
                } else if (event.key === 'ArrowLeft') {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    modalContent.src = images[currentImageIndex];
                }
            }
        });

        // Touch Swiping for Modal
        let touchStartX = 0;
        let touchEndX = 0;
        modal.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
        modal.addEventListener('touchmove', e => touchEndX = e.touches[0].clientX);
        modal.addEventListener('touchend', function() {
            if (touchEndX < touchStartX - 30) {
                currentImageIndex = (currentImageIndex + 1) % images.length;
            } else if (touchEndX > touchStartX + 30) {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            }
            modalContent.src = images[currentImageIndex];
        });
    } else {
        console.error('Modal element not found');
    }
});