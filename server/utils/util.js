const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

exports.hashPassword=async(password)=>{
    try {
        const hashPassword=await bcryptjs.hash(password,10);
        return hashPassword;
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.comparePasswords=async(enteredPassword,actualPassword)=>{
    try {
        const res=await bcryptjs.compare(enteredPassword,actualPassword);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.validateData=(data)=>{
    for(const key in data){
        if(!data[key]||!data[key].trim()) return false;
    }
    return true;
}


exports.generateToken =(_id)=> {
    try {
      const token = jwt.sign({ _id }, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRES,
      });
      return token;
    } catch (error) {
      throw new Error('Token is not generated!');
    }
  };

  exports.getVenueId=(city)=>{
    let obj={
        "kolkata":"1234",
        "bangalore":"2345",
        "pune":"3456",
        "nagpur":"4567"
    };
    return obj[city];
  }