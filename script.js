// Mobile menu toggle
const nav = document.querySelector('.main-nav');
const menuButton = document.querySelector('.menu-toggle');

menuButton.addEventListener('click', () => {
    nav.classList.toggle('show');
    menuButton.classList.toggle('active');
});

// Close menu
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('show');
        menuButton.classList.remove('active');
    });
});

//Not using this as I only got 1 project right now but might later on.
document.querySelectorAll('.project').forEach(project => {
    const btn = document.createElement('button');
    btn.textContent = 'Visa mer';
    project.appendChild(btn);
    
    btn.addEventListener('click', () => {
        project.classList.toggle('expanded');
        btn.textContent = project.classList.contains('expanded') 
            ? 'Visa mindre' 
            : 'Visa mer';
    });
});

// Contact Modal
const modal = document.getElementById("contactModal");
const contactLinks = document.querySelectorAll(".contact-link");
const span = document.querySelector(".close");

//open/close handlers
contactLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add('show');
    });
});

span.addEventListener('click', () => {
    modal.classList.remove('show');
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Tack för ditt meddelande!');
    modal.classList.remove('show');
});
