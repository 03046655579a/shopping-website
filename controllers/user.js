const User = require('../models/user');
const { Order, ProductCart } = require("../models/order");
const { ApolloError } = require('apollo-server-errors');
const {isAuthenticated} = require('./auth');
const getUserByID = async (id) => {
try{
    const user = await User.findById(id);
    if(!user){
        return false;
    }
    return user;
}
catch(err){
return new ApolloError(err);
}

}

const getUser = async (parents, args, {req, res}, info ) => {
    try{
        const{ id} = args.post;
        const user = await getUserByID(id);
         return(user);
    }catch(err){
        console.log(err);
        return `this is the ${err}`;
    }
    
}

const updateUser = async (parents, args, context, info) => {
 try {
     console.log(context._id);
    const {id, email} = args.post;
    const em = await getUserByID(id);
    console.log("-->",em);
     if(!em) {
         return 'Email with this ID is incorrect please Enter correct email'
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

const userPurchaseList = async (parents, args, context, info) => {
   try {
    const {id} = args.post;

    //getUserByID
       const user = await getUserByID(id);
             if(!user){
               return "user with this id is not stored in the DataBase"
 }
 //isAuthenticated
              const isauth =    await isAuthenticated(user, context);
              console.log("------------------->>>>>>>.",isauth)
                if(!isauth){
                       return 'User is not authenticated'
                }
             const order =  await Order.find({ user: user })
                .populate("user", "_id name");
                if(!order){
                    return "user purchase list is empty"
                }
                return order;
   }
   catch(err){
    return `this is the ${err}`;
}
}







// middleware 
const PushOrderInPurchaseList = async (orders) => {
try {
    let purchases = [];
    orders.products.forEach(product => {
        purchases.push({
            id: product.product,
            name: product.name,
            count: product.count,
            price: product.Price,
            amount: orders.amount,
            address: orders.address,
            userID: orders.id

        })
    });

  const push = await User.findOneAndUpdate(
        { _id: orders.id },
        { $push: { purchases: purchases } },
        { new: true });
        if(!push){
            return false;
        }
        return true;

} catch (error) {
    console.log(error);
}
    
}



module.exports = {
    getUserByID,
    getUser,
    updateUser,
    PushOrderInPurchaseList,
    userPurchaseList

}