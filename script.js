window.addEventListener('load', function () {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
});

const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        for (let j = index + 1; j < particles.length; j++) {
            const dx = particle.x - particles[j].x;
            const dy = particle.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.strokeStyle = `rgba(108, 92, 231, ${0.15 * (1 - distance / 120)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
});

menuToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navItems.forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

const statNums = document.querySelectorAll('.stat-num');
let animated = false;

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
            statNums.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            animated = true;
        }
    });
}, observerOptions);

const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    observer.observe(heroSection);
}

const filterItems = document.querySelectorAll('.filter-item');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterItems.forEach(item => {
    item.addEventListener('click', function () {
        filterItems.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        portfolioItems.forEach(portfolioItem => {
            portfolioItem.style.transition = 'all 0.5s ease';

            if (filterValue === 'all') {
                portfolioItem.style.opacity = '1';
                portfolioItem.style.transform = 'scale(1)';
                portfolioItem.style.display = 'block';
            } else {
                const category = portfolioItem.getAttribute('data-category');
                if (category === filterValue) {
                    portfolioItem.style.opacity = '1';
                    portfolioItem.style.transform = 'scale(1)';
                    portfolioItem.style.display = 'block';
                } else {
                    portfolioItem.style.opacity = '0';
                    portfolioItem.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        if (category !== filterValue) {
                            portfolioItem.style.display = 'none';
                        }
                    }, 500);
                }
            }
        });
    });
});

const skillTags = document.querySelectorAll('.skill-tag');
const serviceCards = document.querySelectorAll('.service-card');
const expCards = document.querySelectorAll('.exp-card');

const scrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

[...serviceCards, ...portfolioItems, ...expCards].forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    scrollObserver.observe(element);
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';

            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 2500);
        }, 1500);
    });
}

const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 2}s`;
});

const words = document.querySelectorAll('.word');
words.forEach((word, index) => {
    word.style.animationDelay = `${0.2 + index * 0.2}s`;
});

let ticking = false;
window.addEventListener('scroll', function () {
    if (!ticking) {
        window.requestAnimationFrame(function () {
            const scrolled = window.pageYOffset;
            const heroShapes = document.querySelectorAll('.hero-shape');

            heroShapes.forEach(shape => {
                const speed = 0.3;
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });

            ticking = false;
        });

        ticking = true;
    }
});

const aboutText = document.querySelector('.about-text');
if (aboutText) {
    aboutText.style.opacity = '0';
    aboutText.style.transform = 'translateX(-30px)';
    aboutText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    const aboutObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.3 });

    aboutObserver.observe(aboutText);
}

function createParticleOnClick(e) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.borderRadius = '50%';
    particle.style.background = 'linear-gradient(135deg, #6c5ce7, #fd79a8)';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.animation = 'particleFade 1s ease-out forwards';

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

document.querySelectorAll('.cta-button, .submit-btn, .social-btn-contact').forEach(button => {
    button.addEventListener('click', createParticleOnClick);
});

console.log('%c🎨 Portfolio Website Loaded Successfully!', 'font-size: 16px; color: #6c5ce7; font-weight: bold;');
console.log('%cDesigned with passion and creativity', 'font-size: 12px; color: #fd79a8;');
