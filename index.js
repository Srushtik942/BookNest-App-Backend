const {initializeDatabase} = require("./db/db.connect");
const NewBook = require("./models/NewBook.model");
const Address = require("./models/Address.model");
const Cart = require("./models/Cart.model");
const Wishlist = require("./models/Wishlist.model")
const { generateBookSummary } = require("./helperFunctions/AIHelper");
const {generateBookCover} = require("./helperFunctions/GenerateBookCoverImage");
initializeDatabase();
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
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
});

// add to wishlist
async function addToWishlist(newWishlistBook) {
  try {
    const AddWishlistBook = new Wishlist(newWishlistBook);
    const savedWishlistBook = await AddWishlistBook.save();
    return savedWishlistBook;
  } catch (error) {
    throw error;
  }
}

app.post("/books/wishlist/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch book from NewBook collection
    const book = await NewBook.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    const bookData =  req.body;

    const wishlistSave = await addToWishlist(bookData);

    res.status(200).json({
      message: "Successfully saved book into wishlist",
      wishlistSave
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add into wishlist", error });
  }
});


// get product details

app.get("/products/:id",async(req,res)=>{
  try{
    const produtDetails = await Cart.findById(req.params.id);

    if(!produtDetails){
      return res.status(404).json({message:"Product not found"});
    }

    const totalAmount = produtDetails.price * produtDetails.quantity - produtDetails.discount + produtDetails.deliveryCharge;

    res.status(200).json({
      title:produtDetails.title,
      author: produtDetails.author,
      imgUrl : produtDetails.imgUrl,
      category : produtDetails.category,
      rating: produtDetails.rating,
      price:produtDetails.price,
      originalPrice: produtDetails.originalPrice,
      discount: produtDetails.discount,
      deliveryCharge: produtDetails.deliveryCharge,
      quantity: produtDetails.quantity,
      totalAmount,

    })

  }catch(error){
    res.status(500).json({message:"Failed to load product data", error:error});
  }
})

// get all books

app.get("/books",async(req,res)=>{
  try{
    const books = await NewBook.find();
    console.log(books);

    if(books.length === 0){
      res.status(404).json({message:"No books found!"});
    }

    res.status(200).json({message:"All Books fetched successfully!",books});

  }catch(error){
    res.status(500).json({message:"Failed to load all books",error: error});
  }
})

// filter book by genre

app.get("/books/:genre",async(req,res)=>{
  try{
    const genre = req.params.genre;
    const filteredBooks = await NewBook.find({genre:{ $in: [genre] }});
    console.log(filteredBooks);

    if(filteredBooks.length === 0){
     return  res.status(404).json({message:`Books with this ${genre} not found!`});
    }

    res.status(200).json({message:`Books with this ${genre} fetched successfully!`,filteredBooks});

  }catch(error){
    res.status(500).json({message:"Failed to fetch data by their genre!",error:error});
  }
})


const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})