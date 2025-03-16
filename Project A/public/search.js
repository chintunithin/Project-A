


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