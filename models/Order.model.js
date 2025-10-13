const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
      orderItems: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'NewBook', required: true },
        title: { type: String, required: true },
        author: { type: String, required: true },
        imageUrl: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
    }],
     priceDetails: {
        totalPrice: { type: Number, required: true },      // Sum of (priceAtOrder * quantity)
        discount: { type: Number, required: true }, // e.g., 1000
        deliveryCharge: { type: Number, required: true },  // e.g., 499
        Total: { type: Number, required: true },     // 1499
    },

    shippingAddress: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    }
},
{
    timestamps: true
}
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;