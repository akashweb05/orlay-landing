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