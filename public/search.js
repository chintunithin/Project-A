

document.addEventListener('DOMContentLoaded', () => {
    
  const searchButton = document.getElementById('searchButton');
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

    let isOpen = false;

    searchButton.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent document click from closing immediately
        isOpen = !isOpen;
        searchContainer.style.display = isOpen ? "block" : "none";
        if (isOpen) {
            document.getElementById("searchInput").focus();
        }
    });

    document.addEventListener("click", function (e) {
        if (!searchContainer.contains(e.target) && isOpen) {
            searchContainer.style.display = "none";
            isOpen = false;
        }
    });
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
    "casestudy": "Case Study"
  };

  const iconMap = {
    'mobility': 'fas fa-mobile-alt',
    'about': 'fas fa-info-circle',
    'integration': 'fas fa-plug',
    'data-migrations': 'fas fa-database',
    'analytics': 'fas fa-chart-line',
    'businessprocesstransformation': 'fas fa-sync',
    'technologyimplementation': 'fas fa-cogs',
    'cloudmigration': 'fas fa-cloud',
    'managedservices': 'fas fa-users-cog',
    'changemanagement': 'fas fa-exchange-alt',
    'designthinking': 'fas fa-lightbulb',
    'alml': 'fas fa-brain',
    'dataanalyticsvisualization': 'fas fa-chart-bar',
    'digitalskilltraining': 'fas fa-graduation-cap',
    'celonis': 'fas fa-chart-network',
    'microsoft': 'fab fa-microsoft',
    'servicenow': 'fas fa-cogs',
    'sap': 'fab fa-sap',
    'salesforce': 'fab fa-salesforce',
    'feedback': 'fas fa-comment-alt',
    'casestudy': 'fas fa-file-alt'
  };

  // Toggle search container visibility
  searchButton.addEventListener('click', (e) => {
    e.stopPropagation();
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
      searchInput.focus();
      displayResults(Object.entries(pages).slice(0, 4));
    }
  });

  // Close search container when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target) && !searchButton.contains(e.target)) {
      searchContainer.classList.remove('active');
    }
  });

  // Handle search input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    if (query === '') {
      displayResults(Object.entries(pages).slice(0, 4));
      return;
    }
    const filtered = Object.entries(pages).filter(([key, title]) =>
      title.toLowerCase().includes(query)
    );
    displayResults(filtered.slice(0, 4));
  });

  function displayResults(results) {
    searchResults.innerHTML = '';
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
      return;
    }
    results.forEach(([key, title]) => {
      const resultItem = document.createElement('a');
      resultItem.href = `/${key}`;
      resultItem.className = 'search-result-item';

      const icon = document.createElement('i');
      icon.className = iconMap[key] || 'fas fa-link';

      const text = document.createElement('span');
      text.textContent = title;

      resultItem.appendChild(icon);
      resultItem.appendChild(text);
      searchResults.appendChild(resultItem);
    });
  }
});


window.addEventListener("scroll", function() {
    const navbar = document.querySelector("nav");
    if (window.scrollY > 50) { // Adjust based on when you want the effect
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
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