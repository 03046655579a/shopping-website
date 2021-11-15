const {Signup, Signin, Signout} =require('./controllers/auth');
const {getUser, updateUser, userPurchaseList} = require('./controllers/user');
const {createCategory, getCategory, getAllCategory, updateCategory, removeCategory} = require('./controllers/category')
const { GraphQLJSON } = require("graphql-scalars");
const { query } = require('express');
const { createProduct, getProduct ,deleteProduct, updateProduct, getAllProducts,getAllUniqueCategories } = require('./controllers/product');
const {createOrder,getAllOrders, getOrderStatus,updateStatus} = require('./controllers/order');
const { GraphQLUpload, graphqlUploadExpress } = require("graphql-upload");
const resolvers = {
    JSON: GraphQLJSON,
    Upload: GraphQLUpload,
    Query : {
        getAllCategory: getAllCategory,
        getAllProducts:getAllProducts,
        getAllUniqueCategories:getAllUniqueCategories
    },
    
    
    Mutation : {
        Signup: Signup,
        Signin: Signin,
        getUser: getUser,
        updateUser: updateUser,
        createCategory: createCategory,
        getCategory: getCategory,
        updateCategory: updateCategory,
        removeCategory: removeCategory,
        createProduct: createProduct,
        getProduct: getProduct,
        deleteProduct: deleteProduct,
        updateProduct: updateProduct,
        createOrder:createOrder,
        getAllOrders:getAllOrders,
        getOrderStatus: getOrderStatus,
        updateStatus:updateStatus,
        userPurchaseList:userPurchaseList
    }
    
 

}



module.exports = resolvers;