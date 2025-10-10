const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
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
    category:[{
        type: String,
        enum: ["Fiction", "Non-Fiction", "Sci-Fi", "Comics","Thriller"]
    }],
      rating: {
        type:Number,
        required: true,
        min:0,
        max:5
    },
    price:{
        type:Number,
        required: true
    },
    originalPrice:{
        type: Number,
        required: true
    },
    discount:{
        type: Number,
        required: true
    },
     quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  deliveryCharge:{
    type:Number,
    required: true
  }

},
  {
    timestamps: true
  }
)

const Cart  = mongoose.model("Cart", CartSchema);

module.exports = Cart