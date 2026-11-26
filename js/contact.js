const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      contactStatus.textContent = "Please fill out your name, email, and message.";
      contactStatus.className = "status-msg error";
      return;
    }

    contactStatus.textContent = `Thanks, ${name}. Your message has been recorded locally for this project demo.`;
    contactStatus.className = "status-msg info";
    contactForm.reset();
  });
}