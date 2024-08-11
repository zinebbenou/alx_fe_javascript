// Define your quotes array
let quotes = [
  { text: "To be, or not to be, that is the question.", category: "Philosophy" },
  { text: "The only thing we have to fear is fear itself.", category: "Inspiration" }
];

const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock API endpoint

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories(); // Update the categories dropdown
    showRandomQuote(); // Show the new quote
    fetchQuotesFromServer(); // Sync with server
  }
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
  } else {
    quoteDisplay.textContent = "No quotes available for this category.";
  }
  saveLastFilter(selectedCategory);
}

// Save the last selected filter to local storage
function saveLastFilter(filter) {
  localStorage.setItem('lastFilter', filter);
}

// Load the last selected filter from local storage
function loadLastFilter() {
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    document.getElementById('categoryFilter').value = lastFilter;
    filterQuotes();
  }
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the category filter
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Event listener for adding new quotes
document.querySelector('button[onclick="addQuote()"]').addEventListener('click', addQuote);

// Initialize the app
loadQuotes();
populateCategories();
loadLastFilter();

// Function to export quotes to a JSON file
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
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
    quotes = importedQuotes;
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for JSON import
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Event listener for JSON export
document.getElementById('exportButton').addEventListener('click', exportToJson);

// Function to fetch quotes from the server and sync local data
async function fetchQuotesFromServer() {
  try {
    // Fetch quotes from the server
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    // Conflict resolution: Replace local data with server data if server data is newer
    if (serverQuotes.length > 0) {
      quotes = serverQuotes; // Replace local quotes with server quotes
      saveQuotes();
      populateCategories();
      showRandomQuote();
      alert('Data synced with server.');
    }
  } catch (error) {
    console.error('Error fetching data from server:', error);
  }

  // Post quotes to the server
  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quotes)
    });
    const result = await response.json();
    console.log('Data posted to server:', result);
  } catch (error) {
    console.error('Error posting data to server:', error);
  }
}

// Periodically fetch data from the server every 5 minutes
setInterval(fetchQuotesFromServer, 300000);
