const {initializeDatabase} = require("./db/db.connect");
const NewBook = require("./models/NewBook.model");
const Address = require("./models/Address.model");
const Cart = require("./models/Cart.model");
const Order = require("./models/Order.model");
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
// Simplified wishlist endpoint - just returns book data
app.get("/books/wishlist/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch book from NewBook collection
    const book = await NewBook.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    // Just return the book data, frontend will handle localStorage
    res.status(200).json({
      message: "Book found",
      book: book
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book", error: error.message });
  }
});

app.post("/books/wishlist/bulk", async (req, res) => {
  try {
    const { bookIds } = req.body;

    if (!bookIds || bookIds.length === 0) {
      return res.status(200).json({ books: [] });
    }

    const books = await NewBook.find({ _id: { $in: bookIds } });

    res.status(200).json({
      message: "Wishlist books fetched",
      books
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist books", error: error.message });
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
     console.log("Fetching books...");
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
app.get("/products/genre/:genre", async (req, res) => {
  try {
    const genre = req.params.genre;

    const filteredBooks = await NewBook.find({
      genre: { $regex: new RegExp(`^${genre}$`, "i") }
    });

    if (filteredBooks.length === 0) {
      return res.status(404).json({
        message: `No books found for genre "${genre}".`,
      });
    }

    res.status(200).json({
      message: `Books with genre "${genre}" fetched successfully!`,
      filteredBooks,
    });
  } catch (error) {
    console.error("Error fetching books by genre:", error);
    res.status(500).json({
      message: "Failed to fetch books by genre!",
      error: error.message,
    });
  }
});


// filter by rating

app.get("/products/rating/:rating",async(req,res)=>{
  try{
    const rate = parseFloat(req.params.rating);

    const bookData = await NewBook.find({
       rating: { $gte: rate - 0.5, $lte: rate + 0.5 },
    });
    console.log(bookData);

    res.status(200).json({message:"Books with different rating fetched successfully!",bookData });


  }catch(error){
    res.status(500).json({message:"Failed to load book data",error:error});
  }
})

// get books into wishlist


app.get("/books/wishlist",async(req,res)=>{
  try{

    const wishlistData = await Wishlist.find();
    console.log(wishlistData);

    if(wishlistData.length === 0){
      res.status(404).json({message:"No wishlist Data found!"});
    }

    if(wishlistData){
      res.status(200).json({message:"Data fetched successfully!",wishlistData});
    }

  }catch(error){
    res.status(500).json({message:"Failed to fetch data",error});
  }
})


// get products by genre

app.get("/products/genreName",async(req,res)=>{

  try{
    const genre = req.query.genre;

    const response = await NewBook.find({genre : { $in: [genre] } });

    res.status(200).json({ books: response });

  }catch(error){
    res.status(500).json({message:"Failed to load book data",error:error});
  }
})

// filter price

app.get("/products/sort/sort", async (req, res) => {
  try {
    const { sort } = req.query;

    // Build sort object
    let sortOption = {};
    if (sort === "asc") sortOption.originalPrice = 1;
    else if (sort === "desc") sortOption.originalPrice = -1;

    const books = await NewBook.find().sort(sortOption);

    res.status(200).json({
      message: "Books fetched successfully!",
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
});

// search books --------write the api for search ----------

app.get("/books/search/:bookName",async(req,res)=>{

})


// checkout api

app.get("/checkout/:addressId",async(req,res)=>{
  try{
    const addressId  = req.params.addressId ;

    const response = await Address.findById(addressId);
    console.log(response);

    const cartItems = await Cart.find();

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const deliveryCharge = 499;
    const discount = 1000;
    const finalAmount = total - discount + deliveryCharge;


    res.status(200).json({message:"Redirected to checkout page", checkout: {
        response,
        cartItems,
        priceDetails: { total, discount, deliveryCharge, finalAmount },
      }});

  }catch(error){
    res.status(500).json({message:"Failed to checkout with these address",error:error.message});
  }
})


// delete books

app.post("/books/delete/:id",async(req,res)=>{
  try{
    const id = req.params.id;
    console.log(id);

    const deleteBook = await Cart.deleteOne({_id:id});
    console.log(deleteBook);

    res.status(200).json({message:"Book removed from cart successfully",deleteBook});

  }catch(error){
    res.status(500).json({message:"Failed to delete address",error:error.message});
  }
})

// update quantity
app.put("/cart/quantity/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { action } = req.body;

    const book = await Cart.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found in the cart" });
    }

    if (action === "increment") {
      book.quantity += 1;
    } else if (action === "decrement" && book.quantity > 1) {
      book.quantity -= 1;
    }

    await book.save();
    // Send response back
    res.status(200).json({ message: "Quantity updated successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity", error: error.message });
  }
});

app.post("/place-order", async (req, res) => {
    try {
        const { shippingAddressId } = req.body;

        if (!shippingAddressId) {
            return res.status(400).json({ message: "Shipping address ID is required to place the order." });
        }


        const cartItems = await Cart.find();
        const address = await Address.findById(shippingAddressId);

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty. Cannot place order." });
        }
        if (!address) {
            return res.status(404).json({ message: "Shipping address not found." });
        }


        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const discountApplied = 1000;
        const deliveryCharge = 499;
        const finalAmount = subtotal - discountApplied + deliveryCharge;

        const orderItemsSnapshot = cartItems.map(item => ({
            bookId: item._id,
            title: item.title,
            author: item.author,
            imageUrl: item.imgUrl,
            price: item.price,
            quantity: item.quantity,
        }));

        const newOrder = new Order({
            orderItems: orderItemsSnapshot,
            priceDetails: {
                totalPrice: subtotal,
                discount: discountApplied,
                deliveryCharge: deliveryCharge,
                Total: finalAmount,
            },
            shippingAddress: {
                id: address._id,
            },
        });

        const savedOrder = await newOrder.save();

        await Cart.deleteMany({});

        res.status(201).json({
            message: "Order placed successfully! Proceed to payment.",
            orderId: savedOrder._id,
            finalAmount: finalAmount,
            cartCleared: true
        });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Failed to place order.", error: error.message });
    }
});





const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})