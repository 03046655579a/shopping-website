const { Order, ProductCart } = require("../models/order");
const {getUserByID, PushOrderInPurchaseList} = require('../controllers/user');
const {isAuthenticated, isAdmin} = require('../controllers/auth');
const { updateStock } = require("./product");
const { find } = require("../models/user");
const getOrderById = async (id) => {
   try {
        const order = await Order.findById(id)
        .populate("products.product", "name price");
        if(!order){
            return 'Order doesnot found in the database'
        }
        return order;
   }
   catch(err){
       console.log(err);
       return `this is the ---->> ${err}`
   }

}

const createOrder = async (parents, args, context, info) => {
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


                    // Pushing order in Purchase list 
            const pushed =  await  PushOrderInPurchaseList(args.post);
            if(!pushed){
                return "not able push order in the purchse list";
            }
            const update = await updateStock(args.post);
            if(!update){
                return "Unable to update the Stock"
            }
            args.post.user = user;
            const order = new Order(args.post);
        const savingorder =   await order.save();
        if(!savingorder){
            return 'unable to save the order'
        }
        return savingorder;

       
    } catch (err) {
        console.log(err);
        return `this is the ${err}`;
    }
}


const getAllOrders = async (parents, args, context, info) => {
    try{
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
                    const admin = await isAdmin(user);
                    if(!admin){
                      return "Orders can only be seen by Admin"
                    }
            const order =   await Order.find();
            if(!order){
                return "No Order Found"
            }
            return order;
    }
    catch(err){
        console.log(err);
        return `this is the ----> > > ${err}`;
    }

}

const getOrderStatus = async (parents, args, context, info) => {
    try{
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
                    const admin = await isAdmin(user);
                    if(!admin){
                      return "Orders can only be seen by Admin"
                    }

                    return Order.schema.path("status").enumValues;


    }
    catch(err){
        console.log(err);
        return `this is the ----> > > ${err}`;
    }
}

const updateStatus = async (parents, args, context, info) => {
 
    try{
        const {id,orderId, status} = args.post;

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
                    const admin = await isAdmin(user);
                    if(!admin){
                      return "Orders can only be seen by Admin"
                    }
                const updated =    await Order.findOneAndUpdate(
                        { _id: orderId },
                        { $set: { status: status } });
                        if(!updated){
                            return "unable to update the order";
                        }
                        return updated;
    }
    catch(err){
        console.log(err);
        return `this is the ----> > > ${err}`;
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderStatus,
    updateStatus
}