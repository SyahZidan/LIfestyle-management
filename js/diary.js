/**
 * Diary functionality for the LifeSync application
 */

// Sample diary entries data
const sampleDiaryEntries = [
  {
    id: 'd001',
    date: '2023-05-24',
    title: 'Amazing Day at the Beach',
    content: 'Went to the beach with friends today. The weather was perfect - sunny with a light breeze. We played volleyball, swam in the ocean, and had a picnic. Watching the sunset over the water was the perfect end to a fantastic day.',
    mood: 'happy',
    tags: ['Friends', 'Beach', 'Weekend'],
    images: [
      'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1051073/pexels-photo-1051073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  },
  {
    id: 'd002',
    date: '2023-05-22',
    title: 'New Project at Work',
    content: 'Started a new project at work today. The scope seems challenging, but I\'m excited about the opportunity to learn new skills. Met with the team to discuss initial requirements and set up our project management tools. Looking forward to diving deeper tomorrow.',
    mood: 'neutral',
    tags: ['Work', 'Project'],
    images: []
  },
  {
    id: 'd003',
    date: '2023-05-20',
    title: 'Concert Night',
    content: 'Attended the concert I\'ve been looking forward to for months! The energy in the venue was incredible, and the band exceeded all my expectations. Met up with Jamie and Chris before the show, and we had a great time catching up. The acoustic version of my favorite song was the highlight of the night.',
    mood: 'excited',
    tags: ['Music', 'Friends', 'Concert'],
    images: [
      'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ]
  }
];

// Initialize Diary Functionality
const initDiary = () => {
  // Load diary entries from local storage or use sample data
  const diaryEntries = getFromLocalStorage('diaryEntries', sampleDiaryEntries);
  
  // Initialize diary controls
  initDiaryControls();
  
  // Handle new entry button
  const newEntryBtn = $('.new-entry-btn');
  if (newEntryBtn) {
    newEntryBtn.addEventListener('click', () => {
      showDiaryEntryForm();
    });
  }
  
  // Initialize entry actions (edit, delete)
  initEntryActions();
};

// Initialize Diary Controls (search, filter)
const initDiaryControls = () => {
  const searchInput = $('.diary-filters input[type="text"]');
  const timeFilter = $('.diary-filters select');
  
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterDiaryEntries(searchInput.value, timeFilter.value);
    });
  }
  
  if (timeFilter) {
    timeFilter.addEventListener('change', () => {
      filterDiaryEntries(searchInput.value, timeFilter.value);
    });
  }
};

// Filter Diary Entries
const filterDiaryEntries = (searchTerm, timeFilter) => {
  console.log(`Filtering entries with search: "${searchTerm}" and time filter: ${timeFilter}`);
  // Implement actual filtering logic here
};

// Show Diary Entry Form
const showDiaryEntryForm = (entryToEdit = null) => {
  // Logic to show a form/modal for creating/editing a diary entry
  console.log('Showing diary entry form', entryToEdit ? 'for editing' : 'for creating new entry');
  
  // If entryToEdit is provided, populate the form with its data
  if (entryToEdit) {
    console.log('Editing entry:', entryToEdit);
  }
};

// Initialize Entry Actions
const initEntryActions = () => {
  // Edit buttons
  const editButtons = $$('.diary-entry-card .entry-actions button:first-child');
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const entryCard = button.closest('.diary-entry-card');
      const entryId = entryCard.getAttribute('data-id');
      editDiaryEntry(entryId);
    });
  });
  
  // Delete buttons
  const deleteButtons = $$('.diary-entry-card .entry-actions button:last-child');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const entryCard = button.closest('.diary-entry-card');
      const entryId = entryCard.getAttribute('data-id');
      deleteDiaryEntry(entryId);
    });
  });
};

// Edit Diary Entry
const editDiaryEntry = (entryId) => {
  console.log('Editing diary entry with ID:', entryId);
  
  // Find the entry to edit
  const diaryEntries = getFromLocalStorage('diaryEntries', sampleDiaryEntries);
  const entryToEdit = diaryEntries.find(entry => entry.id === entryId);
  
  if (entryToEdit) {
    showDiaryEntryForm(entryToEdit);
  } else {
    console.error('Entry not found');
  }
};

// Delete Diary Entry
const deleteDiaryEntry = (entryId) => {
  console.log('Deleting diary entry with ID:', entryId);
  
  // Confirm deletion
  if (confirm('Are you sure you want to delete this diary entry? This action cannot be undone.')) {
    // Remove entry from local storage
    const diaryEntries = getFromLocalStorage('diaryEntries', sampleDiaryEntries);
    const updatedEntries = diaryEntries.filter(entry => entry.id !== entryId);
    
    if (saveToLocalStorage('diaryEntries', updatedEntries)) {
      // Remove entry from UI
      const entryCard = $(`[data-id="${entryId}"]`);
      if (entryCard) {
        entryCard.remove();
      }
    }
  }
};

// Create New Diary Entry
const createDiaryEntry = (entryData) => {
  // Create a new entry object
  const newEntry = {
    id: generateId(),
    date: new Date().toISOString().split('T')[0],
    ...entryData
  };
  
  // Add to storage
  const diaryEntries = getFromLocalStorage('diaryEntries', sampleDiaryEntries);
  const updatedEntries = [newEntry, ...diaryEntries];
  
  if (saveToLocalStorage('diaryEntries', updatedEntries)) {
    // Update UI
    renderDiaryEntries(updatedEntries);
    return true;
  }
  
  return false;
};

// Render Diary Entries
const renderDiaryEntries = (entries) => {
  const entriesContainer = $('.diary-entries');
  if (!entriesContainer) return;
  
  // Clear current entries
  entriesContainer.innerHTML = '';
  
  // Render each entry
  entries.forEach(entry => {
    const entryElement = createDiaryEntryElement(entry);
    entriesContainer.appendChild(entryElement);
  });
};

// Create Diary Entry Element
const createDiaryEntryElement = (entry) => {
  // This function would create the HTML element for a diary entry
  // Simplified version shown here
  const entryDate = new Date(entry.date);
  const day = entryDate.getDate();
  const month = entryDate.toLocaleString('default', { month: 'short' });
  const year = entryDate.getFullYear();
  
  const entryDiv = document.createElement('div');
  entryDiv.className = 'diary-entry-card';
  entryDiv.setAttribute('data-id', entry.id);
  
  // Add entry content (simplified)
  entryDiv.innerHTML = `
    <div class="entry-header">
      <div class="entry-date">
        <span class="day">${day}</span>
        <span class="month-year">${month} ${year}</span>
      </div>
      <div class="entry-mood ${entry.mood}">
        <i class="bi bi-emoji-${getMoodIcon(entry.mood)}-fill"></i>
        <span>${capitalizeFirstLetter(entry.mood)}</span>
      </div>
    </div>
    <div class="entry-content">
      <h4>${entry.title}</h4>
      <p>${entry.content}</p>
      ${renderEntryImages(entry.images)}
    </div>
    <div class="entry-footer">
      <div class="entry-tags">
        ${renderEntryTags(entry.tags)}
      </div>
      <div class="entry-actions">
        <button class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
      </div>
    </div>
  `;
  
  return entryDiv;
};

// Helper Functions
const getMoodIcon = (mood) => {
  switch (mood) {
    case 'happy': return 'smile';
    case 'excited': return 'laughing';
    case 'sad': return 'frown';
    case 'angry': return 'angry';
    default: return 'neutral';
  }
};

const renderEntryImages = (images) => {
  if (!images || images.length === 0) return '';
  
  let imagesHtml = '<div class="entry-images">';
  images.forEach(image => {
    imagesHtml += `<img src="${image}" alt="Entry Image">`;
  });
  imagesHtml += '</div>';
  
  return imagesHtml;
};

const renderEntryTags = (tags) => {
  if (!tags || tags.length === 0) return '';
  
  let tagsHtml = '';
  tags.forEach(tag => {
    tagsHtml += `<span class="tag">${tag}</span>`;
  });
  
  return tagsHtml;
};