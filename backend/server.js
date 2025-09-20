const express = require("express");
const mongoose=require("mongoose")
const cors=require("cors");
require('dotenv').config()
const PORT = process.env.PORT || 5000



const app=express()
app.use(cors())
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const bookSchema = new mongoose.Schema({
    title:String,
    author:String,
    description:String,
    publisherYear:Number
})

const Book = mongoose.model('Book',bookSchema)

// Implement  CRUD
// Create
app.post('/books',async(req,res)=>{
    const newBook = new Book(req.body)
    await newBook.save();
    res.json(newBook)
})

// REad
app.get('/books',async(req,res)=>{
    const books = await Book.find();
    res.json(books)
})

// get book by id
app.get('/books/:id',async(req,res)=>{
    const book=await Book.findById(req.params.id);
    res.json(book)
})

//Update
app.put('/books/:id',async(req,res)=>{
    const updateBook=await Book.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.json(updateBook)
})


//Delete
app.delete('/books/:id',async(req,res)=>{
    await Book.findByIdAndDelete(req.params.id)
    res.json({message:"Book is deleted"})
})

// search

app.get('/search',async(req,res)=>{
    const {query}=req.query;
    const books=await Book.find({title:{$regex : query, $options:"i"}

    });
    res.json(books)
})


app.listen(PORT,()=>console.log("Server running at port ",PORT))