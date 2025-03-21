


const pages = {
    "mobility": "Mobility Solutions",
    "about": "About Us",
    "integration": "System Integrations",
    "data-migrations": "Data Migration Services",
    "analytics": "Business Analytics",
    "businessprocesstransformation": "Business Process Transformation",
    "technologyimplementation": "Technology Implementation",
    "cloudmigration": "Cloud Migration Services",
    "managedservices": "Managed IT Services",
    "changemanagement": "Change Management",
    "designthinking": "Design Thinking",
    "alml": "AI & Machine Learning",
    "dataanalyticsvisualization": "Data Analytics & Visualization",
    "digitalskilltraining": "Digital Skills Training",
    "celonis": "Celonis Process Mining",
    "microsoft": "Microsoft Solutions",
    "servicenow": "ServiceNow Platform",
    "sap": "SAP Enterprise Solutions",
    "salesforce": "Salesforce CRM",
    "feedback": "Customer Feedback",
    "casestudy":"Case Study",
    "about":"About"
};

function toggleSearch() {
    let searchBox = document.getElementById("searchBox");
    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
        document.getElementById("searchInput").focus();
    }
}

function filterPages() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    if (input === "") {
        resultsContainer.style.display = "none";
        return;
    }

    let filteredPages = Object.keys(pages).filter(page => pages[page].toLowerCase().includes(input));

    if (filteredPages.length > 0) {
        resultsContainer.style.display = "block";
        filteredPages.forEach(page => {
            let li = document.createElement("li");
            li.innerHTML = `<a href="/${page}">${pages[page]}</a>`;
            resultsContainer.appendChild(li);
        });
    } else {
        resultsContainer.style.display = "none";
    }
}

window.addEventListener("scroll", function() {
    const navbar = document.querySelector("nav");
    if (window.scrollY > 50) { // Adjust based on when you want the effect
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('floatingSidebar');
    const handle = document.getElementById('floatingHandle');
    let hideTimeout;
  
    window.toggleSidebar = function () {
      if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
        handle.style.display = 'none';
        startHideTimeout();
      } else {
        sidebar.classList.add('translate-x-full');
        handle.style.display = 'flex';
        clearHideTimeout();
      }
    };
  
    window.startHideTimeout = function () {
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        sidebar.classList.add('translate-x-full');
        handle.style.display = 'flex';
      }, 3000);
    };
  
    window.clearHideTimeout = function () {
      clearTimeout(hideTimeout);
    };
  });
  document.addEventListener("DOMContentLoaded", function() {
    const titleText = "DAWN DIGITAL TECHNOLOGY";
    const subtitleText = "YOUR AI PARTNER FOR SCALABLE, FUTURE-READY ENTERPRISES";
    const titleElement = document.getElementById("title");
    const subtitleElement = document.getElementById("subtitle");
    
    titleText.split("").forEach((char, index) => {
        let span = document.createElement("span");
        span.textContent = char;
        span.style.animationDelay = `${index * 0.05}s`;
        titleElement.appendChild(span);
    });
    
    subtitleText.split("").forEach((char, index) => {
        let span = document.createElement("span");
        span.textContent = char;
        span.style.animationDelay = `${index * 0.03}s`;
        subtitleElement.appendChild(span);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  let popup = document.getElementById('lipopup');
  let popupContent = document.getElementById('lipopup-content');

  function onListItemClick(event, content) {
      if (!popup || !popupContent) {
          console.error("Popup elements not found!");
          return;
      }

      popupContent.innerHTML = content;
      popup.style.display = 'block';

      let rect = event.target.getBoundingClientRect();

      popup.style.top = `${window.scrollY + rect.bottom + 5}px`; // 5px gap below item
      popup.style.left = `${window.scrollX + rect.left}px`; // Align with left of item
  }

  document.addEventListener('click', function (event) {
      if (!event.target.closest('li')) {
          popup.style.display = 'none';
      }
  });

  document.addEventListener('scroll', function () {
      popup.style.display = 'none';
  });

  window.onListItemClick = onListItemClick;
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


async function getFileSizeAndType(url) {
  try {
      let response = await fetch(url, { method: 'HEAD' });
      let fileSize = response.headers.get('content-length');
      let fileType = response.headers.get('content-type');

      if (fileSize) {
          fileSize = (fileSize / (1024 * 1024)).toFixed(2) + "MB"; // Convert bytes to MB
      } else {
          fileSize = "Unknown Size";
      }

      let extension = fileType ? `.${fileType.split('/')[1]}` : ".unknown";
      document.getElementById('file-info').innerText = `${fileSize} ${extension}`;
  } catch (error) {
      document.getElementById('file-info').innerText = "Failed to fetch size";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getFileSizeAndType('/files/CollectionDetailPrint20241009.pdf'); // Replace with your actual file path
});