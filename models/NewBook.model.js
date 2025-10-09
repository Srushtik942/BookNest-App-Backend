const mongoose = require("mongoose");

const newBookSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    author:{
        type:String,
        required: true
    },
    imageUrl:{
        type:String,
        required: true
    },
    originalPrice:{
        type:Number,
        required:true
    },
    rating: {
        type:Number,
        required: true,
        min:0,
        max:5
    },
    wishlist:{
        type:Boolean,
        default: false

    },
      bestSeller: {
        type: Boolean,
        default: false
    },
    summary:{
        type:String
    },
    views:{
        type: Number,
        required: true

    },
   genre:[{
        type:String,
        enum: ["Fiction", "Non-Fiction", "Sci-Fi", "Comics","Thriller"]
    }]

},
{
    timestamps: true
}
)

const NewBook  = mongoose.model("NewBook ", newBookSchema);

module.exports = NewBook ;