/**
 * Navigation functionality for the LifeSync application
 */

// Initialize Navigation
const initNavigation = () => {
  const sidebarMenuItems = document.querySelectorAll('.sidebar-menu li');
  const pages = document.querySelectorAll('.page');
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const viewAllLinks = document.querySelectorAll('.view-all');
  
  // Handle sidebar menu item clicks
  sidebarMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetPage = item.getAttribute('data-page');
      
      // Update active state in sidebar
      sidebarMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
      item.classList.add('active');
      
      // Show the selected page
      pages.forEach(page => {
        if (page.id === targetPage) {
          page.classList.add('active');
          setPageTitle(capitalizeFirstLetter(targetPage));
        } else {
          page.classList.remove('active');
        }
      });
      
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 768) {
        sidebar.classList.remove('show');
      }
      
      // Save current page to local storage
      saveToLocalStorage('currentPage', targetPage);
    });
  });
  
  // Handle "View All" links
  viewAllLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-page');
      
      // Find and click the corresponding sidebar item
      const targetSidebarItem = Array.from(sidebarMenuItems).find(
        item => item.getAttribute('data-page') === targetPage
      );
      
      if (targetSidebarItem) {
        targetSidebarItem.click();
      }
    });
  });
  
  // Mobile sidebar toggle
  mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 && 
        sidebar.classList.contains('show') && 
        !sidebar.contains(e.target) && 
        e.target !== mobileToggle) {
      sidebar.classList.remove('show');
    }
  });
  
  // Initialize from saved state or default to dashboard
  const savedPage = getFromLocalStorage('currentPage', 'dashboard');
  const targetSidebarItem = Array.from(sidebarMenuItems).find(
    item => item.getAttribute('data-page') === savedPage
  );
  
  if (targetSidebarItem) {
    targetSidebarItem.click();
  } else {
    // Default to first item if saved page not found
    sidebarMenuItems[0].click();
  }
};

// Initialize settings navigation
const initSettingsNavigation = () => {
  const settingsNavItems = document.querySelectorAll('.settings-nav-item');
  const settingsSections = document.querySelectorAll('.settings-section');
  
  settingsNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSettings = item.getAttribute('data-settings');
      
      // Update active state in settings nav
      settingsNavItems.forEach(navItem => navItem.classList.remove('active'));
      item.classList.add('active');
      
      // Show the selected settings section
      settingsSections.forEach(section => {
        if (section.id === `${targetSettings}-settings`) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    });
  });
};

// Initialize Floating Action Button
const initFloatingActionButton = () => {
  const fab = document.getElementById('fab');
  
  fab.addEventListener('click', () => {
    const currentPage = getCurrentPage();
    
    // Different actions based on current page
    switch (currentPage) {
      case 'diary':
        // Show new diary entry form/modal
        console.log('Create new diary entry');
        break;
      case 'agenda':
        // Show new event form/modal
        console.log('Create new event');
        break;
      case 'finance':
        // Show new transaction form/modal
        console.log('Add new transaction');
        break;
      case 'health':
        // Show activity logging form/modal
        console.log('Log new activity');
        break;
      default:
        // Default action or quick actions menu
        console.log('Default FAB action');
    }
  });
};

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};