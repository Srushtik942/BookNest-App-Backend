const {initializeDatabase} = require("./db/db.connect");
const NewBook = require("./models/NewBook.model");
const Address = require("./models/Address.model");
const Cart = require("./models/Cart.model");
const { generateBookSummary } = require("./helperFunctions/AIHelper");
const {generateBookCover} = require("./helperFunctions/GenerateBookCoverImage");
initializeDatabase();
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Adding new Book
async function addBook(newBook){
  try{

  if(!newBook.summary || newBook.summary.trim() === "" ){
    console.log("generating summary");
    newBook.summary = await generateBookSummary(newBook.title, newBook.author);
  }

  if(!newBook.imageUrl || newBook.imageUrl.trim() === ""){
    console.log("Generating image");
    newBook.imageUrl = await generateBookCover(newBook.title, newBook.author);
  }


  const book = new NewBook(newBook);
  const saveBook = await book.save();
  console.log(saveBook);
  return saveBook;

  }catch(error){
    throw error;
  }
}

// api for adding books
app.post("/books",async(req,res)=>{
  try{
    const AddNewBook = await addBook(req.body);
    res.status(200).json({message:"Successfully added the new book",AddNewBook});
  }catch(error){
    res.status(500).json({message:"Failed to add book data",error: error});
  }
})

// adding new address

async function addAddress(newAddress) {
  try{
    const address = new Address(newAddress);
    const saveAddress = await address.save();
    console.log(saveAddress);
    return saveAddress

  }catch(error){
    throw error;
  }
}

app.post("/address",async(req,res)=>{
  try{
    const AddNewAddress = await addAddress(req.body);
    res.status(200).json({message:"Successfully added the new address", AddNewAddress});

  }catch(error){
    res.status(500).json({message:"Failed to add address",error: error});
  }
})

// add to cart :

async function addToCart(newBook) {
  try{
    const AddNewBook = new Cart(newBook);
    const savedBook = await AddNewBook.save();
    console.log(savedBook);
    return savedBook

  }catch(error){
    throw error;
  }
}

app.post("/cart",async(req,res)=>{
  try{
    const addBookToCart = await addToCart(req.body);
    res.status(200).json({message:"Successfully added book to the cart", addBookToCart});

  }catch(error){
    res.status(500).json({message:"Failed to store books", error: error});
  }
})


const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})