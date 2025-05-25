/**
 * Main initialization script for the LifeSync application
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize utility functions
  initThemeToggle();
  
  // Initialize navigation
  initNavigation();
  
  // Initialize settings navigation
  initSettingsNavigation();
  
  // Initialize floating action button
  initFloatingActionButton();
  
  // Initialize circular progress indicators
  initCircularProgress();
  
  // Initialize page-specific functionality
  initPageFunctionality();
  
  // Set default page title
  setPageTitle();
});

// Initialize functionality based on current page
const initPageFunctionality = () => {
  // Get current page
  const currentPage = getCurrentPage();
  
  // Initialize page-specific functionality
  switch (currentPage) {
    case 'dashboard':
      // Dashboard combines elements from all pages, so initialize all
      initDiary();
      initAgenda();
      initFinance();
      initHealth();
      break;
    case 'diary':
      initDiary();
      break;
    case 'agenda':
      initAgenda();
      break;
    case 'finance':
      initFinance();
      break;
    case 'health':
      initHealth();
      break;
    default:
      // Default initialization (for dashboard or unknown pages)
      break;
  }
};

// Handle element selection using contains text
// This polyfill allows for selecting elements that contain specific text
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// Extend querySelector to support :contains
const originalQuerySelector = Element.prototype.querySelector;
Element.prototype.querySelector = function(selector) {
  if (selector.includes(':contains(')) {
    const match = selector.match(/:contains\(['"]([^'"]+)['"]\)/);
    if (match) {
      const searchText = match[1];
      const plainSelector = selector.replace(/:contains\(['"]([^'"]+)['"]\)/, '');
      
      const elements = Array.from(this.querySelectorAll(plainSelector || '*'));
      return elements.find(element => element.textContent.includes(searchText)) || null;
    }
  }
  return originalQuerySelector.call(this, selector);
};

// Helper function to capitalize the first letter (defined in multiple files for modularity)
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};