const User = require('../models/user');
const {check, validationResult} =require('express-validator');
const { ApolloError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


const Signup = async (parent, args, context , info ) => {
try {
    console.log("-->",args);
const errors = validationResult(args);
if(!errors.isEmpty()){
   return new ApolloError(errors.array()[0].msg);
  }
  const user = new User(args.post);
  await user.save();
  return user;


}
catch(err){
    console.log("error Catching of Signup ", err);
    return new ApolloError(err);

}



}

const Signin = async (parent, args , {res }, info ) => {
 try {
    const errors = validationResult(args);
    if(!errors.isEmpty()){
        return new ApolloError(errors.array()[0].msg);
    }
    const {email, password} = args.post;
      const user = await User.findOne({email});
      
      if(!user){
           return new ApolloError("user not found in the database");
       }
       if(!user.autheticate(password)){
           return new ApolloError("Password does not match");
}

const token = jwt.sign({ _id: user._id }, process.env.SECRET);
   
//put token in cookie
  //send response to front end
 const { _id, name, role } = user;
   return ({ token, user: { _id, name, email, role } });



}
 catch(err) {
 console.log(err);
 return new ApolloError(err);
 }
}


const Signout = async (parents, args, {res}, info ) => {
     try{
        res.clearCookie("token");
        return "user sign out Successfully"

     }
     catch (err){
         console.log(err);
         return new ApolloError(err);
     }

}


 
  //custom middlewares
  const isAuthenticated = (profile, auth) => {
    let checker = profile && auth && profile._id == auth._id;
    if (!checker) {
      return res.status(403).json({
        error: "ACCESS DENIED"
      });
    }
  return true;
  };
  
  const isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
      return res.status(403).json({
        error: "You are not ADMIN, Access denied"
      });
    }
    next();
  };
  

module.exports = {
    Signup,
    Signin,
    Signout,
    isAuthenticated,
    isAdmin
}