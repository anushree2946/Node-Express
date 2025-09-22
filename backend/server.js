const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// --- Configuration ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL; // Add this to your environment variables

// --- Middleware ---
// Use environment variable for CORS origin for security
// In server.js
app.use(cors({
    origin: "https://tourmaline-begonia-ee7c66.netlify.app/" 
}));
app.use(express.json());

// --- Mongoose Schema and Model ---
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    description: String,
    publisherYear: Number
});

const Book = mongoose.model('Book', bookSchema);

// --- API Routes (CRUD Operations) ---

// Health check route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is running successfully.",
        activeStatus: true,
        error: false,
    });
});

// Create a new book
app.post('/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: "Failed to create book", error: error.message });
    }
});

// Read all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
});

// Get a single book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch book", error: error.message });
    }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Failed to update book", error: error.message });
    }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book is deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete book", error: error.message });
    }
});

// Search for books by title
app.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        const books = await Book.find({
            title: { $regex: query, $options: "i" }
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Search failed", error: error.message });
    }
});

// --- Database Connection and Server Start ---
const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log("Successfully connected to MongoDB!");

        // Start the Express server
        app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
    } catch (error) {
        console.error("Failed to connect to the database.", error);
        process.exit(1); // Exit the process with an error code
    }
};

startServer();