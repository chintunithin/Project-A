document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Handle scroll effect
    window.addEventListener("scroll", function() {
        const navbar = document.querySelector("nav");
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
});

function showDownloadPopup() {
  Swal.fire({
      title: 'Download Case Study',
      html: `<div class="form-container">
              <input type="text" id="name" placeholder="Enter your name" required>
              <input type="email" id="email" placeholder="Enter your email" required>
             </div>`,
      confirmButtonText: 'Download',
      showCancelButton: true,
      preConfirm: async () => {
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email RegEx

          if (!name || !email) {
              Swal.showValidationMessage('Please enter both name and email');
              return false;
          }
          if (!emailPattern.test(email)) {
            Swal.showValidationMessage('Please enter a valid email address');
            return false;
        }

          try {
              // Send data to server to store in database
              const response = await fetch('/save-download', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email })
              });

              const result = await response.json();

              if (!result.success) {
                  throw new Error(result.error);
              }

              // Start PDF download
              const link = document.createElement('a');
              link.href = '/files/CollectionDetailPrint20241009.pdf';
              link.download = 'CaseStudy.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              Swal.fire('Success', 'Your download is starting!', 'success');
          } catch (error) {
              console.error('❌ Error:', error);
              Swal.fire('Error', 'Something went wrong. Try again!', 'error');
          }
      }
  });
}