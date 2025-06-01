// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const dropdownBtns = document.querySelectorAll('.nav__dropdown-btn, .nav__mega-btn');
    const backButtons = document.querySelectorAll('.submenu-back');

    // Toggle main menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Handle dropdown and mega menu buttons
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = btn.parentElement;
            const menu = parent.querySelector('.nav__dropdown-menu, .nav__mega-menu');
            
            // Close other open menus
            document.querySelectorAll('.nav__item--dropdown.active, .nav__item--mega.active').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                    item.querySelector('.nav__dropdown-btn, .nav__mega-btn').classList.remove('active');
                    const openMenu = item.querySelector('.nav__dropdown-menu.active, .nav__mega-menu.active');
                    if (openMenu) openMenu.classList.remove('active');
                }
            });

            // Open current submenu
            parent.classList.add('active');
            btn.classList.add('active');
            if (menu) menu.classList.add('active');
        });
    });

    // Helper to open main menu and close all submenus
    function openMainMenu() {
        // Close all submenus and triggers
        document.querySelectorAll('.nav__dropdown-menu.active, .nav__mega-menu.active').forEach(menu => menu.classList.remove('active'));
        document.querySelectorAll('.nav__item--dropdown.active, .nav__item--mega.active').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.nav__dropdown-btn.active, .nav__mega-btn.active').forEach(btn => btn.classList.remove('active'));
        // Ensure main menu is open
        if (!navMenu.classList.contains('active')) navMenu.classList.add('active');
        console.log('Back to main menu');
    }

    // Add direct event listeners for submenu back buttons by ID
    const backBtnDropdown = document.getElementById('submenu-back');
    if (backBtnDropdown) {
        backBtnDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            openMainMenu();
        });
    }
    const backBtnMega = document.getElementById('submenu-back-mega');
    if (backBtnMega) {
        backBtnMega.addEventListener('click', function(e) {
            e.preventDefault();
            openMainMenu();
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav__menu') && !e.target.closest('.nav__toggle')) {
            navMenu.classList.remove('active');
            document.querySelectorAll('.nav__item--dropdown.active, .nav__item--mega.active').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.nav__dropdown-btn, .nav__mega-btn').classList.remove('active');
            });
        }
    });
}); 