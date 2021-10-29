const User = require('../models/user');
const { ApolloError } = require('apollo-server-errors');
const {isAuthenticated} = require('./auth');
const getUserByEmail = async (email) => {
try{
    const user = await User.findOne({email});
    if(!user){
        return "user doesnot found in the dataBase"
    }
    return user;
}
catch(err){
return new ApolloError(err);
}

}

const getUser = async (parents, args, {req, res}, info ) => {
    console.log(args.post.email);
    const{ email} = args.post;
   const user = await getUserByEmail(email);
    return(user);
}

const updateUser = async (parents, args, context, info) => {
 try {
     console.log(context._id);
    const {email} = args.post;
    const em = await getUserByEmail(email);
    console.log("-->",em);
     if(!em) {
         return 'Email is incorrect please Enter correct email'
     }
     const isauth = await isAuthenticated(em, context);
      if(!isauth){
          return 'user is not Authenticated';
      }
   const user = await User.findOneAndUpdate({email: email},
                                         { $set: args.post },
                                         { new: true, useFindAndModify: false });
if (!user) {
    return "user doesnot found in the database"
} 

return (user);
 } catch (err) {
     console.log(err);
 }
 
}

module.exports = {
    getUser,
    updateUser

}