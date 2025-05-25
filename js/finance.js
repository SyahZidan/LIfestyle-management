/**
 * Finance functionality for the LifeSync application
 */

// Sample finance data
const sampleFinanceData = {
  balance: 2450.75,
  lastUpdated: '2023-05-25',
  monthlyIncome: 3200,
  monthlyExpenses: 820,
  budget: {
    total: 1200,
    categories: [
      { name: 'Housing', amount: 400, budget: 500, icon: 'house-door', color: 'primary' },
      { name: 'Groceries', amount: 180, budget: 300, icon: 'cart', color: 'success' },
      { name: 'Dining', amount: 120, budget: 150, icon: 'cup-hot', color: 'warning' },
      { name: 'Entertainment', amount: 60, budget: 150, icon: 'film', color: 'danger' },
      { name: 'Transportation', amount: 60, budget: 100, icon: 'car-front', color: 'info' }
    ]
  },
  transactions: [
    { id: 't001', date: '2023-05-24', description: 'Grocery Store', category: 'Groceries', amount: -65.75 },
    { id: 't002', date: '2023-05-23', description: 'Monthly Salary', category: 'Income', amount: 3200.00 },
    { id: 't003', date: '2023-05-22', description: 'Restaurant Dinner', category: 'Dining', amount: -42.50 },
    { id: 't004', date: '2023-05-20', description: 'Concert Tickets', category: 'Entertainment', amount: -60.00 },
    { id: 't005', date: '2023-05-18', description: 'Gas Station', category: 'Transportation', amount: -35.25 }
  ]
};

// Initialize Finance Functionality
const initFinance = () => {
  // Load finance data from local storage or use sample data
  const financeData = getFromLocalStorage('financeData', sampleFinanceData);
  
  // Initialize finance overview
  initFinanceOverview(financeData);
  
  // Initialize budget display
  initBudgetDisplay(financeData.budget);
  
  // Initialize transactions
  initTransactions(financeData.transactions);
  
  // Handle add income button
  const addIncomeBtn = $('.balance-actions button:first-child');
  if (addIncomeBtn) {
    addIncomeBtn.addEventListener('click', () => {
      showTransactionForm('income');
    });
  }
  
  // Handle add expense button
  const addExpenseBtn = $('.balance-actions button:last-child');
  if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', () => {
      showTransactionForm('expense');
    });
  }
};

// Initialize Finance Overview
const initFinanceOverview = (financeData) => {
  // Update balance display
  const balanceElement = $('.balance-info h2');
  if (balanceElement) {
    balanceElement.textContent = formatCurrency(financeData.balance);
  }
  
  // Update last updated date
  const lastUpdatedElement = $('.balance-info p');
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = `Updated: ${formatDate(financeData.lastUpdated)}`;
  }
  
  // Update monthly summary
  const incomeElement = $('.summary-stats .summary-stat:nth-child(1) .stat-value');
  if (incomeElement) {
    incomeElement.textContent = formatCurrency(financeData.monthlyIncome);
  }
  
  const expensesElement = $('.summary-stats .summary-stat:nth-child(2) .stat-value');
  if (expensesElement) {
    expensesElement.textContent = formatCurrency(financeData.monthlyExpenses);
  }
  
  const savingsElement = $('.summary-stats .summary-stat:nth-child(3) .stat-value');
  if (savingsElement) {
    savingsElement.textContent = formatCurrency(financeData.monthlyIncome - financeData.monthlyExpenses);
  }
};

// Initialize Budget Display
const initBudgetDisplay = (budget) => {
  // Update budget total
  const budgetTotalElement = $('.budget-card h5');
  if (budgetTotalElement) {
    budgetTotalElement.textContent = `Monthly Budget: ${formatCurrency(budget.total)}`;
  }
  
  // Calculate total spent
  const totalSpent = budget.categories.reduce((total, category) => total + category.amount, 0);
  
  // Update budget progress
  const spentElement = $('.budget-progress-container span:first-child');
  if (spentElement) {
    spentElement.textContent = `Spent: ${formatCurrency(totalSpent)}`;
  }
  
  const remainingElement = $('.budget-progress-container span:last-child');
  if (remainingElement) {
    remainingElement.textContent = `Remaining: ${formatCurrency(budget.total - totalSpent)}`;
  }
  
  const progressBar = $('.budget-progress-container .progress-bar');
  if (progressBar) {
    const percentSpent = (totalSpent / budget.total) * 100;
    progressBar.style.width = `${percentSpent}%`;
    progressBar.setAttribute('aria-valuenow', percentSpent);
    progressBar.textContent = `${Math.round(percentSpent)}%`;
  }
  
  // Update category progress bars
  budget.categories.forEach((category, index) => {
    const categoryProgressBar = $(`.category-item:nth-child(${index + 1}) .progress-bar`);
    if (categoryProgressBar) {
      const percentSpent = (category.amount / category.budget) * 100;
      categoryProgressBar.style.width = `${percentSpent}%`;
      categoryProgressBar.setAttribute('aria-valuenow', percentSpent);
    }
    
    const categoryAmountElement = $(`.category-item:nth-child(${index + 1}) .category-progress span`);
    if (categoryAmountElement) {
      categoryAmountElement.textContent = `${formatCurrency(category.amount)} / ${formatCurrency(category.budget)}`;
    }
  });
};

// Initialize Transactions
const initTransactions = (transactions) => {
  const transactionsTable = $('.transactions-table tbody');
  if (!transactionsTable) return;
  
  // Clear current transactions
  transactionsTable.innerHTML = '';
  
  // Render each transaction
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', transaction.id);
    
    const categoryClass = getCategoryClass(transaction.category);
    const amountClass = transaction.amount >= 0 ? 'income' : 'expense';
    
    row.innerHTML = `
      <td>${formatDate(transaction.date)}</td>
      <td>${transaction.description}</td>
      <td><span class="category-badge ${categoryClass}">${transaction.category}</span></td>
      <td class="${amountClass}">${formatCurrency(transaction.amount)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
      </td>
    `;
    
    transactionsTable.appendChild(row);
  });
  
  // Initialize transaction actions
  initTransactionActions();
};

// Get Category Class
const getCategoryClass = (category) => {
  switch (category.toLowerCase()) {
    case 'housing': return 'housing';
    case 'groceries': return 'groceries';
    case 'dining': return 'dining';
    case 'entertainment': return 'entertainment';
    case 'transportation': return 'transportation';
    case 'income': return 'income';
    default: return '';
  }
};

// Initialize Transaction Actions
const initTransactionActions = () => {
  // Edit buttons
  const editButtons = $$('.transactions-table tbody button:first-child');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const transactionId = row.getAttribute('data-id');
      editTransaction(transactionId);
    });
  });
  
  // Delete buttons
  const deleteButtons = $$('.transactions-table tbody button:last-child');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const transactionId = row.getAttribute('data-id');
      deleteTransaction(transactionId);
    });
  });
};

// Show Transaction Form
const showTransactionForm = (type = 'expense', transactionToEdit = null) => {
  // Logic to show a form/modal for creating/editing a transaction
  console.log('Showing transaction form for', type, transactionToEdit ? 'editing' : 'creating new transaction');
  
  // If transactionToEdit is provided, populate the form with its data
  if (transactionToEdit) {
    console.log('Editing transaction:', transactionToEdit);
  }
};

// Edit Transaction
const editTransaction = (transactionId) => {
  console.log('Editing transaction with ID:', transactionId);
  
  // Find the transaction to edit
  const financeData = getFromLocalStorage('financeData', sampleFinanceData);
  const transactionToEdit = financeData.transactions.find(transaction => transaction.id === transactionId);
  
  if (transactionToEdit) {
    const type = transactionToEdit.amount >= 0 ? 'income' : 'expense';
    showTransactionForm(type, transactionToEdit);
  } else {
    console.error('Transaction not found');
  }
};

// Delete Transaction
const deleteTransaction = (transactionId) => {
  console.log('Deleting transaction with ID:', transactionId);
  
  // Confirm deletion
  if (confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
    // Load current finance data
    const financeData = getFromLocalStorage('financeData', sampleFinanceData);
    
    // Find transaction to delete
    const transactionToDelete = financeData.transactions.find(transaction => transaction.id === transactionId);
    
    if (!transactionToDelete) {
      console.error('Transaction not found');
      return;
    }
    
    // Update transactions list
    financeData.transactions = financeData.transactions.filter(transaction => transaction.id !== transactionId);
    
    // Update balance
    financeData.balance -= transactionToDelete.amount;
    
    // Update monthly income/expenses if transaction is from current month
    const currentDate = new Date();
    const transactionDate = new Date(transactionToDelete.date);
    
    if (currentDate.getMonth() === transactionDate.getMonth() && 
        currentDate.getFullYear() === transactionDate.getFullYear()) {
      if (transactionToDelete.amount > 0) {
        financeData.monthlyIncome -= transactionToDelete.amount;
      } else {
        financeData.monthlyExpenses -= Math.abs(transactionToDelete.amount);
      }
    }
    
    // Update budget categories if it's an expense from current month
    if (transactionToDelete.amount < 0 && 
        currentDate.getMonth() === transactionDate.getMonth() && 
        currentDate.getFullYear() === transactionDate.getFullYear()) {
      const categoryIndex = financeData.budget.categories.findIndex(
        category => category.name.toLowerCase() === transactionToDelete.category.toLowerCase()
      );
      
      if (categoryIndex !== -1) {
        financeData.budget.categories[categoryIndex].amount -= Math.abs(transactionToDelete.amount);
      }
    }
    
    // Save updated finance data
    if (saveToLocalStorage('financeData', financeData)) {
      // Update UI
      initFinanceOverview(financeData);
      initBudgetDisplay(financeData.budget);
      initTransactions(financeData.transactions);
    }
  }
};

// Add New Transaction
const addTransaction = (transactionData) => {
  // Load current finance data
  const financeData = getFromLocalStorage('financeData', sampleFinanceData);
  
  // Create new transaction object
  const newTransaction = {
    id: generateId(),
    date: new Date().toISOString().split('T')[0],
    ...transactionData
  };
  
  // Add to transactions list
  financeData.transactions.unshift(newTransaction);
  
  // Update balance
  financeData.balance += newTransaction.amount;
  
  // Update monthly income/expenses
  if (newTransaction.amount > 0) {
    financeData.monthlyIncome += newTransaction.amount;
  } else {
    financeData.monthlyExpenses += Math.abs(newTransaction.amount);
  }
  
  // Update budget categories if it's an expense
  if (newTransaction.amount < 0) {
    const categoryIndex = financeData.budget.categories.findIndex(
      category => category.name.toLowerCase() === newTransaction.category.toLowerCase()
    );
    
    if (categoryIndex !== -1) {
      financeData.budget.categories[categoryIndex].amount += Math.abs(newTransaction.amount);
    }
  }
  
  // Update last updated date
  financeData.lastUpdated = new Date().toISOString().split('T')[0];
  
  // Save updated finance data
  if (saveToLocalStorage('financeData', financeData)) {
    // Update UI
    initFinanceOverview(financeData);
    initBudgetDisplay(financeData.budget);
    initTransactions(financeData.transactions);
    return true;
  }
  
  return false;
};