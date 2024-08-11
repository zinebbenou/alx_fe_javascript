// Sample quotes array
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    
    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    
    // Show the new quote immediately
    showRandomQuote();
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

// Create the form when the page loads
window.onload = function() {
  createAddQuoteForm();
  
  // Event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
};
