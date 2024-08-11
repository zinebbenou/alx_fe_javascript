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
    syncQuotes(); // Sync with server
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

// Function to display a notification message
function showNotification(message) {
  const notificationDiv = document.createElement('div');
  notificationDiv.textContent = message;
  notificationDiv.style.position = 'fixed';
  notificationDiv.style.bottom = '10px';
  notificationDiv.style.right = '10px';
  notificationDiv.style.padding = '10px';
  notificationDiv.style.backgroundColor = '#4CAF50'; // Green
  notificationDiv.style.color = 'white';
  notificationDiv.style.borderRadius = '5px';
  notificationDiv.style.zIndex = '1000';
  document.body.appendChild(notificationDiv);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notificationDiv);
  }, 3000);
}

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
    showNotification('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the server and sync local data
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    if (serverQuotes.length > 0) {
      quotes = serverQuotes; // Replace local quotes with server quotes
      saveQuotes();
      populateCategories();
      showRandomQuote();
      showNotification('Quotes synced with server!');
    }
  } catch (error) {
    console.error('Error fetching data from server:', error);
    showNotification('Error fetching data from server!');
  }
}

// Function to post quotes to the server
async function postQuotesToServer() {
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
    return result; // Return result for chaining
  } catch (error) {
    console.error('Error posting data to server:', error);
    throw error; // Propagate error
  }
}

// Sync quotes by both posting and fetching
function syncQuotes() {
  postQuotesToServer()
    .then(() => fetchQuotesFromServer())
    .catch(error => {
      console.error('Error syncing quotes:', error);
      showNotification('Error syncing quotes!');
    });
}

// Periodically sync data from the server every 5 minutes
setInterval(syncQuotes, 300000);

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
document.querySelector('button[onclick="addQuote()"]').addEventListener('click', addQuote);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
document.getElementById('exportButton').addEventListener('click', exportToJson);
document.getElementById('syncButton').addEventListener('click', syncQuotes);

// Initialize the app
loadQuotes();
populateCategories();
loadLastFilter();
