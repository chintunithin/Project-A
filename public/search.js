document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll animation
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

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

    // Initialize search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.querySelector('.search-results');
    let currentActiveIndex = -1;

    // Toggle search box
    searchBtn.addEventListener('click', function() {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
            showDefaultResults();
            searchResults.classList.add('active');
        } else {
            searchResults.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    // Handle input
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.trim().toLowerCase();
        if (query.length < 2) {
            showDefaultResults();
            return;
        }
        performSearch(query);
    }, 300));

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        const items = searchResults.querySelectorAll('.search-result-item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentActiveIndex = Math.min(currentActiveIndex + 1, items.length - 1);
                updateActiveItem(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentActiveIndex = Math.max(currentActiveIndex - 1, 0);
                updateActiveItem(items);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentActiveIndex >= 0 && items[currentActiveIndex]) {
                    items[currentActiveIndex].click();
                }
                break;
            case 'Escape':
                searchBox.classList.remove('active');
                searchResults.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
                break;
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchBox.contains(e.target) && !searchBtn.contains(e.target)) {
            searchBox.classList.remove('active');
            searchResults.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    function showDefaultResults() {
        const defaultResults = searchData.slice(0, 6);
        const groupedResults = {
            'Featured Results': defaultResults
        };
        displayResults(groupedResults);
        searchResults.classList.add('active');
        
        // Make first result active by default
        const items = searchResults.querySelectorAll('.search-result-item');
        if (items.length > 0) {
            currentActiveIndex = 0;
            items[0].classList.add('active');
        }
    }

    function updateActiveItem(items) {
        items.forEach((item, index) => {
            if (index === currentActiveIndex) {
                item.classList.add('active');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    function performSearch(query) {
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
            searchResults.classList.add('active');
            return;
        }

        const groupedResults = results.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        displayResults(groupedResults);
        searchResults.classList.add('active');
        
        // Make first result active by default
        const items = searchResults.querySelectorAll('.search-result-item');
        if (items.length > 0) {
            currentActiveIndex = 0;
            items[0].classList.add('active');
        }
    }

    function displayResults(groupedResults) {
        searchResults.innerHTML = '';
        
        Object.entries(groupedResults).forEach(([category, items]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'search-category';
            
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);
            
            items.forEach(item => {
                const resultItem = document.createElement('a');
                resultItem.href = item.url;
                resultItem.className = 'search-result-item';
                
                const icon = document.createElement('i');
                icon.className = `fas ${item.icon}`;
                
                const content = document.createElement('div');
                content.className = 'result-content';
                
                const title = document.createElement('div');
                title.className = 'result-title';
                title.textContent = item.title;
                
                const category = document.createElement('div');
                category.className = 'result-category';
                category.textContent = item.category;
                
                content.appendChild(title);
                content.appendChild(category);
                
                resultItem.appendChild(icon);
                resultItem.appendChild(content);
                categoryDiv.appendChild(resultItem);
            });
            
            searchResults.appendChild(categoryDiv);
        });
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Handle back button navigation
    const backButtons = document.querySelectorAll('.submenu-back');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the closest dropdown or mega menu
            const submenu = this.closest('.nav__dropdown-menu, .nav__mega-menu');
            if (submenu) {
                // Hide the current submenu
                submenu.classList.remove('active');
                
                // Find and show the parent menu
                const parentItem = submenu.closest('.nav__item');
                if (parentItem) {
                    const parentButton = parentItem.querySelector('.nav__dropdown-btn, .nav__mega-btn');
                    if (parentButton) {
                        // Remove active class from parent button
                        parentButton.classList.remove('active');
                        
                        // If it's a mega menu, show the main menu
                        if (parentItem.classList.contains('nav__item--mega')) {
                            const mainMenu = document.querySelector('.nav__menu');
                            if (mainMenu) {
                                mainMenu.classList.add('active');
                            }
                        }
                    }
                }
            }
        });
    });

    // Handle dropdown buttons
    const dropdownButtons = document.querySelectorAll('.nav__dropdown-btn, .nav__mega-btn');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const parentItem = this.closest('.nav__item');
            const submenu = parentItem.querySelector('.nav__dropdown-menu, .nav__mega-menu');
            
            // Close other open menus first
            document.querySelectorAll('.nav__dropdown-menu.active, .nav__mega-menu.active').forEach(menu => {
                if (menu !== submenu) {
                    menu.classList.remove('active');
                    menu.closest('.nav__item').querySelector('.nav__dropdown-btn, .nav__mega-btn').classList.remove('active');
                }
            });
            
            // Toggle current menu
            submenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    });

    // Close menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav__item--dropdown, .nav__item--mega')) {
            document.querySelectorAll('.nav__dropdown-menu.active, .nav__mega-menu.active').forEach(menu => {
                menu.classList.remove('active');
                menu.closest('.nav__item').querySelector('.nav__dropdown-btn, .nav__mega-btn').classList.remove('active');
            });
        }
    });

    // Floating Sidebar Management
    class FloatingSidebar {
        constructor() {
            this.sidebar = document.getElementById('newFloatingSidebar');
            this.handle = document.getElementById('newFloatingHandle');
            this.isOpen = false;
            this.isAnimating = false;
            this.animationDuration = 300; // matches CSS transition duration

            this.init();
        }

        init() {
            if (!this.sidebar || !this.handle) return;

            // Initialize positions
            this.setInitialState();
            
            // Add event listeners
            this.handle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.sidebar.contains(e.target) && !this.handle.contains(e.target)) {
                    this.close();
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth < 768 && this.isOpen) {
                    this.close();
                }
            });
        }

        setInitialState() {
            this.sidebar.style.right = '-320px';
            this.handle.style.right = '0';
            this.updateHandleContent();
        }

        toggle() {
            if (this.isAnimating) return;
            
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            if (this.isAnimating) return;
            
            this.isAnimating = true;
            this.isOpen = true;
            
            // Update positions
            this.sidebar.style.right = '0';
            this.handle.style.right = '320px';
            this.updateHandleContent();
            
            // Add active class for animations
            this.sidebar.classList.add('active');
            this.handle.classList.add('active');
            
            // Reset animation flag after transition
            setTimeout(() => {
                this.isAnimating = false;
            }, this.animationDuration);
        }

        close() {
            if (this.isAnimating) return;
            
            this.isAnimating = true;
            this.isOpen = false;
            
            // Update positions
            this.sidebar.style.right = '-320px';
            this.handle.style.right = '0';
            this.updateHandleContent();
            
            // Remove active class
            this.sidebar.classList.remove('active');
            this.handle.classList.remove('active');
            
            // Reset animation flag after transition
            setTimeout(() => {
                this.isAnimating = false;
            }, this.animationDuration);
        }

        updateHandleContent() {
            const content = this.isOpen ? 
                `<div class="flex items-center space-x-2">
                    <i class="fas fa-chevron-right"></i>
                    <span class="font-medium">Close</span>
                </div>` :
                `<div class="flex items-center space-x-2">
                    <i class="fas fa-chevron-left"></i>
                    <span class="font-medium">Our Pillars</span>
                </div>`;
            
            this.handle.innerHTML = content;
        }
    }

    // Initialize floating sidebar when DOM is loaded
    new FloatingSidebar();
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

// Search data array
const searchData = [
    // Technology Offerings
    { title: 'Mobility', icon: 'fa-mobile-alt', url: '/Mobility', category: 'Technology' },
    { title: 'Integration', icon: 'fa-plug', url: '/integration', category: 'Technology' },
    { title: 'Data Migration', icon: 'fa-database', url: '/data-migrations', category: 'Technology' },
    { title: 'Analytics', icon: 'fa-chart-line', url: '/Analytics', category: 'Technology' },
    
    // Services
    { title: 'Hospitality & Travel', icon: 'fa-hotel', url: '/hospitality', category: 'Services' },
    { title: 'Energy & Utilities', icon: 'fa-bolt', url: '/utilities', category: 'Services' },
    { title: 'Manufacturing', icon: 'fa-industry', url: '/manufacturing', category: 'Services' },
    { title: 'Not-for-Profit', icon: 'fa-hands-helping', url: '/notforprofit', category: 'Services' },
    { title: 'CPG', icon: 'fa-shopping-cart', url: '/consumercpg', category: 'Services' },
    { title: 'Banking & Financial Services', icon: 'fa-university', url: '/banking', category: 'Services' },
    
    // Solutions
    { title: 'Business Process Transformation', icon: 'fa-sync', url: '/businessprocesstransformation', category: 'Solutions' },
    { title: 'Technology Implementation', icon: 'fa-tools', url: '/technologyimplementation', category: 'Solutions' },
    { title: 'Cloud Migration', icon: 'fa-cloud', url: '/cloudmigration', category: 'Solutions' },
    { title: 'Shared and Managed Services', icon: 'fa-users-cog', url: '/ManagedServices', category: 'Solutions' },
    { title: 'Change Management', icon: 'fa-exchange-alt', url: '/changemanagement', category: 'Solutions' },
    { title: 'Design Thinking', icon: 'fa-pencil-ruler', url: '/designthinking', category: 'Solutions' },
    
    // Technologies
    { title: 'AI and ML', icon: 'fa-robot', url: '/alml', category: 'Technologies' },
    { title: 'Analytics and Visualization', icon: 'fa-chart-bar', url: '/dataanalyticsvisualization', category: 'Technologies' },
    { title: 'Digital Skills Training', icon: 'fa-graduation-cap', url: '/digitalskilltraining', category: 'Technologies' },
    
    // Platforms
    { title: 'Salesforce', icon: 'fab fa-salesforce', url: '/salesforce', category: 'Platforms' },
    { title: 'SAP', icon: 'fab fa-sap', url: '/sap', category: 'Platforms' },
    { title: 'ServiceNow', icon: 'fas fa-cogs', url: '/servicenow', category: 'Platforms' },
    { title: 'Microsoft', icon: 'fab fa-microsoft', url: '/microsoft', category: 'Platforms' },
    { title: 'Celonis', icon: 'fas fa-chart-network', url: '/celonis', category: 'Platforms' }
];

function handleBackNavigation(element, event) {
    event.stopPropagation();

    // Get the submenu wrapper (.nav__dropdown-menu or .nav__mega-menu)
    const submenu = element.closest('.nav__dropdown-menu, .nav__mega-menu');
    if (submenu) {
        // Find the parent nav__item
        const parentItem = submenu.closest('.nav__item');
        if (parentItem) {
            // Remove the modifier class to hide the submenu
            if (parentItem.classList.contains('nav__item--dropdown')) {
                parentItem.classList.remove('nav__item--dropdown');
            } else if (parentItem.classList.contains('nav__item--mega')) {
                parentItem.classList.remove('nav__item--mega');
            }

            // Optionally show nav__menu again if needed (mobile view)
            const navMenu = document.querySelector('.nav__menu');
            if (navMenu && !navMenu.classList.contains('active')) {
                navMenu.classList.add('active');
            }

            // Optional: toggle button active state off
            const toggleBtn = parentItem.querySelector('.nav__dropdown-btn, .nav__mega-btn');
            if (toggleBtn) {
                toggleBtn.classList.remove('active');
            }
        }
    }

    // Optionally trigger the nav__toggle if needed
    const toggle = document.querySelector('.nav__toggle');
    if (toggle && !toggle.classList.contains('active')) {
        toggle.click(); // This simulates opening the main menu
    }
}
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
    if (
      e.keyCode == 123 || // F12
      (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) || // Ctrl+Shift+J
      (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) // Ctrl+U
    ) {
      return false;
    }
  }