const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const path = require("path");
const {isAuthenticated,isAdmin} = require('./auth');
const {getUserByID} = require('./user');
const product = require('../models/product');
const { uniq } = require('lodash');

const getProductById = async (id )=>{
try {
            const find =  await Product.findById(id);
            if(!find){
                return false;
            }
            return find;
}
catch(err){
    console.log(err);
    return  `this is the -> ${err}`;
}


}


const createProduct = async (parents, args, context, info) => {

   const {id} = args;

   //getUserByID
      const user = await getUserByID(id);
            if(!user){
              return "user with this id is not stored in the DataBase"
}
console.log(user);
//isAuthenticated
             const isauth =    await isAuthenticated(user, context);
             console.log("------------------->>>>>>>.",isauth)
               if(!isauth){
                      return 'User is not authenticated'
               }
               const admin = await isAdmin(user);
              if(!admin){
                return "Category is just created by Admin"
              }

    

   const { name, description, price, category, stock } = args;
 
    if (!name || !description || !price || !category || !stock) {
      return 'please incude all the fields'
    }
   
   
    const { createReadStream, filename } = await args.picture;
    const pathName = path.join(__dirname, `../public/${filename}`);
    console.log(filename);
    const stream = createReadStream();
    await stream.pipe(fs.createWriteStream(pathName));
   
   
   
    const product = new Product({ name, description, price, category, stock });
    product.photo= pathName;
    const created = await product.save();
    if(!created){
        return "unable to create product in the database"
}
return created;
}

const getProduct = async (parents, args, context, info) => {
try{
    const {id} = args.post;
    console.log(id);
      const find = await getProductById(id);
     if(!find){
            return "product with id does not found in the database"
     }
     return find;
 
}catch(err){
    console.log(err);
}
}


const deleteProduct = async (parents, args, context, info) => {
  try{
    const {prod_id} = args.post;
    const prod = await getProductById(prod_id);
    if(!prod){
      return "product with this id doesnot found in the dataBase"
    }
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
                return "Category is just created by Admin"
              }
             const product = prod;
            const deleted =  await product.remove();
            if(!deleted){
              return "product doesnot deleted from the database";
            }
            return deleted;
  



  }catch(err){
    console.log("------->",err);
    return `this is the --- > ${err}`;
  }
}

const updateProduct = async (parents, args, context ,info ) => {
  try {
    const {prod_id} = args.post;
    const prod = await getProductById(prod_id);
    if(!prod){
      return "product with this id doesnot found in the dataBase"
    }
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
                return "Category is just created by Admin"
              }
           const {name, description,category, stock, price} = args.post;
        const updated =   await Product.findByIdAndUpdate({_id:prod_id},
          { $set: {name, description,category, stock, price} },
          { new: true, useFindAndModify: false });;
        if(!updated){
          return "unable to update the information"
        }
        return updated;

  } catch (err) {
    console.log(err);
    return `this is the ${err}`;
  }
}

const getAllProducts = async (parents, args, context, info) => {
  try {
    const list = await Product.find().populate('category');
    if(!list){
      return "Unable to show the list";
    }
    return list;
  } catch (error) {
    console.log(error);
  }
}

const getAllUniqueCategories = async (parents, args, context, info) => {
  try {
        const unique = await Product.distinct("category", {} ); 
        console.log(unique);
        if(!unique){
                    return 'unique category are not Accesable '
        }
        return unique;
  } catch (err) {
  console.log(err);    
  }
}

const updateStock = async (orders) => {
 try{
       let myoperations = orders.products.map(prod => {
        return {
          updateOne: {
            filter: { _id: prod.product },
            update: { $inc: { stock: -prod.count, sold: +prod.count } }
          }
        };
       });
      const updated = await Product.bulkWrite(myoperations, {});
      if(!updated){
        return false;
      }
      return true;
 }catch(err){
   console.log(err);
 }
}



module.exports = {
    getProductById,
    createProduct,
    getProduct,
   deleteProduct,
   updateProduct,
   getAllProducts,
   getAllUniqueCategories,
   updateStock
}