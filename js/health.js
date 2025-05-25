/**
 * Health tracking functionality for the LifeSync application
 */

// Sample health data
const sampleHealthData = {
  overallWellness: 82,
  metrics: {
    activity: 75,
    sleep: 90,
    nutrition: 68,
    hydration: 85
  },
  goals: {
    steps: { current: 8245, target: 10000 },
    water: { current: 1.7, target: 2 },
    exercise: { current: 45, target: 60 }
  },
  sleepData: [
    { day: 'Mon', hours: 7 },
    { day: 'Tue', hours: 8 },
    { day: 'Wed', hours: 6 },
    { day: 'Thu', hours: 9 },
    { day: 'Fri', hours: 7.5 },
    { day: 'Sat', hours: 8.5 },
    { day: 'Sun', hours: 7 }
  ],
  activities: [
    { 
      id: 'a001', 
      type: 'running', 
      icon: 'stopwatch',
      title: 'Morning Run', 
      date: '2023-05-25', 
      time: '07:30', 
      duration: 30, 
      distance: 5, 
      calories: 320, 
      pace: '6:00'
    },
    { 
      id: 'a002', 
      type: 'cycling', 
      icon: 'bicycle',
      title: 'Evening Cycling', 
      date: '2023-05-24', 
      time: '18:15', 
      duration: 45, 
      distance: 12, 
      calories: 410, 
      speed: '16'
    },
    { 
      id: 'a003', 
      type: 'gym', 
      icon: 'trophy',
      title: 'Gym Workout', 
      date: '2023-05-23', 
      time: '17:30', 
      duration: 60, 
      calories: 450, 
      category: 'Strength Training'
    },
    { 
      id: 'a004', 
      type: 'yoga', 
      icon: 'heart',
      title: 'Yoga Session', 
      date: '2023-05-22', 
      time: '07:00', 
      duration: 40, 
      calories: 180, 
      category: 'Flexibility'
    }
  ],
  nutrition: {
    caloriesConsumed: 1450,
    calorieGoal: 2100,
    macros: {
      carbs: { amount: 180, target: 300 },
      protein: { amount: 90, target: 120 },
      fat: { amount: 45, target: 100 }
    },
    meals: [
      {
        id: 'm001',
        type: 'breakfast',
        icon: 'sunrise',
        title: 'Breakfast',
        time: '07:30',
        calories: 420,
        description: 'Avocado toast with eggs, orange juice',
        macros: { carbs: 45, protein: 20, fat: 18 }
      },
      {
        id: 'm002',
        type: 'lunch',
        icon: 'sun',
        title: 'Lunch',
        time: '12:15',
        calories: 650,
        description: 'Grilled chicken salad, whole grain bread, green tea',
        macros: { carbs: 75, protein: 40, fat: 15 }
      },
      {
        id: 'm003',
        type: 'snack',
        icon: 'apple',
        title: 'Snack',
        time: '15:30',
        calories: 180,
        description: 'Greek yogurt with berries and honey',
        macros: { carbs: 25, protein: 12, fat: 5 }
      },
      {
        id: 'm004',
        type: 'dinner',
        icon: 'moon',
        title: 'Dinner',
        time: '19:00',
        calories: 580,
        description: 'Salmon with quinoa and steamed vegetables',
        macros: { carbs: 60, protein: 35, fat: 18 }
      }
    ]
  }
};

// Initialize Health Functionality
const initHealth = () => {
  // Load health data from local storage or use sample data
  const healthData = getFromLocalStorage('healthData', sampleHealthData);
  
  // Initialize health overview
  initHealthOverview(healthData);
  
  // Initialize activity tracking
  initActivityTracking(healthData);
  
  // Initialize nutrition tracking
  initNutritionTracking(healthData);
  
  // Initialize circular progress indicators
  initCircularProgress();
  
  // Handle log activity button
  const logActivityBtn = $('.activity-header button');
  if (logActivityBtn) {
    logActivityBtn.addEventListener('click', () => {
      showActivityForm();
    });
  }
  
  // Handle log meal button
  const logMealBtn = $('.nutrition-header button');
  if (logMealBtn) {
    logMealBtn.addEventListener('click', () => {
      showMealForm();
    });
  }
};

// Initialize Health Overview
const initHealthOverview = (healthData) => {
  // Update overall wellness
  const wellnessProgress = $('.health-stat-card .circular-progress');
  if (wellnessProgress) {
    wellnessProgress.setAttribute('data-value', healthData.overallWellness);
    wellnessProgress.style.setProperty('--value', healthData.overallWellness);
    
    const wellnessValue = $('.health-stat-card .circular-progress .inner');
    if (wellnessValue) {
      wellnessValue.textContent = `${healthData.overallWellness}%`;
    }
  }
  
  // Update health metrics
  Object.entries(healthData.metrics).forEach(([metric, value]) => {
    const metricElement = $(`.metric-info h5:contains("${capitalizeFirstLetter(metric)}")`).closest('.metric-info').querySelector('p');
    if (metricElement) {
      metricElement.textContent = `${value}%`;
    }
  });
  
  // Update health goals
  Object.entries(healthData.goals).forEach(([goal, data]) => {
    const progressElement = $(`.goal-title:contains("${capitalizeFirstLetter(goal)}")`).closest('.goal-details').querySelector('.goal-progress .progress-bar');
    if (progressElement) {
      const percentage = (data.current / data.target) * 100;
      progressElement.style.width = `${percentage}%`;
      progressElement.setAttribute('aria-valuenow', percentage);
    }
    
    const valueElement = $(`.goal-title:contains("${capitalizeFirstLetter(goal)}")`).closest('.goal-details').querySelector('.goal-progress span');
    if (valueElement) {
      valueElement.textContent = `${data.current} / ${data.target}${goal === 'water' ? ' Liters' : goal === 'exercise' ? ' Minutes' : ''}`;
    }
  });
  
  // Update sleep chart
  healthData.sleepData.forEach((day, index) => {
    const sleepBar = $(`.sleep-day:nth-child(${index + 1}) .sleep-bar`);
    if (sleepBar) {
      const percentage = (day.hours / 9) * 100; // Assuming 9 hours is ideal/max
      sleepBar.style.height = `${percentage}%`;
    }
    
    const sleepHours = $(`.sleep-day:nth-child(${index + 1}) p:last-child`);
    if (sleepHours) {
      sleepHours.textContent = `${day.hours}h`;
    }
  });
  
  // Calculate and update sleep average
  const sleepAverage = healthData.sleepData.reduce((total, day) => total + day.hours, 0) / healthData.sleepData.length;
  const sleepAverageElement = $('.sleep-average strong');
  if (sleepAverageElement) {
    sleepAverageElement.textContent = `${sleepAverage.toFixed(1)} hours`;
  }
};

// Initialize Activity Tracking
const initActivityTracking = (healthData) => {
  // Update activity statistics
  const activityTime = $('.activity-stat:nth-child(1) .stat-value');
  if (activityTime) {
    const totalMinutes = healthData.activities.reduce((total, activity) => total + activity.duration, 0);
    activityTime.textContent = `${totalMinutes} mins`;
  }
  
  const activityCalories = $('.activity-stat:nth-child(2) .stat-value');
  if (activityCalories) {
    const totalCalories = healthData.activities.reduce((total, activity) => total + activity.calories, 0);
    activityCalories.textContent = totalCalories.toString();
  }
  
  const activityDistance = $('.activity-stat:nth-child(3) .stat-value');
  if (activityDistance) {
    const totalDistance = healthData.activities
      .filter(activity => activity.distance)
      .reduce((total, activity) => total + activity.distance, 0);
    activityDistance.textContent = `${totalDistance.toFixed(1)} km`;
  }
  
  // Update activity chart
  const activityData = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 60 },
    { day: 'Thu', minutes: 38 },
    { day: 'Fri', minutes: 45 },
    { day: 'Sat', minutes: 70 },
    { day: 'Sun', minutes: 15 }
  ];
  
  activityData.forEach((day, index) => {
    const activityBar = $(`.activity-day:nth-child(${index + 1}) .activity-bar`);
    if (activityBar) {
      const percentage = (day.minutes / 75) * 100; // Assuming 75 minutes is max
      activityBar.style.height = `${percentage}%`;
    }
    
    const activityMinutes = $(`.activity-day:nth-child(${index + 1}) p:last-child`);
    if (activityMinutes) {
      activityMinutes.textContent = `${day.minutes}m`;
    }
  });
  
  // Render recent activities
  renderRecentActivities(healthData.activities);
};

// Render Recent Activities
const renderRecentActivities = (activities) => {
  const activitiesContainer = $('.activity-list');
  if (!activitiesContainer) return;
  
  // Clear current activities
  activitiesContainer.innerHTML = '';
  
  // Sort activities by date (most recent first)
  const sortedActivities = [...activities].sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
  
  // Render each activity
  sortedActivities.forEach(activity => {
    const activityElement = createActivityElement(activity);
    activitiesContainer.appendChild(activityElement);
  });
};

// Create Activity Element
const createActivityElement = (activity) => {
  // This function would create the HTML element for an activity
  const activityDate = new Date(activity.date + 'T' + activity.time);
  let dateDisplay;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (activityDate.toDateString() === today.toDateString()) {
    dateDisplay = 'Today';
  } else if (activityDate.toDateString() === yesterday.toDateString()) {
    dateDisplay = 'Yesterday';
  } else {
    dateDisplay = formatDate(activityDate);
  }
  
  const activityDiv = document.createElement('div');
  activityDiv.className = 'activity-list-item';
  activityDiv.setAttribute('data-id', activity.id);
  
  // Add activity content
  activityDiv.innerHTML = `
    <div class="activity-list-icon ${activity.type}"><i class="bi bi-${activity.icon}"></i></div>
    <div class="activity-list-details">
      <h6>${activity.title}</h6>
      <p class="activity-list-meta">${dateDisplay}, ${formatTime(activityDate)} · ${activity.duration} minutes${activity.distance ? ` · ${activity.distance} km` : ''}</p>
      <div class="activity-list-stats">
        <span><i class="bi bi-lightning"></i> ${activity.calories} cal</span>
        ${activity.pace ? `<span><i class="bi bi-speedometer2"></i> ${activity.pace} min/km</span>` : ''}
        ${activity.speed ? `<span><i class="bi bi-speedometer2"></i> ${activity.speed} km/h</span>` : ''}
        ${activity.category ? `<span><i class="bi bi-award"></i> ${activity.category}</span>` : ''}
      </div>
    </div>
  `;
  
  return activityDiv;
};

// Initialize Nutrition Tracking
const initNutritionTracking = (healthData) => {
  const nutrition = healthData.nutrition;
  
  // Update calorie display
  const calorieValue = $('.calorie-value');
  if (calorieValue) {
    calorieValue.textContent = nutrition.caloriesConsumed.toString();
  }
  
  const calorieTarget = $('.calorie-target');
  if (calorieTarget) {
    calorieTarget.textContent = `/ ${nutrition.calorieGoal}`;
  }
  
  // Update progress ring
  const progressRing = $('.progress-ring');
  if (progressRing) {
    const percentage = (nutrition.caloriesConsumed / nutrition.calorieGoal) * 100;
    progressRing.style.background = `conic-gradient(var(--primary) ${percentage}%, #eee 0)`;
  }
  
  // Update macro breakdowns
  Object.entries(nutrition.macros).forEach(([macro, data]) => {
    const macroProgress = $(`.breakdown-item:contains("${capitalizeFirstLetter(macro)}") .progress-bar`);
    if (macroProgress) {
      const percentage = (data.amount / data.target) * 100;
      macroProgress.style.width = `${percentage}%`;
      macroProgress.setAttribute('aria-valuenow', percentage);
    }
    
    const macroValue = $(`.breakdown-item:contains("${capitalizeFirstLetter(macro)}") .breakdown-value`);
    if (macroValue) {
      macroValue.textContent = `${data.amount}g`;
    }
  });
  
  // Render meals
  renderMeals(nutrition.meals);
};

// Render Meals
const renderMeals = (meals) => {
  const mealsContainer = $('.meal-items');
  if (!mealsContainer) return;
  
  // Clear current meals
  mealsContainer.innerHTML = '';
  
  // Sort meals by time
  const sortedMeals = [...meals].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });
  
  // Render each meal
  sortedMeals.forEach(meal => {
    const mealElement = createMealElement(meal);
    mealsContainer.appendChild(mealElement);
  });
};

// Create Meal Element
const createMealElement = (meal) => {
  // This function would create the HTML element for a meal
  const mealDiv = document.createElement('div');
  mealDiv.className = 'meal-item';
  mealDiv.setAttribute('data-id', meal.id);
  
  // Format time to 12-hour format
  const [hours, minutes] = meal.time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  
  // Add meal content
  mealDiv.innerHTML = `
    <div class="meal-icon ${meal.type}"><i class="bi bi-${meal.icon}"></i></div>
    <div class="meal-details">
      <div class="meal-header">
        <h6>${meal.title}</h6>
        <span>${formattedTime} · ${meal.calories} cal</span>
      </div>
      <p>${meal.description}</p>
      <div class="meal-nutrients">
        <span>Carbs: ${meal.macros.carbs}g</span>
        <span>Protein: ${meal.macros.protein}g</span>
        <span>Fat: ${meal.macros.fat}g</span>
      </div>
    </div>
  `;
  
  return mealDiv;
};

// Show Activity Form
const showActivityForm = (activityToEdit = null) => {
  // Logic to show a form/modal for creating/editing an activity
  console.log('Showing activity form', activityToEdit ? 'for editing' : 'for creating new activity');
  
  // If activityToEdit is provided, populate the form with its data
  if (activityToEdit) {
    console.log('Editing activity:', activityToEdit);
  }
};

// Show Meal Form
const showMealForm = (mealToEdit = null) => {
  // Logic to show a form/modal for creating/editing a meal
  console.log('Showing meal form', mealToEdit ? 'for editing' : 'for creating new meal');
  
  // If mealToEdit is provided, populate the form with its data
  if (mealToEdit) {
    console.log('Editing meal:', mealToEdit);
  }
};

// Log New Activity
const logActivity = (activityData) => {
  // Load current health data
  const healthData = getFromLocalStorage('healthData', sampleHealthData);
  
  // Create new activity object
  const newActivity = {
    id: generateId(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    ...activityData
  };
  
  // Add to activities list
  healthData.activities.unshift(newActivity);
  
  // Update metrics based on new activity
  healthData.metrics.activity = Math.min(100, healthData.metrics.activity + 5);
  healthData.overallWellness = calculateOverallWellness(healthData.metrics);
  
  // Save updated health data
  if (saveToLocalStorage('healthData', healthData)) {
    // Update UI
    initHealthOverview(healthData);
    initActivityTracking(healthData);
    return true;
  }
  
  return false;
};

// Log New Meal
const logMeal = (mealData) => {
  // Load current health data
  const healthData = getFromLocalStorage('healthData', sampleHealthData);
  
  // Create new meal object
  const newMeal = {
    id: generateId(),
    ...mealData
  };
  
  // Add to meals list
  healthData.nutrition.meals.push(newMeal);
  
  // Update nutrition metrics
  healthData.nutrition.caloriesConsumed += newMeal.calories;
  healthData.nutrition.macros.carbs.amount += newMeal.macros.carbs;
  healthData.nutrition.macros.protein.amount += newMeal.macros.protein;
  healthData.nutrition.macros.fat.amount += newMeal.macros.fat;
  
  // Update overall nutrition metric
  const nutritionPercentage = (healthData.nutrition.caloriesConsumed / healthData.nutrition.calorieGoal) * 100;
  healthData.metrics.nutrition = Math.min(100, nutritionPercentage);
  
  // Recalculate overall wellness
  healthData.overallWellness = calculateOverallWellness(healthData.metrics);
  
  // Save updated health data
  if (saveToLocalStorage('healthData', healthData)) {
    // Update UI
    initHealthOverview(healthData);
    initNutritionTracking(healthData);
    return true;
  }
  
  return false;
};

// Calculate Overall Wellness
const calculateOverallWellness = (metrics) => {
  // Simple weighted average of metrics
  const weights = {
    activity: 0.3,
    sleep: 0.3,
    nutrition: 0.25,
    hydration: 0.15
  };
  
  let overallScore = 0;
  let totalWeight = 0;
  
  Object.entries(metrics).forEach(([metric, value]) => {
    if (weights[metric]) {
      overallScore += value * weights[metric];
      totalWeight += weights[metric];
    }
  });
  
  return Math.round(overallScore / totalWeight);
};