const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema({
    price :{
        type:Number,
        required: true
    },
    itemCount:{
        type:Number,
        required: true
    },
    discount:{
        type:Number,
        required: true
    },
    deliveryCharge:{
        type: Number,
        required: true
    },
    Total:{
        type:Number,
        required: true
    }
},
{
    timestamps: true
}
);

const Price = mongoose.model("Price",PriceSchema);

module.exports = Price