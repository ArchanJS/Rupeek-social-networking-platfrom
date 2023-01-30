const axios=require('axios');
const emailSender=require('nodemailer-email-sender');
const User=require('../models/User');
const Interest=require('../models/Interest');
const utils=require('../utils/util');

exports.addUser=async(req,res)=>{
    try {
        let data=req.body;
        const valid=utils.validateData(data);
        if(valid) {
            let {password}=data;
            password=await utils.hashPassword(password);
            data.password=password;
            const user=new User(data);
            await user.save();
            emailSender({
                mailService:'gmail',
                senderUser:process.env.EMAIL_USER,
                senderEmail:process.env.EMAIL_ID,
                senderPassword:process.env.MAIL_PASSWORD,
                receiverEmail:user.email,
                subject:'Registration successful',
                html:`${utils.emailBody}`
                });
            res.status(201).json({message:"User created"});
        }
        else res.status(400).json({message:"Please enter all the details properly"}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

exports.login=async(req,res)=>{
    try {
        let data=req.body;
        const valid=utils.validateData(data);
        if(valid){
            const user=await User.findOne({email:data.email});
            const match=await utils.comparePasswords(data.password,user.password);
            if(match){
                const token=utils.generateToken(user._id);
                res.status(200).json({message:"Login successful",token});
            }
            else res.status(400).json({message:"Invalid credentials"});
        }
        else res.status(400).json({message:"Invalid credentials"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

exports.deleteUser=async(req,res)=>{
    try {
        await User.findOneAndDelete({_id:req.user._id});
        res.status(200).json({message:"User deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

exports.addOrRemoveInterest=async(req,res)=>{
    try {
        const params=req.params;
        const valid=utils.validateData(params);
        const {check}=req.body;
        console.log(check);
        let agg=check?"$addToSet":"$pull";
        if(valid){
            const interest=await Interest.findOne({_id:params.id});
            await User.findOneAndUpdate({_id:req.user._id},{
                [agg]:{interests:interest.interestName}
            });
            res.status(200).json({message:"Interest added/removed"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

exports.getUserDetails=async(req,res)=>{
    try {
        res.status(200).send(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

exports.getAllEvents=async(req,res)=>{
    try {
        let response=await axios.get(`https://www.eventbriteapi.com/v3/organizations/${process.env.ORG_ID}/events/?token=${process.env.API_TOKEN}`);
        response=response.data.events;
        if(req.user) {
            let eventsObj=utils.registeredEvents(req.user);
            console.log(eventsObj);
            response=response.filter((e)=>eventsObj[`${e.id}`]===undefined);
        }
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

exports.suggestEvents=async(req,res)=>{
    try {
        let venue_id=utils.getVenueId(req.user.city.toLowerCase());
        let eventsObj=utils.registeredEvents(req.user);
        // console.log(venue_id);
        let response=await axios.get(`https://www.eventbriteapi.com/v3/organizations/${process.env.ORG_ID}/events/?token=${process.env.API_TOKEN}`);
        // console.log(events.data);
        // console.log(events.length);
        let events=response.data.events.filter(e=>e.venue_id===venue_id&&req.user.interests.includes(e.name.html)&&eventsObj[`${e.id}`]===undefined);
        res.status(200).send(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}


exports.registerForEvent=async(req,res)=>{
    try {
        let params=req.params,message="Registration";
        let {register}=req.body;
        if(register){
            await User.findOneAndUpdate({_id:req.user._id},{
                $addToSet:{events:params.id}
            });
        }
        else{
            await User.findOneAndUpdate({_id:req.user._id},{
                $pull:{events:params.id}
            });
            message="Cancellation"
        }
        res.status(200).json({message:`${message} successful`});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}

exports.fetchRegisteredEvents=async(req,res)=>{
    try {
        let response=await axios.get(`https://www.eventbriteapi.com/v3/organizations/${process.env.ORG_ID}/events/?token=${process.env.API_TOKEN}`);
        let events=response.data.events.filter(e=>req.user.events.includes(e.id));
        res.status(200).send(events);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
}