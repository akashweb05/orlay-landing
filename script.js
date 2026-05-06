// Scroll reveal with stagger effect
const els = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){ 
      e.target.classList.add('visible'); 
      io.unobserve(e.target); 
    }
  });
}, { threshold:.12 });
els.forEach(el => io.observe(el));

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if(window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Active nav link indicator
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Smooth CTA scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth'});
  });
});

// Add ripple effect to buttons
function addRipple(e) {
  const btn = e.currentTarget;
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

document.querySelectorAll('.btn-primary, .step-btn').forEach(btn => {
  btn.addEventListener('mousedown', addRipple);
});

// Form submit with animation
document.querySelector('.form-submit').addEventListener('click', function(e) {
  const btn = this;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  
  // Create success animation
  const originalText = btn.textContent;
  btn.textContent = '✓ Richiesta inviata!';
  btn.style.background = '#1aaa5f';
  btn.style.transform = 'scale(0.98)';
  
  setTimeout(() => {
    btn.style.transform = 'scale(1)';
  }, 100);
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.style.transform = '';
  }, 3000);
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  parallaxElements.forEach(el => {
    const yPos = window.scrollY * 0.5;
    el.style.transform = `translateY(${yPos}px)`;
  });
});

// Add CSS for ripple effect and nav active state dynamically
const style = document.createElement('style');
style.textContent = `
  .btn-primary, .step-btn {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  nav a.active {
    color: var(--blue);
    font-weight: 700;
  }
`;
document.head.appendChild(style);