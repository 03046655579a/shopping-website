const Category = require('../models/category');
const { isAdmin, isAuthenticated } = require('./auth');
const {getUserByID} = require('./user');
const getCategorybyid = async (id) =>{
      
  try {
    const category = await Category.findById(id)
    console.log(category);
  if(!category){
      return "category with the corresponding id doesnot found in the database"
  }
  return category; 

  }
  catch(err){
    console.log(err);
    return `this is -> ${err}`;
  }

}

const createCategory  = async (parent, args, context, info ) => {

   try{
       const {id} = args.post;

    //getUserByID
       const user = await getUserByID(id);
             if(!user){
               return "user with this id is not stored in the DataBase"
}
//isAuthenticated
              const isauth =    await isAuthenticated(user, context);
                if(!isauth){
                       return 'User is not authenticated'
                }
                const admin = await isAdmin(user);
               if(!admin){
                 return "Category is just created by Admin"
               }

     
     //isadmin
       const category = new Category(args.post);
     const store = await category.save()
      if(!store){
        return "unable to store Category in the Database"
      }
      return category;

   }
   catch(err){
     console.log(err);
     return `this is -> ${err}`;
   }

}

const getCategory = async (parents, args, context, info) => {

  try {
    const {id} = args.post;
   const cat = await getCategorybyid(id);
   return cat;
   


  } catch (err) {
    console.log(err);
    return `this is -> ${err}`;
  }
}
const getAllCategory = async (parents, args, context, info) => {
  try {
  const category =  await Category.find();
  if(!category){
    return "Category is Empty"
  }
  return category;
    
  } catch (err) {
    console.log(err);
    return `this is -> ${err}`
  }


}


const updateCategory = async (parents, args, context, info) => {
  try{
          
    const {id, id_Cat, name} = args.post;
    //getcategory
          const cat =  await getCategorybyid(id_Cat);
          if(!cat){
            return "Category doesnot found in the database"
          }
          



    //getUserByID
    const user = await getUserByID(id);
    if(!user){
      return "user with this id is not stored in the DataBase"
}
//isAuthenticated
     const isauth =    await isAuthenticated(user, context);
       if(!isauth){
              return 'User is not authenticated'
       }
       const admin = await isAdmin(user);
      if(!admin){
        return "Category is just created by Admin"
      }
       cat.name = name;
          const updated = await cat.save(cat);
          if(!updated){
            return "unable to update the category"
          }
                return updated;
  }
  catch(err){
    console.log(err);
    return `this is -> ${err}`;
  }
}

const removeCategory = async (parents, args, context, info ) => {
  try{

    const {id, id_Cat, name} = args.post;
    //getcategory
          const cat =  await getCategorybyid(id_Cat);
          if(!cat){
            return "Category doesnot found in the database"
          }
    //getUserByID
    const user = await getUserByID(id);
    if(!user){
      return "user with this id is not stored in the DataBase"
}
//isAuthenticated
     const isauth =    await isAuthenticated(user, context);
       if(!isauth){
              return 'User is not authenticated'
       }
       const admin = await isAdmin(user);
      if(!admin){
        return "Category can be just created by Admin"
      }

    const removed = Category.findByIdAndRemove(id_Cat);
    if(!removed){
      return "you are not authorized to remove the category"
    }
    return removed;
  }catch(err){
    console.log(err);
  }
}
module.exports = {
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory, 
  removeCategory,
}