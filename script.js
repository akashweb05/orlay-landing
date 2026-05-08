// ==============================
// CACHE DOM (important)
// ==============================
const nav = document.querySelector('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const parallaxEls = document.querySelectorAll('[data-parallax]');
const revealEls = document.querySelectorAll('.reveal');

// ==============================
// SCROLL REVEAL
// ==============================
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('active');
        }
        else {
            e.target.classList.remove('active');
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ==============================
// SECTION BACKGROUND COLOR CHANGE
// ==============================
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bgColor = entry.target.getAttribute('data-bg-color');
            if (bgColor) {
                document.body.style.backgroundColor = bgColor;
            }
        }
    });
}, { threshold: 0.5 }); // 50% of section visible

sections.forEach(section => sectionObserver.observe(section));

// ==============================
// SINGLE SCROLL HANDLER (🔥)
// ==============================
let ticking = false;

function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar effect
    nav.classList.toggle('scrolled', scrollY > 50);

    // Active section tracking
    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 200) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + current
        );
    });

    // Parallax (lighter)
    parallaxEls.forEach(el => {
        el.style.transform = `translateY(${scrollY * 0.2}px)`;
    });

    ticking = false;
}

// requestAnimationFrame optimization
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
    }
});

// ==============================
// SMOOTH SCROLL
// ==============================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ==============================
// RIPPLE EFFECT (mobile friendly)
// ==============================
function addRipple(e) {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    const x = (e.clientX || rect.width / 2) - rect.left - size / 2;
    const y = (e.clientY || rect.height / 2) - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

document.querySelectorAll('.btn-primary, .step-btn').forEach(btn => {
    btn.addEventListener('click', addRipple);
});

// ==============================
// FORM BUTTON ANIMATION
// ==============================
const formBtn = document.querySelector('.form-submit');

if (formBtn) {
    formBtn.addEventListener('click', function () {
        const originalText = this.textContent;

        this.textContent = '✓ Richiesta inviata!';
        this.style.background = '#1aaa5f';
        this.style.transform = 'scale(0.96)';

        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 120);

        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
            this.style.transform = '';
        }, 3000);
    });
}

// ==============================
// SCROLL PROGRESS INDICATOR
// ==============================
function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    const progressBar = document.querySelector('.scroll-progress') || createScrollProgress();
    progressBar.style.width = scrolled + '%';
}

function createScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.insertBefore(bar, document.body.firstChild);
    return bar;
}

window.addEventListener('scroll', updateScrollProgress);

// ==============================
// CURSOR GLOW / SPOTLIGHT EFFECT
// ==============================
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
    const isDarkSection = document.body.style.backgroundColor === 'rgb(0, 0, 0)' || 
                          document.body.style.backgroundColor === '#000000';
    
    if (isDarkSection) {
        cursorGlow.style.left = (e.clientX - 150) + 'px';
        cursorGlow.style.top = (e.clientY - 150) + 'px';
    }
});

// ==============================
// GRAIN OVERLAY
// ==============================
const grain = document.createElement('div');
grain.className = 'grain-overlay';
document.body.appendChild(grain);

// ==============================
// ANIMATED KPI COUNTERS
// ==============================
function animateCounter(element, target, duration = 2000) {
    if (element.classList.contains('counting')) return;
    
    element.classList.add('counting');
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        current = start + (target - start) * easeOutCubic(progress);
        
        let formatted = Math.round(current).toString();
        
        // Format currency and numbers
        if (element.textContent.includes('€')) {
            formatted = new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0
            }).format(Math.round(current));
        } else if (element.textContent.includes(',')) {
            formatted = Math.round(current).toLocaleString('it-IT');
        } else if (element.textContent.includes('%')) {
            formatted = Math.round(current) + '%';
        } else if (current > 1000) {
            formatted = (current / 1000).toFixed(1) + 'K';
        }

        element.textContent = formatted;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.classList.remove('counting');
        }
    }

    update();
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Observe KPI elements for animation
const kpiObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.getAttribute('data-animate')) {
            const targetValue = parseFloat(entry.target.getAttribute('data-target')) || 
                              parseInt(entry.target.textContent.replace(/[^0-9]/g, ''));
            animateCounter(entry.target, targetValue);
            kpiObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-animate]').forEach(el => kpiObserver.observe(el));

// ==============================
// INTERACTIVE TILT EFFECT
// ==============================
function createTiltEffect(element) {
    element.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;
        
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        element.style.setProperty('--tilt-x', rotateX + 'deg');
        element.style.setProperty('--tilt-y', rotateY + 'deg');
    });

    element.addEventListener('mouseleave', () => {
        element.style.setProperty('--tilt-x', '0deg');
        element.style.setProperty('--tilt-y', '0deg');
    });
}

document.querySelectorAll('.prob-card, .sol-card, .an-card, .kpi, .analytics-visual').forEach(el => {
    el.classList.add('tilt-element');
    createTiltEffect(el);
});

// ==============================
// STAGGER REVEAL - IMPROVED
// ==============================
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
    staggerObserver.observe(el);
});

// ==============================
// DEVICE MOTION EFFECT (Phone mockup parallax)
// ==============================
function parallaxPhone() {
    const phone = document.querySelector('.hero-visual');
    if (!phone) return;
    
    window.addEventListener('mousemove', (e) => {
        const rect = phone.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (e.clientX - centerX) * 0.02;
        const moveY = (e.clientY - centerY) * 0.02;
        
        phone.style.transform = `perspective(1000px) rotateX(${moveY}deg) rotateY(${moveX}deg)`;
    });
}

parallaxPhone();

// ==============================
// MAGNETIC CTA BUTTONS
// ==============================
function createMagneticButton(button) {
    let magneticX = 0, magneticY = 0;
    
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        
        magneticX = x * 0.2;
        magneticY = y * 0.2;
        
        button.style.transform = `translate(${magneticX}px, ${magneticY}px)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
}

document.querySelectorAll('.btn-primary, .btn-ghost-outline').forEach(btn => {
    btn.classList.add('btn-magnetic');
    createMagneticButton(btn);
});

// ==============================
// NAVBAR COLOR ADAPTATION
// ==============================
const navColorObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bgColor = entry.target.getAttribute('data-bg-color');
            document.body.setAttribute('data-section-bg', bgColor || '#f8fbff');
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => navColorObserver.observe(section));

// ==============================
// HAMBURGER MENU (Mobile navigation)
// ==============================
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navOverlay = document.querySelector('.nav-overlay');
    
    if (!hamburger || !navOverlay) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navOverlay.classList.toggle('active');
    });

    navOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
            hamburger.classList.remove('active');
            navOverlay.classList.remove('active');
        }
    });
}

setTimeout(initMobileNav, 100);

// ==============================
// CHART/BAR ANIMATIONS
// ==============================
function animateChart() {
    const bars = document.querySelectorAll('.chart-area .bar, .chart-bars .cb, .area-bar-fill');
    
    bars.forEach((bar, index) => {
        const finalHeight = bar.style.height;
        bar.style.height = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'height 0.8s cubic-bezier(0.23, 1, 0.320, 1)';
            bar.style.height = finalHeight;
        }, 50 + index * 30);
    });
}

const chartObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            animateChart();
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.chart-area, .chart-bars, .area-table').forEach(el => {
    chartObserver.observe(el);
});

// ==============================
// PREMIUM SCROLL FEEL
// ==============================
document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Update gradient overlay visibility
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (Math.abs(rect.top) < window.innerHeight / 2) {
            section.classList.add('in-view');
        }
    });
}, { passive: true });

// ==============================
// INITIALIZATION
// ==============================
function initPremiumFeatures() {
    // Add gradient overlays to sections
    document.querySelectorAll('section').forEach(section => {
        if (!section.querySelector('.gradient-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'gradient-overlay';
            section.insertBefore(overlay, section.firstChild);
        }
    });
}

document.addEventListener('DOMContentLoaded', initPremiumFeatures);

const glow = document.querySelector('.cursor-glow');

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow(){
  currentX += (mouseX - currentX) * 0.12;
  currentY += (mouseY - currentY) * 0.12;

  glow.style.left = currentX + 'px';
  glow.style.top = currentY + 'px';

  requestAnimationFrame(animateGlow);
}

animateGlow();

/* =========================================
   WOW STORY SECTION
========================================= */

const storySteps = document.querySelectorAll('.story-step');
const slides = document.querySelectorAll('.dashboard-screen');

const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(storySteps).indexOf(entry.target);
            
            // Remove active from all
            storySteps.forEach(step => step.classList.remove('active'));
            slides.forEach(slide => slide.classList.remove('active'));
            
            // Add active to current
            entry.target.classList.add('active');
            if (slides[index]) {
                slides[index].classList.add('active');
            }
        }
    });
}, { threshold: 0.5 }); // When 50% of the step is visible

storySteps.forEach(step => storyObserver.observe(step));

/* LIVE COUNTER ANIMATION */

const liveCounters = document.querySelectorAll("[data-live-counter]");

const animateLiveCounter = (counter) => {

    const target = +counter.getAttribute("data-live-counter");

    let current = 0;

    const increment = target / 90;

    const updateCounter = () => {

        current += increment;

        if(current < target){

            counter.innerText =
                target > 1000
                ? Math.floor(current).toLocaleString()
                : Math.floor(current);

            requestAnimationFrame(updateCounter);

        }else{

            counter.innerText =
                target > 1000
                ? target.toLocaleString()
                : target;
        }
    };

    updateCounter();
};

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            animateLiveCounter(entry.target);

            observer.unobserve(entry.target);
        }
    });

},{threshold:0.5});

liveCounters.forEach(counter=>{
    observer.observe(counter);
});