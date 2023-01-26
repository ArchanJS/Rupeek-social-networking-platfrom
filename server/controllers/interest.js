const Interest=require('../models/Interest');

exports.addInterest=async(req,res)=>{
    try {
        const {interestName}=req.body;
        if(!interestName||!interestName.trim()) res.status(400).json({error:"Please enter interest name properly"});
        else{
            const interest=new Interest({interestName});
            interest.save();
            res.status(201).json({message:"Interest added"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}