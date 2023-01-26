const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    interestName:{
        type:String,
        required:true
    }
})

const User=new mongoose.model("interest",userSchema);

module.exports=User;