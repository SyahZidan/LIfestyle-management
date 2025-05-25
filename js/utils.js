/**
 * Utility functions for the LifeSync application
 */

// DOM Helper Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Local Storage Functions
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return defaultValue;
  }
};

// Date Formatting Functions
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString(undefined, options);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Animation Helper
const animateElement = (element, animationClass, duration = 300) => {
  element.classList.add(animationClass);
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
};

// Generate Random ID
const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// Dark Mode Toggle
const initThemeToggle = () => {
  const themeSwitch = $('#themeSwitch');
  const savedTheme = getFromLocalStorage('theme', 'light');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeSwitch.checked = true;
  }
  
  themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
      document.body.classList.add('dark-mode');
      saveToLocalStorage('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      saveToLocalStorage('theme', 'light');
    }
  });
};

// Get Current Page
const getCurrentPage = () => {
  const activePage = $('.page.active');
  return activePage ? activePage.id : null;
};

// Set Page Title
const setPageTitle = (title) => {
  document.title = title ? `${title} | LifeSync` : 'LifeSync - Your Lifestyle Companion';
};

// Initialize Circular Progress
const initCircularProgress = () => {
  const circularProgress = $$('.circular-progress');
  
  circularProgress.forEach(progress => {
    const value = progress.getAttribute('data-value');
    progress.style.setProperty('--value', value);
  });
};