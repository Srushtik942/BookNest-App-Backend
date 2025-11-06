📚 BookNest Backend

AI-powered backend for BookNest — a MERN based online bookstore platform.
Handles book CRUD, cart, address, wishlist, order placement, checkout, search, filters, and automated AI-generated book summaries & covers.

✅ Features

```
Feature	Description
📦 Add Books	Add new books to the database
🤖 AI-Generated Book Summary	Automatically generates summary using AI
🖼️ AI-Generated Book Cover Image	Generates placeholder cover if not provided
📍 Manage Addresses	Add and fetch user shipping addresses
🛒 Cart Management	Add, remove, update quantity, view cart
💖 Wishlist Support	Wishlist handled with frontend + backend calls
📑 Order Placement	Checkout flow & order save in DB
📄 Local Storage Order Summary	Orders saved in LocalStorage on frontend as well
🔎 Search Books	Real-time book search endpoint
🎯 Filter Books	Filter by genre, rating, multi-genre filter, price sort
🚚 Checkout API	Calculates delivery charges, discount, total
🛏️ Cart Clear on Order	Cart auto-empties after successful order
🌐 CORS Enabled	Frontend can connect easily
🌱 MongoDB Connected	Persistent book & order data

```
🛠️ Tech Stack

```
| Category   | Tools                   |
| ---------- | ----------------------- |
| Backend    | Node.js, Express.js     |
| Database   | MongoDB + Mongoose      |
| AI Helpers | Custom AI API functions |
| Utility    | dotenv, CORS            |
| Deployment | Local / Cloud hosting   |

```

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/Srushtik942/BookNest-Backend.git
cd BookNest-Backend

2️⃣ Install Dependencies
npm install

3️⃣ Add .env
MONGO_URL=your_mongodb_url_here
OPENAI_API_KEY=your_ai_key_here

Server runs on:
http://localhost:3000

📂 Folder Structure
```
📦 BookNest Backend
 ┣ 📁 db
 ┣ 📁 models
 ┣ 📁 helperFunctions
 ┣ 📄 index.js
 ┣ 📄 package.json
 ┣ 📄 .env

 🧪 Test APIs with Postman

You can easily test all backend APIs using Postman or any API client.

✅ Base URL:
http://localhost:3000

```

🧪 Key Endpoints

```
| Endpoint                                | Description                          |
| --------------------------------------- | ------------------------------------ |
| POST `/books`                           | Add a book (AI auto summary + cover) |
| GET `/books`                            | Get all books                        |
| GET `/books/search/:name`               | Search books                         |
| POST `/cart`                            | Add to cart                          |
| PUT `/cart/quantity/:id`                | Update quantity                      |
| POST `/place-order`                     | Place order + clear cart             |
| GET `/checkout/:addressId`              | Checkout summary                     |
| GET `/products/genres`                  | Multi-genre filter                   |
| GET `/products/rating/:rating`          | Filter by rating                     |
| GET `/products/sort/sort?sort=asc/desc` | Price sorting                        |

```

🔥 Example Body for Creating a Book

Endpoint	POST /books

{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "genre": "Fiction",
  "price": 499,
  "rating": 4.5
}
If summary or imageUrl is missing, system auto-generates them using AI!

Add to cart!
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "price": 499,
  "quantity": 1,
  "imgUrl": "https://example.com/book.jpg"
}

🚀 Ready to Test!

Run server:
node index.js




