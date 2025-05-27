class BudgetApp {
    constructor() {
        this.data = {
            categories: [],
            accounts: [],
            transactions: []
        };
        
        this.loadData();
        this.initializeApp();
        this.bindEvents();
        this.updateCurrentMonth();
        this.renderAll();
    }

    // Initialize app
    initializeApp() {
        // Set current date for transaction form
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;
    }

    // Load data from localStorage
    loadData() {
        const savedData = localStorage.getItem('budgetAppData');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            // Initialize with sample data
            this.data = {
                categories: [
                    { id: 1, name: 'Jedzenie', budgeted: 800, spent: 245 },
                    { id: 2, name: 'Transport', budgeted: 300, spent: 120 },
                    { id: 3, name: 'Rozrywka', budgeted: 200, spent: 0 }
                ],
                accounts: [
                    { id: 1, name: 'Konto główne', balance: 2500 },
                    { id: 2, name: 'Oszczędności', balance: 5000 }
                ],
                transactions: [
                    { 
                        id: 1, 
                        accountId: 1, 
                        categoryId: 1, 
                        payee: 'Biedronka', 
                        amount: -45.50, 
                        date: '2024-01-15' 
                    },
                    { 
                        id: 2, 
                        accountId: 1, 
                        categoryId: 2, 
                        payee: 'PKP', 
                        amount: -25.00, 
                        date: '2024-01-14' 
                    }
                ]
            };
        }
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('budgetAppData', JSON.stringify(this.data));
    }

    // Bind all events
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.showView(view);
            });
        });

        // Modal controls
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });

        // Form submissions
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });

        document.getElementById('accountForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAccount();
        });

        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Add buttons
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            this.showModal('categoryModal');
        });

        document.getElementById('addAccountBtn').addEventListener('click', () => {
            this.showModal('accountModal');
        });

        document.getElementById('addTransactionBtn').addEventListener('click', () => {
            this.populateTransactionForm();
            this.showModal('transactionModal');
        });
    }

    // Show specific view
    showView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');
    }

    // Show modal
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    // Close all modals
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.resetForms();
    }

    // Reset all forms
    resetForms() {
        document.querySelectorAll('form').forEach(form => {
            form.reset();
        });
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;
    }

    // Update current month display
    updateCurrentMonth() {
        const now = new Date();
        const monthNames = [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ];
        const currentMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
        document.getElementById('currentMonth').textContent = currentMonth;
    }

    // Add new category
    addCategory() {
        const name = document.getElementById('categoryName').value;
        const budget = parseFloat(document.getElementById('categoryBudget').value);
        
        const newCategory = {
            id: Date.now(),
            name: name,
            budgeted: budget,
            spent: 0
        };

        this.data.categories.push(newCategory);
        this.saveData();
        this.renderBudgetCategories();
        this.updateToAssign();
        this.closeModals();
    }

    // Add new account
    addAccount() {
        const name = document.getElementById('accountName').value;
        const balance = parseFloat(document.getElementById('accountBalance').value);
        
        const newAccount = {
            id: Date.now(),
            name: name,
            balance: balance
        };

        this.data.accounts.push(newAccount);
        this.saveData();
        this.renderAccounts();
        this.updateToAssign();
        this.closeModals();
    }

    // Populate transaction form dropdowns
    populateTransactionForm() {
        const accountSelect = document.getElementById('transactionAccount');
        const categorySelect = document.getElementById('transactionCategory');

        // Clear existing options
        accountSelect.innerHTML = '<option value="">Wybierz konto</option>';
        categorySelect.innerHTML = '<option value="">Wybierz kategorię</option>';

        // Populate accounts
        this.data.accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.id;
            option.textContent = account.name;
            accountSelect.appendChild(option);
        });

        // Populate categories
        this.data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    // Add new transaction
    addTransaction() {
        const accountId = parseInt(document.getElementById('transactionAccount').value);
        const categoryId = parseInt(document.getElementById('transactionCategory').value);
        const payee = document.getElementById('transactionPayee').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const date = document.getElementById('transactionDate').value;

        const newTransaction = {
            id: Date.now(),
            accountId: accountId,
            categoryId: categoryId,
            payee: payee,
            amount: amount,
            date: date
        };

        this.data.transactions.push(newTransaction);

        // Update account balance
        const account = this.data.accounts.find(acc => acc.id === accountId);
        if (account) {
            account.balance += amount;
        }

        // Update category spent amount
        const category = this.data.categories.find(cat => cat.id === categoryId);
        if (category && amount < 0) {
            category.spent += Math.abs(amount);
        }

        this.saveData();
        this.renderAll();
        this.closeModals();
    }

    // Delete category
    deleteCategory(categoryId) {
        if (confirm('Czy na pewno chcesz usunąć tę kategorię?')) {
            this.data.categories = this.data.categories.filter(cat => cat.id !== categoryId);
            this.data.transactions = this.data.transactions.filter(trans => trans.categoryId !== categoryId);
            this.saveData();
            this.renderAll();
        }
    }

    // Delete account
    deleteAccount(accountId) {
        if (confirm('Czy na pewno chcesz usunąć to konto?')) {
            this.data.accounts = this.data.accounts.filter(acc => acc.id !== accountId);
            this.data.transactions = this.data.transactions.filter(trans => trans.accountId !== accountId);
            this.saveData();
            this.renderAll();
        }
    }

    // Delete transaction
    deleteTransaction(transactionId) {
        if (confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
            const transaction = this.data.transactions.find(trans => trans.id === transactionId);
            
            if (transaction) {
                // Revert account balance
                const account = this.data.accounts.find(acc => acc.id === transaction.accountId);
                if (account) {
                    account.balance -= transaction.amount;
                }

                // Revert category spent amount
                const category = this.data.categories.find(cat => cat.id === transaction.categoryId);
                if (category && transaction.amount < 0) {
                    category.spent -= Math.abs(transaction.amount);
                }

                // Remove transaction
                this.data.transactions = this.data.transactions.filter(trans => trans.id !== transactionId);
                
                this.saveData();
                this.renderAll();
            }
        }
    }

    // Render all components
    renderAll() {
        this.renderBudgetCategories();
        this.renderAccounts();
        this.renderTransactions();
        this.updateToAssign();
    }

    // Render budget categories
    renderBudgetCategories() {
        const container = document.getElementById('budgetCategories');
        container.innerHTML = '';

        this.data.categories.forEach(category => {
            const available = category.budgeted - category.spent;
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            
            categoryCard.innerHTML = `
                <div class="category-header">
                    <h3 class="category-name">${category.name}</h3>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="category-stats">
                    <div class="category-stat">
                        <span class="category-stat-label">Zaplanowano</span>
                        <span class="category-stat-value">${this.formatCurrency(category.budgeted)}</span>
                    </div>
                    <div class="category-stat">
                        <span class="category-stat-label">Wydano</span>
                        <span class="category-stat-value">${this.formatCurrency(category.spent)}</span>
                    </div>
                    <div class="category-stat">
                        <span class="category-stat-label">Dostępne</span>
                        <span class="category-stat-value ${available < 0 ? 'text-red' : 'text-green'}">${this.formatCurrency(available)}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(categoryCard);
        });
    }

    // Render accounts
    renderAccounts() {
        const container = document.getElementById('accountsGrid');
        container.innerHTML = '';

        this.data.accounts.forEach(account => {
            const accountCard = document.createElement('div');
            accountCard.className = 'account-card';
            
            accountCard.innerHTML = `
                <div class="account-header">
                    <h3 class="account-name">${account.name}</h3>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteAccount(${account.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="account-balance">${this.formatCurrency(account.balance)}</div>
            `;
            
            container.appendChild(accountCard);
        });
    }

    // Render transactions
    renderTransactions() {
        const container = document.getElementById('transactionsList');
        container.innerHTML = '';

        // Sort transactions by date (newest first)
        const sortedTransactions = [...this.data.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedTransactions.forEach(transaction => {
            const account = this.data.accounts.find(acc => acc.id === transaction.accountId);
            const category = this.data.categories.find(cat => cat.id === transaction.categoryId);
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            
            transactionItem.innerHTML = `
                <div class="transaction-info">
                    <h4>${transaction.payee}</h4>
                    <p>${account ? account.name : 'Nieznane konto'}</p>
                </div>
                <div class="transaction-category">${category ? category.name : 'Brak kategorii'}</div>
                <div class="transaction-date">${this.formatDate(transaction.date)}</div>
                <div class="transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}">
                    ${this.formatCurrency(transaction.amount)}
                </div>
                <button class="btn btn-danger btn-sm" onclick="app.deleteTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            container.appendChild(transactionItem);
        });

        if (sortedTransactions.length === 0) {
            container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">Brak transakcji do wyświetlenia</div>';
        }
    }

    // Update "To Assign" amount
    updateToAssign() {
        const totalIncome = this.data.accounts.reduce((sum, account) => sum + Math.max(0, account.balance), 0);
        const totalBudgeted = this.data.categories.reduce((sum, category) => sum + category.budgeted, 0);
        const toAssign = totalIncome - totalBudgeted;
        
        document.getElementById('toAssign').textContent = this.formatCurrency(toAssign);
        document.getElementById('toAssign').className = `stat-value ${toAssign < 0 ? 'text-red' : 'text-green'}`;
    }

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN'
        }).format(amount);
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL');
    }
}

// Additional CSS for colored text
const additionalCSS = `
.text-red {
    color: #dc2626 !important;
}

.text-green {
    color: #059669 !important;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
`;

// Add additional CSS to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BudgetApp();
});

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}