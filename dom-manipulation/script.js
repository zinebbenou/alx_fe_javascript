// Initialize quotes array and categories set
let quotes = [];
let categories = new Set();

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        updateCategories(); // Update categories when quotes are loaded
    }
}

// Function to save the last viewed quote to session storage
function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to load the last viewed quote from session storage
function loadLastViewedQuote() {
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quote = JSON.parse(lastViewedQuote);
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
    }
}

// Function to display a random quote
function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length === 0) {
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
    
    // Save the last viewed quote to session storage
    saveLastViewedQuote(quote);
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        categories.add(newQuoteCategory); // Add new category to the set
        
        // Clear the input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        // Show the new quote immediately
        showRandomQuote();
        
        // Save to local storage
        saveQuotes();
        updateCategories(); // Update the dropdown menu
    }
}

// Function to create and add the quote form to the DOM
function createAddQuoteForm() {
    const container = document.getElementById('quoteForm');

    // Create input elements
    const quoteTextInput = document.createElement('input');
    quoteTextInput.id = 'newQuoteText';
    quoteTextInput.type = 'text';
    quoteTextInput.placeholder = 'Enter a new quote';
    
    const quoteCategoryInput = document.createElement('input');
    quoteCategoryInput.id = 'newQuoteCategory';
    quoteCategoryInput.type = 'text';
    quoteCategoryInput.placeholder = 'Enter quote category';
    
    // Create Add Quote button
    const addButton = document.createElement('button');
    addButton.id = 'addQuote';
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    // Append elements to the container
    container.appendChild(quoteTextInput);
    container.appendChild(quoteCategoryInput);
    container.appendChild(addButton);
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes = importedQuotes; // Overwrite with imported quotes
        categories.clear(); // Clear existing categories
        updateCategories(); // Update categories from imported quotes
        saveQuotes(); // Save to local storage
        showRandomQuote(); // Optionally show a random quote
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to update the categories dropdown menu
function updateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
    saveSelectedCategory(); // Save selected category to local storage
    showRandomQuote(); // Show a random quote based on the current filter
}

// Function to get filtered quotes based on the selected category
function getFilteredQuotes() {
    const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
    if (selectedCategory === 'all') {
        return quotes;
    }
    return quotes.filter(quote => quote.category === selectedCategory);
}

// Function to save the selected category filter to local storage
function saveSelectedCategory() {
    const categoryFilter = document.getElementById('categoryFilter');
    localStorage.setItem('selectedCategory', categoryFilter.value);
}

// Function to load the last selected category filter from local storage
function loadSelectedCategory() {
    const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
    document.getElementById('categoryFilter').value = selectedCategory;
}

// Initialize the application
window.onload = function() {
    loadQuotes();
    loadLastViewedQuote();
    createAddQuoteForm();
    updateCategories();
    loadSelectedCategory(); // Load the last selected category filter
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
};
