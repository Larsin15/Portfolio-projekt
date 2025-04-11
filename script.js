// Mobile menu toggle
const nav = document.querySelector('.main-nav'); // Was '.nav'
const menuButton = document.querySelector('.menu-toggle');
menuButton.addEventListener('click', () => {
    nav.classList.toggle('show');
    menuButton.classList.toggle('active');
});
//CLose menu when I click
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('show');
        menuButton.classList.remove('active');
    });
});

// Project expand/collapse
document.querySelectorAll('.project').forEach(project => {
    const btn = document.createElement('button');
    btn.textContent = 'Visa mer';
    project.appendChild(btn);
    
    btn.addEventListener('click', () => {
        project.classList.toggle('expanded');
        btn.textContent = project.classList.contains('expanded') ? 'Visa mindre' : 'Visa mer';
    });
});

// Contact Modal
const modal = document.getElementById("contactModal");
const contactLinks = document.querySelectorAll(".contact-link");
const span = document.getElementsByClassName("close")[0];
console.log('Modal element:', modal); // Should show the div
console.log('Contact links:', contactLinks); // Should show 1 element
console.log('Modal:', modal);
console.log('Close button:', span);
console.log('Contact links:', contactLinks);

contactLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";
    });
});

contactLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add('show'); // Changed from style.display
    });
});

span.onclick = () => modal.classList.remove('show');
window.onclick = (event) => {
    if (event.target == modal) {
        modal.classList.remove('show');
    }
}

span.addEventListener('click', () => {
    modal.style.display = "none";
});


span.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your submission logic here
    alert('Tack för ditt meddelande!');
    modal.style.display = "none";
});

