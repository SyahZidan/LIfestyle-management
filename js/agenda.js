/**
 * Agenda functionality for the LifeSync application
 */

// Sample events data
const sampleEvents = [
  {
    id: 'e001',
    title: 'Team Meeting',
    date: '2023-05-26',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Conference Room',
    category: 'work',
    description: 'Weekly team meeting to discuss project progress'
  },
  {
    id: 'e002',
    title: 'Dinner with Sarah',
    date: '2023-05-28',
    startTime: '19:30',
    endTime: '21:30',
    location: 'Italian Restaurant',
    category: 'social',
    description: 'Catching up with Sarah after her trip'
  },
  {
    id: 'e003',
    title: 'Gym Session',
    date: '2023-05-30',
    startTime: '14:00',
    endTime: '15:30',
    location: 'FitLife Gym',
    category: 'health',
    description: 'Full body workout with trainer'
  },
  {
    id: 'e004',
    title: 'Doctor\'s Appointment',
    date: '2023-06-02',
    startTime: '09:00',
    endTime: '10:00',
    location: 'City Medical Center',
    category: 'personal',
    description: 'Annual health checkup'
  },
  {
    id: 'e005',
    title: 'Project Deadline',
    date: '2023-06-05',
    startTime: '09:00',
    endTime: '18:00',
    location: 'Office',
    category: 'work',
    description: 'Final submission for client project'
  },
  {
    id: 'e006',
    title: 'Concert',
    date: '2023-05-20',
    startTime: '20:00',
    endTime: '23:00',
    location: 'City Arena',
    category: 'music',
    description: 'Live concert with favorite band'
  }
];

// Initialize Agenda Functionality
const initAgenda = () => {
  // Load events from local storage or use sample data
  const events = getFromLocalStorage('events', sampleEvents);
  
  // Initialize calendar
  initCalendar();
  
  // Handle new event button
  const newEventBtn = $('.new-event-btn');
  if (newEventBtn) {
    newEventBtn.addEventListener('click', () => {
      showEventForm();
    });
  }
  
  // Initialize event actions (edit, delete)
  initEventActions();
};

// Initialize Calendar
const initCalendar = () => {
  // Load current month/year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Set current month display
  const currentMonthElement = $('.current-month');
  if (currentMonthElement) {
    currentMonthElement.textContent = new Date(currentYear, currentMonth).toLocaleDateString('default', { month: 'long', year: 'numeric' });
  }
  
  // Initialize calendar navigation
  initCalendarNavigation();
  
  // Render calendar for current month
  renderCalendar(currentMonth, currentYear);
};

// Initialize Calendar Navigation
const initCalendarNavigation = () => {
  const prevMonthBtn = $('.calendar-navigation button:first-child');
  const nextMonthBtn = $('.calendar-navigation button:last-child');
  const currentMonthElement = $('.current-month');
  
  if (prevMonthBtn && nextMonthBtn && currentMonthElement) {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      currentMonthElement.textContent = new Date(currentYear, currentMonth).toLocaleDateString('default', { month: 'long', year: 'numeric' });
      renderCalendar(currentMonth, currentYear);
    });
    
    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      currentMonthElement.textContent = new Date(currentYear, currentMonth).toLocaleDateString('default', { month: 'long', year: 'numeric' });
      renderCalendar(currentMonth, currentYear);
    });
  }
};

// Render Calendar
const renderCalendar = (month, year) => {
  const calendarBody = $('.calendar-body');
  if (!calendarBody) return;
  
  // Clear current calendar
  calendarBody.innerHTML = '';
  
  // Get events for this month
  const events = getFromLocalStorage('events', sampleEvents);
  const eventsThisMonth = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get last day of previous month
  const lastDayPrevMonth = new Date(year, month, 0).getDate();
  
  // Get current date
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Create days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = lastDayPrevMonth - i;
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day inactive';
    dayElement.innerHTML = `<span>${day}</span>`;
    calendarBody.appendChild(dayElement);
  }
  
  // Create days for current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    // Add weekend class
    const dayOfWeek = new Date(year, month, i).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dayElement.classList.add('weekend');
    }
    
    // Add today class
    if (i === currentDay && month === currentMonth && year === currentYear) {
      dayElement.classList.add('today');
    }
    
    dayElement.innerHTML = `<span>${i}</span>`;
    
    // Add event dots
    const eventsOnThisDay = eventsThisMonth.filter(event => {
      const eventDay = new Date(event.date).getDate();
      return eventDay === i;
    });
    
    eventsOnThisDay.forEach(event => {
      const eventDot = document.createElement('div');
      eventDot.className = `event-dot ${event.category}`;
      dayElement.appendChild(eventDot);
    });
    
    // Add click event to show events for this day
    dayElement.addEventListener('click', () => {
      const clickedDate = new Date(year, month, i);
      showEventsForDate(clickedDate);
    });
    
    calendarBody.appendChild(dayElement);
  }
  
  // Fill remaining slots with days from next month
  const totalDaysDisplayed = firstDay + daysInMonth;
  const remainingSlots = 42 - totalDaysDisplayed; // 6 rows of 7 days
  
  for (let i = 1; i <= remainingSlots; i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day inactive';
    dayElement.innerHTML = `<span>${i}</span>`;
    calendarBody.appendChild(dayElement);
  }
};

// Show Events for a Specific Date
const showEventsForDate = (date) => {
  console.log('Showing events for date:', date.toLocaleDateString());
  
  // Get events for this date
  const events = getFromLocalStorage('events', sampleEvents);
  const eventsOnDate = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === date.toDateString();
  });
  
  // Display events (could show in a modal or highlight in the list)
  console.log('Events on this date:', eventsOnDate);
};

// Show Event Form
const showEventForm = (eventToEdit = null) => {
  // Logic to show a form/modal for creating/editing an event
  console.log('Showing event form', eventToEdit ? 'for editing' : 'for creating new event');
  
  // If eventToEdit is provided, populate the form with its data
  if (eventToEdit) {
    console.log('Editing event:', eventToEdit);
  }
};

// Initialize Event Actions
const initEventActions = () => {
  // Edit buttons
  const editButtons = $$('.event-item .event-actions button:first-child');
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventItem = button.closest('.event-item');
      const eventId = eventItem.getAttribute('data-id');
      editEvent(eventId);
    });
  });
  
  // Delete buttons
  const deleteButtons = $$('.event-item .event-actions button:last-child');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventItem = button.closest('.event-item');
      const eventId = eventItem.getAttribute('data-id');
      deleteEvent(eventId);
    });
  });
};

// Edit Event
const editEvent = (eventId) => {
  console.log('Editing event with ID:', eventId);
  
  // Find the event to edit
  const events = getFromLocalStorage('events', sampleEvents);
  const eventToEdit = events.find(event => event.id === eventId);
  
  if (eventToEdit) {
    showEventForm(eventToEdit);
  } else {
    console.error('Event not found');
  }
};

// Delete Event
const deleteEvent = (eventId) => {
  console.log('Deleting event with ID:', eventId);
  
  // Confirm deletion
  if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
    // Remove event from local storage
    const events = getFromLocalStorage('events', sampleEvents);
    const updatedEvents = events.filter(event => event.id !== eventId);
    
    if (saveToLocalStorage('events', updatedEvents)) {
      // Remove event from UI
      const eventItem = $(`[data-id="${eventId}"]`);
      if (eventItem) {
        eventItem.remove();
      }
      
      // Update calendar to reflect the change
      const currentMonthElement = $('.current-month');
      if (currentMonthElement) {
        const [month, year] = currentMonthElement.textContent.split(' ');
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
        renderCalendar(monthIndex, parseInt(year));
      }
    }
  }
};

// Create New Event
const createEvent = (eventData) => {
  // Create a new event object
  const newEvent = {
    id: generateId(),
    ...eventData
  };
  
  // Add to storage
  const events = getFromLocalStorage('events', sampleEvents);
  const updatedEvents = [...events, newEvent];
  
  if (saveToLocalStorage('events', updatedEvents)) {
    // Update UI
    renderUpcomingEvents(updatedEvents);
    
    // Update calendar
    const currentMonthElement = $('.current-month');
    if (currentMonthElement) {
      const [month, year] = currentMonthElement.textContent.split(' ');
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
      renderCalendar(monthIndex, parseInt(year));
    }
    
    return true;
  }
  
  return false;
};

// Render Upcoming Events
const renderUpcomingEvents = (events) => {
  const eventsContainer = $('.events-list');
  if (!eventsContainer) return;
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Filter to only show upcoming events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = sortedEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today;
  }).slice(0, 5); // Show only the next 5 events
  
  // Clear current events
  eventsContainer.innerHTML = '';
  
  // Render each event
  upcomingEvents.forEach(event => {
    const eventElement = createEventElement(event);
    eventsContainer.appendChild(eventElement);
  });
};

// Create Event Element
const createEventElement = (event) => {
  // This function would create the HTML element for an event
  // Simplified version shown here
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' });
  
  const eventDiv = document.createElement('div');
  eventDiv.className = 'event-item';
  eventDiv.setAttribute('data-id', event.id);
  
  // Add event content
  eventDiv.innerHTML = `
    <div class="event-date">
      <span class="event-day">${day}</span>
      <span class="event-month">${month}</span>
    </div>
    <div class="event-category ${event.category}"></div>
    <div class="event-details">
      <h5>${event.title}</h5>
      <p class="event-time"><i class="bi bi-clock"></i> ${formatEventTime(event.startTime, event.endTime)}</p>
      <p class="event-location"><i class="bi bi-geo-alt"></i> ${event.location}</p>
    </div>
    <div class="event-actions">
      <button class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></button>
      <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
    </div>
  `;
  
  return eventDiv;
};

// Format Event Time
const formatEventTime = (startTime, endTime) => {
  if (!startTime) return 'All Day';
  
  // Convert 24h format to 12h format
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  if (startTime && endTime) {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }
  
  return formatTime(startTime);
};