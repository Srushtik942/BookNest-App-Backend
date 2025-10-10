const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
     title:{
        type : String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    imgUrl :{
        type:String,
        required: true
    },
    originalPrice:{
        type:Number,
        required: true
    },
    wishlist:{
        type: Boolean,
        required: true
    }
},
{timestamps: true}

);

const Wishlist = mongoose.model("Wishlist",WishlistSchema);

module.exports = Wishlist