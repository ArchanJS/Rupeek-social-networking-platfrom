const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    city:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    interests:[{
        type:String
    }],
    events:[{
        type:String
    }]
},{timestamps:true});

const User=new mongoose.model("user",userSchema);

module.exports=User;