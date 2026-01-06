// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// NAVIGATION - Enhanced
// ========================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');

// Smooth scroll effect with throttle
const handleScroll = throttle(() => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Update active nav link
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });

// Mobile menu toggle with animation
navToggle.addEventListener('click', () => {
    const isActive = navToggle.classList.contains('active');
    navToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (!isActive) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMobile.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const sections = ['about', 'skills', 'projects', 'experience', 'contact'];
    const scrollPos = window.scrollY + 200;
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const top = element.offsetTop;
            const height = element.offsetHeight;
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}

// ========================================
// TYPING EFFECT - Enhanced
// ========================================
const roles = ['Data Analyst'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingText = document.getElementById('typingText');

function typeEffect() {
    if (!typingText) return;
    
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect only when page is loaded
if (document.readyState === 'complete') {
    typeEffect();
} else {
    window.addEventListener('load', typeEffect);
}

// ========================================
// PARTICLE CANVAS - Optimized
// ========================================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 250));
    
    const colors = [
        'rgba(45, 212, 191, 0.6)',
        'rgba(251, 113, 133, 0.4)',
        'rgba(167, 139, 250, 0.4)',
        'rgba(251, 191, 36, 0.3)'
    ];
    
    // Reduce particle count on mobile for performance
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }
    
    initParticles();
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Draw connections (limit for performance)
            if (i < particles.length - 1) {
                particles.slice(i + 1, i + 5).forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(45, 212, 191, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            }
        });
        
        animationFrameId = requestAnimationFrame(animateParticles);
    }
    
    // Intersection Observer to pause animation when not visible
    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateParticles();
            } else {
                cancelAnimationFrame(animationFrameId);
            }
        });
    });
    
    canvasObserver.observe(canvas);
}

// ========================================
// SCROLL REVEAL - Enhanced Performance
// ========================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Add stagger effect
            const delay = Array.from(revealElements).indexOf(entry.target) % 5;
            setTimeout(() => {
                entry.target.classList.add('active');
            }, delay * 100);
            
            // Unobserve after revealing for performance
            revealObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ========================================
// SKILL BARS ANIMATION - Optimized
// ========================================
const skillBars = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'skill-fill 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            skillObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.5,
    rootMargin: '0px'
});

skillBars.forEach(bar => skillObserver.observe(bar));

// ========================================
// SMOOTH SCROLL - Enhanced
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// CONTACT FORM - Enhanced
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission (replace with actual API call)
        console.log('Form data:', data);
        
        // Show success message
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            Message Sent!
        `;
        submitBtn.disabled = true;
        
        // Reset after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.reset();
        }, 3000);
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = 'rgba(251, 113, 133, 0.5)';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor) {
                this.style.borderColor = '';
            }
        });
    });
}

// ========================================
// PARALLAX EFFECT - Optimized
// ========================================
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

const handleMouseMove = throttle((e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 20;
    targetY = (e.clientY / window.innerHeight - 0.5) * 20;
}, 50);

// Smooth parallax animation
function updateParallax() {
    mouseX += (targetX - mouseX) * 0.1;
    mouseY += (targetY - mouseY) * 0.1;
    
    const shapes = document.querySelectorAll('.bg-shape');
    shapes.forEach((shape, i) => {
        const speed = (i + 1) * 0.3;
        shape.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
    
    requestAnimationFrame(updateParallax);
}

// Only enable parallax on desktop
if (window.innerWidth > 1024) {
    document.addEventListener('mousemove', handleMouseMove);
    updateParallax();
}

// ========================================
// TILT EFFECT ON CARDS - Optimized
// ========================================
const cards = document.querySelectorAll('.project-card, .skill-card, .highlight-card');

cards.forEach(card => {
    // Only enable tilt on devices with hover capability
    if (window.matchMedia('(hover: hover)').matches) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    }
});

// ========================================
// MAGNETIC BUTTON EFFECT - Enhanced
// ========================================
const magneticBtns = document.querySelectorAll('.btn-glow, .btn-accent, .btn-ghost');

magneticBtns.forEach(btn => {
    if (window.matchMedia('(hover: hover)').matches) {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    }
});

// ========================================
// LAZY LOADING OPTIMIZATION
// ========================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// PERFORMANCE MONITORING
// ========================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#about';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 1rem;
    background: var(--primary);
    color: var(--background);
    text-decoration: none;
    font-weight: 600;
`;
skipLink.addEventListener('focus', function() {
    this.style.left = '1rem';
    this.style.top = '1rem';
});
skipLink.addEventListener('blur', function() {
    this.style.left = '-9999px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// Keyboard navigation for cards
cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            card.click();
        }
    });
});

// ========================================
// INITIALIZATION & CLEANUP
// ========================================
console.log('✨ Portfolio loaded successfully!');
console.log('🚀 Performance optimizations active');
console.log('♿ Accessibility features enabled');

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});