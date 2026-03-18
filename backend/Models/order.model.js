import mongoose from "mongoose";

let orderSchema = new mongoose.Schema({
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    address : {
        type : String,
    },
    pincode : {
        type : Number,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    shopDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    foodDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true 
    },
    assignment: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Delivary",
        default : null
    }, 
    
    brodcastedTo : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    assignedDelivaryBoy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },

    quantity : {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["pending", "out for delivary" ,"compleate"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        required: true
    },

    //for each order we will generate unique id :
    orderGroupId : {
        type : mongoose.Schema.Types.ObjectId,
    },

    //Validation profe :
    sendDelivaryOtp : {type : String , default : null},
    expireOtp : {type : Date , default : null},
    

}, { timestamps: true });

export let ORDER = mongoose.model("Order", orderSchema);