const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    fullName:{
      type: String,
      required: true
    },
    city:{
        type:String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    pincode:{
        type: Number,

        required: true
    },

},
{
    timestamps: true
}
)

const Address = mongoose.model("Address",addressSchema);
module.exports = Address;

