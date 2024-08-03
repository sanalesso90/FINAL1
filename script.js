document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Loader animation
    function animateLoader() {
        const loadingContainer = document.querySelector('.loading-container');
        const mainContent = document.querySelector('.main-content');
        const loadingText = document.querySelector('.loading-text');

        // Create a timeline for the loader animation
        const loaderTl = gsap.timeline();

        // Animate the loading text
        loaderTl.from('.loading-text span', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });

        // Animate the line below the text
        loaderTl.from('.loading-container::before', {
            scaleX: 0,
            duration: 1,
            ease: "power2.inOut"
        }, "-=0.5");

        // Create overlay for reveal effect
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = '#ffffff';
        overlay.style.zIndex = 9998;
        document.body.appendChild(overlay);

        // Hide loader and reveal main content
        loaderTl.to(loadingText, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: "power2.in"
        });

        loaderTl.to(loadingContainer, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                loadingContainer.style.display = 'none';
                mainContent.style.opacity = 1;
                mainContent.style.visibility = 'visible';
            }
        }, "-=0.3");

        // Reveal main content with a wipe effect
        loaderTl.to(overlay, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
                overlay.remove();
            }
        });

        // Fade in and slide up main content elements
        loaderTl.from(mainContent.children, {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.8");

        return loaderTl;
    }

    // Hero Carousel functionality
    function initializeHeroCarousel() {
        const carouselItems = document.querySelectorAll('.carousel-item');
        const heroTitle = document.querySelector('.hero-content h1');
        const heroSubtitle = document.querySelector('.hero-content p');
        let currentItem = 0;
        let isTransitioning = false;

        function showNextItem() {
            if (isTransitioning) return;
            isTransitioning = true;

            const current = carouselItems[currentItem];
            currentItem = (currentItem + 1) % carouselItems.length;
            const next = carouselItems[currentItem];

            // Start transition
            next.classList.add('next');
            
            setTimeout(() => {
                current.classList.remove('active');
                next.classList.add('active');
                next.classList.remove('next');
                
                // Update hero content
                heroTitle.textContent = next.dataset.title;
                heroSubtitle.textContent = next.dataset.subtitle;

                // Fade in new text
                heroTitle.style.opacity = 0;
                heroSubtitle.style.opacity = 0;
                setTimeout(() => {
                    heroTitle.style.opacity = 1;
                    heroSubtitle.style.opacity = 1;
                }, 50);

                setTimeout(() => {
                    isTransitioning = false;
                }, 50);
            }, 50);
        }

        setInterval(showNextItem, 5000); // Change image every 5 seconds
    }

    // Parallax effect
    function initializeParallax() {
        const parallaxContainer = document.querySelector('.parallax-container');
        
        function handleParallax() {
            const scrolled = window.pageYOffset;
            const val = scrolled * 0.5;
            parallaxContainer.style.transform = `translate3d(0, ${val}px, 0)`;
        }

        window.addEventListener('scroll', handleParallax);
    }

    // Initialize Lenis for smooth scrolling
    function initializeLenis() {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            ScrollTrigger.update();
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    // Burger menu functionality
    function initializeBurgerMenu() {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    // Virtual Try-On functionality
    function initializeVirtualTryOn() {
        const modelImage = document.querySelector('.model-image');
        const garmentOverlay = document.querySelector('.garment-overlay');
        const designOptions = document.querySelectorAll('.design-option');
        const designName = document.querySelector('.info .name');
        const designDescription = document.querySelector('.info .job');

        const designs = {
            design1: {
                name: "Ethereal Elegance",
                description: "Haute Couture Gown",
                image: "./img/1.jpg"
            },
            design2: {
                name: "Noir Mystique",
                description: "Avant-Garde Evening Wear",
                image: "./img/upscale.jpg"
            },
            design3: {
                name: "Floral Reverie",
                description: "Enchanting Garden-Inspired Dress",
                image: "./img/h3.jpg"
            },
            design4: {
                name: "Avant-Garde Fusion",
                description: "Futuristic Couture Ensemble",
                image: "./img/New folder/design1.jpg"
            }
        };

        designOptions.forEach(option => {
            option.addEventListener('click', function() {
                const designId = this.getAttribute('data-design');
                const design = designs[designId];
                
                // Animate the model image
                modelImage.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    modelImage.style.transform = 'scale(1)';
                }, 500);

                // Change the garment overlay
                garmentOverlay.style.opacity = '0';
                setTimeout(() => {
                    garmentOverlay.style.backgroundImage = `url(${design.image})`;
                    garmentOverlay.style.opacity = '1';
                }, 250);

                // Update design info
                designName.textContent = design.name;
                designDescription.textContent = design.description;

                // Highlight the selected design
                designOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    // Smooth scroll to anchor links
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: targetElement,
                        ease: "power2.inOut"
                    });
                }
            });
        });
    }

    // Video Showcase functionality
    function initializeVideoShowcase() {
        const mainVideo = document.getElementById('main-video');
        const playPauseBtn = document.querySelector('.play-pause-btn');
        const videoTitle = document.getElementById('video-title');
        const videoDescription = document.getElementById('video-description');
        const timelineItems = document.querySelectorAll('.timeline-item');

        let isPlaying = false;

        function togglePlayPause() {
            if (isPlaying) {
                mainVideo.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                mainVideo.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        }

        playPauseBtn.addEventListener('click', togglePlayPause);

        function changeVideo(videoSrc, title, description) {
            mainVideo.src = videoSrc;
            videoTitle.textContent = title;
            videoDescription.textContent = description;
            mainVideo.load();
            if (isPlaying) {
                mainVideo.play();
            }
        }

        timelineItems.forEach(item => {
            item.addEventListener('click', function() {
                const videoSrc = this.getAttribute('data-video');
                const title = this.getAttribute('data-title');
                const description = this.getAttribute('data-description');

                changeVideo(videoSrc, title, description);

                timelineItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // What's New Swiper Carousel
    function initializeWhatsNewCarousel() {
        const whatsNewSwiper = new Swiper('.whats-new-carousel', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.whats-new-nav',
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + ' whats-new-nav-item"></span>';
                },
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });

        // Add hover effect to pause autoplay for What's New carousel
        const swiperContainer = document.querySelector('.whats-new-carousel');
        swiperContainer.addEventListener('mouseenter', function() {
            whatsNewSwiper.autoplay.stop();
        });
        swiperContainer.addEventListener('mouseleave', function() {
            whatsNewSwiper.autoplay.start();
        });
    }

    // Fashion Fusion Gallery functionality
    function initializeFashionFusionGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryOverlay = document.querySelector('.gallery-overlay');
        const overlayContent = document.querySelector('.overlay-content');

        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('item-link')) {
                    e.preventDefault();
                    const title = item.querySelector('h3').textContent;
                    const description = item.querySelector('p').textContent;
                    const image = item.querySelector('img').src;
                    const tags = Array.from(item.querySelectorAll('.item-tags span')).map(tag => tag.textContent);

                    overlayContent.innerHTML = `
                        <h3>${title}</h3>
                        <img src="${image}" alt="${title}" style="max-width: 100%; border-radius: 10px; margin-bottom: 1rem;">
                        <p>${description}</p>
                        <div class="overlay-tags">${tags.map(tag => `<span>${tag}</span>`).join('')}</div>
                        <button class="close-overlay">Close</button>
                    `;

                    galleryOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        galleryOverlay.addEventListener('click', (e) => {
            if (e.target === galleryOverlay || e.target.classList.contains('close-overlay')) {
                galleryOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // GSAP ScrollTrigger Animations
    function initializeScrollAnimations() {
        // Hero Section Animation
        gsap.to('.hero-content', {
            opacity: 0,
            y: -50,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Featured Collections Animation
        gsap.from('.collection-item', {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.collections-grid',
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            }
        });

        // Virtual Try-On Section Animation
        gsap.from('.model-container', {
            x: -100,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.virtual-try-on',
                start: 'top center',
                toggleActions: 'play none none reverse'
            }
        });

        gsap.from('.controls-container', {
            x: 100,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.virtual-try-on',
                start: 'top center',
                toggleActions: 'play none none reverse'
            }
        });

        // Testimonials Animation
        gsap.from('.testimonial-card', {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.testimonial-grid',
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            }
        });

        // Video Showcase Animation
        gsap.from('.video-main', {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.video-showcase',
                start: 'top center',
                toggleActions: 'play none none reverse'
            }
        });

        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                x: index % 2 === 0 ? -50 : 50,
                duration: 1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom-=50',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // What's New Section Animation
        gsap.from('.whats-new-slide', {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.whats-new-carousel',
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            }
        });

        // Fashion Fusion Gallery Animation
        gsap.from('.gallery-item', {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.gallery-grid',
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            }
        });

        // Footer Animation
        gsap.from('.site-footer', {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: '.site-footer',
                start: 'top bottom',
                toggleActions: 'play none none reverse'
            }
        });
    }

   

    // Lazy loading images
    function initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => lazyLoadObserver.observe(img));
    }


 

    // Mobile scroll interactions
    function initializeMobileScrollInteractions() {
        if (window.innerWidth <= 768) { // Apply only on mobile devices
            const interactiveElements = document.querySelectorAll('.collection-item, .gallery-item, .whats-new-content, .testimonial-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('mobile-hover');
                        // Remove the class after animation completes
                        setTimeout(() => {
                            entry.target.classList.remove('mobile-hover');
                        }, 1000); // Adjust timing as needed
                    }
                });
            }, {
                threshold: 0.5 // Trigger when 50% of the element is visible
            });

            interactiveElements.forEach(el => observer.observe(el));
        }
    }

    // Initialize all functions
    function initializeWebsite() {
        initializeHeroCarousel();
        initializeParallax();
        initializeLenis();
        initializeBurgerMenu();
        initializeVirtualTryOn();
        initializeSmoothScroll();
        initializeVideoShowcase();
        initializeWhatsNewCarousel();
        initializeFashionFusionGallery();
        initializeScrollAnimations();
        initializeNewsletterForm();
        updateFooterYear();
        initializeLazyLoading();
        initializeScrollToTop();
        initializeThemeSwitcher();
        initializeMobileScrollInteractions();
    }

    // Run the loader animation, then initialize the website
    const loaderAnimation = animateLoader();
    loaderAnimation.then(() => {
        initializeWebsite();
    });
});