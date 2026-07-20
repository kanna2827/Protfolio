/* ==========================================================================
   KANNAN PORTFOLIO WEBSITE - DYNAMIC JAVASCRIPT (js/script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PRELOADER
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
        
        // Fallback in case window load event doesn't fire quickly
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 3000);
    }

    // 2. THEME SWITCHER (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Check saved theme or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute('data-bs-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        } else {
            themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        }
    }

    // 3. SCROLL PROGRESS BAR & BACK TO TOP BUTTON
    const scrollBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        
        if (scrollBar) {
            scrollBar.style.width = scrolled + '%';
        }

        if (backToTopBtn) {
            if (winScroll > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. ACTIVE NAVBAR LINK HIGHLIGHT ON SCROLL
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    function highlightNavLink() {
        const scrollY = window.pageYOffset + 150; // offset for navbar height

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNavLink);

    // 5. TYPING ANIMATION (Hero Section)
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        const words = [
            "Data Science Graduate",
            "Machine Learning Enthusiast",
            "Python Developer",
            "AI Learner"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // speed up deleting
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 120; // normal writing speed
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at completion
                typingSpeed = 1500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                // Move to next word
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // brief pause before writing next
            }

            setTimeout(type, typingSpeed);
        }

        // Start animation
        setTimeout(type, 1000);
    }

    // 6. ANIMATED COUNTERS
    const counters = document.querySelectorAll('.counter-value');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetCard = entry.target;
                    const countEl = targetCard.querySelector('.counter-value');
                    const targetNum = parseInt(countEl.getAttribute('data-target'), 10);
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const increment = targetNum / (duration / 16); // ~60fps
                    
                    const updateCount = () => {
                        count += increment;
                        if (count < targetNum) {
                            countEl.textContent = Math.floor(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            countEl.textContent = targetNum;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(targetCard); // animate only once
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.counter-card').forEach(card => {
            counterObserver.observe(card);
        });
    }

    // 7. ANIMATED PROGRESS BARS FOR SKILLS (On Scroll)
    const progressBars = document.querySelectorAll('.progress-bar-custom');
    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const skillVal = progressBar.getAttribute('data-value');
                    progressBar.style.width = skillVal + '%';
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.1 });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    // 8. CONTACT FORM VALIDATION (Bootstrap Style & Toast Alert)
    const contactForm = document.getElementById('contactForm');
    const toastElement = document.getElementById('submitToast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (contactForm.checkValidity()) {
                // Success: Show Bootstrap Toast
                if (toastElement) {
                    const toast = new bootstrap.Toast(toastElement);
                    toast.show();
                }
                // Reset form validation classes and inputs
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            } else {
                contactForm.classList.add('was-validated');
            }
        }, false);
    }

    // 9. BENTO GRID & GLASS CARD HOVER EFFECT (Interactive Mouse Glow for fallback cards)
    const interactiveCards = document.querySelectorAll('.bento-card:not(.interactive-lighting-card), .glass-card:not(.interactive-lighting-card), .counter-card:not(.interactive-lighting-card)');
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 9b. PREMIUM INTERACTIVE CARD LIGHTING EFFECT (Crimson Red / Glass Flashlight)
    const lightingCards = document.querySelectorAll('.interactive-lighting-card');
    const activeCards = new Set();
    let isLoopRunning = false;
    const ease = 0.12; // Linear interpolation factor (speed of flashlight glide)

    lightingCards.forEach(card => {
        const state = {
            element: card,
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
            currentOpacity: 0,
            targetOpacity: 0
        };

        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Set initial light position to mouse coordinates on entry to prevent jumping
            state.targetX = mouseX;
            state.targetY = mouseY;
            state.currentX = mouseX;
            state.currentY = mouseY;
            state.targetOpacity = 1;

            activeCards.add(state);
            startAnimationLoop();
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            state.targetX = e.clientX - rect.left;
            state.targetY = e.clientY - rect.top;
        });

        card.addEventListener('mouseleave', () => {
            state.targetOpacity = 0;
        });
    });

    function startAnimationLoop() {
        if (!isLoopRunning) {
            isLoopRunning = true;
            requestAnimationFrame(updateLighting);
        }
    }

    function updateLighting() {
        if (activeCards.size === 0) {
            isLoopRunning = false;
            return;
        }

        activeCards.forEach(state => {
            // Linear Interpolation (lerp) for smooth gliding movement
            state.currentX += (state.targetX - state.currentX) * ease;
            state.currentY += (state.targetY - state.currentY) * ease;
            state.currentOpacity += (state.targetOpacity - state.currentOpacity) * ease;

            // Set CSS variables for GPU-accelerated gradient updates
            state.element.style.setProperty('--mouse-x', `${state.currentX.toFixed(1)}px`);
            state.element.style.setProperty('--mouse-y', `${state.currentY.toFixed(1)}px`);
            state.element.style.setProperty('--light-opacity', state.currentOpacity.toFixed(3));

            // Remove card from active loop when it has completely faded out
            if (state.targetOpacity === 0 && state.currentOpacity < 0.005) {
                state.currentOpacity = 0;
                state.element.style.setProperty('--light-opacity', '0');
                activeCards.delete(state);
            }
        });

        requestAnimationFrame(updateLighting);
    }

    // 10. HERO SPOTLIGHT CURSOR EFFECT
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroSection.style.setProperty('--hero-mouse-x', `${x}px`);
            heroSection.style.setProperty('--hero-mouse-y', `${y}px`);
        });
    }

    // 11. 3D PARALLAX TILT EFFECT
    const tiltCards = document.querySelectorAll('.hero-glass-card, .bento-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((centerY - y) / centerY) * 6; // Max 6 deg
            const tiltY = ((x - centerX) / centerX) * 6; // Max 6 deg
            
            card.style.setProperty('--rotate-x', `${tiltX}deg`);
            card.style.setProperty('--rotate-y', `${tiltY}deg`);
        });
        
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rotate-x', '0deg');
            card.style.setProperty('--rotate-y', '0deg');
        });
    });

});
