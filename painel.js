// --- Scroll Animations ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(element => {
    observer.observe(element);
});

// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
        // Fechar menu mobile se estiver aberto
        const mobileMenu = document.getElementById('mobile-menu');
        if(mobileMenu.style.display === 'flex') {
            mobileMenu.style.display = 'none';
        }
    });
});

// --- Mobile Menu Toggle ---
const menuIcon = document.querySelector('.mobile-menu-icon');
const mobileMenu = document.getElementById('mobile-menu');

menuIcon.addEventListener('click', () => {
    if (mobileMenu.style.display === 'flex') {
        mobileMenu.style.display = 'none';
    } else {
        mobileMenu.style.display = 'flex';
    }
});

// --- Interactive Logo Parallax (Mouse & Touch) ---
const interactiveLogo = document.getElementById('interactive-logo');

function animateLogo(e) {
    if (!interactiveLogo) return;
    
    // Calculate relative mouse/touch position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Window center
    const centerX = window.innerWidth / 2;
    const centerY = 100; // rough center of header
    
    // Distance from center
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Sensitivity dampening
    const moveX = deltaX * 0.05; 
    const moveY = deltaY * 0.05;
    const rotate = deltaX * 0.02;

    interactiveLogo.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
}

// Attach to document to feel movement anywhere near top
document.addEventListener('mousemove', (e) => {
    if(e.clientY < 300) {
        animateLogo(e);
    } else {
        interactiveLogo.style.transform = `translate(0px, 0px) rotate(0deg)`;
    }
});

document.addEventListener('touchmove', (e) => {
    if(e.touches[0].clientY < 300) {
        animateLogo(e);
    } else {
        interactiveLogo.style.transform = `translate(0px, 0px) rotate(0deg)`;
    }
});

// --- Modals Logic (Bento Grid) ---
function openModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.add('active');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.remove('active');
    }
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
}
