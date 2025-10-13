const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    dob:{
        type:Date,
        required:true
    },
    country:{
        type:String,
        required: true
    },
    reqgion:{
        type:String,
        required: true
    },
    language:{
        type:String
    },
    email:{
        type:String,
        required: true
    }

},
{
    timestamps: true
});

const User = mongoose.model("User",UserSchema);

module.exports = User;