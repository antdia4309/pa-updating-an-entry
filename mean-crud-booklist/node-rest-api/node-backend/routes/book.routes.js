const express = require('express');
const app = express();
 
const bookRoute = express.Router();
let Book = require('../model/Book');
 
// Get all Books
bookRoute.route('/').get((req, res) => {
    Book.find().then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(`Could not get books: ${error}`);
  })
})

// Get a single book by ID
bookRoute.route('/get-book/:id').get(async (req, res) => {
  const mongoose = require('mongoose');
  const bookId = req.params.id;

  // Validate Book ID
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    console.error('Invalid Book ID:', bookId);
    return res.status(400).send({ message: 'Invalid Book ID format' });
  }

  try {
    console.log('Fetching book with ID:', bookId);
    const book = await Book.findById(bookId); // Use `await` instead of callbacks

    if (!book) {
      console.warn('Book not found for ID:', bookId);
      return res.status(404).send({ message: 'Book not found' });
    }

    console.log('Book retrieved successfully:', book);
    res.status(200).json(book);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send({ message: 'Error fetching book', error: err });
  }
});

// Add a book
bookRoute.route('/add-book').post((req, res) => {
  Book.create(req.body).then(() => {
    console.log('Book added successfully.');
    res.status(200);
  })
  .catch((error) => {
    console.error(`Could not save book: ${error}`);
  })
})

// Update a book
bookRoute.route('/update-book/:id').put(async (req, res) => {
  const bookId = req.params.id;

  try {
    console.log('Updating book with ID:', bookId, 'Payload:', req.body);

    const updatedBook = await Book.findByIdAndUpdate(bookId, { $set: req.body }, { new: true });

    if (!updatedBook) {
      return res.status(404).send({ message: 'Book not found for update' });
    }

    console.log('Book updated successfully:', updatedBook);
    res.status(200).json(updatedBook);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).send({ message: 'Error updating book', error: err});
  }
});

// Delete a book
bookRoute.route('/delete-book/:id').delete(async (req, res) => {
  const bookId = req.params.id;

  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).send({ message: 'Book not found for deletion' });
    }

    console.log('Book deleted successfully:', deletedBook);
    res.status(200).send('Book deleted successfully');
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Error deleting book');
  }
});

module.exports = bookRoute;