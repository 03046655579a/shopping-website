const Category = require('../models/category');

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


module.exports = {
  createCategory,
  getCategory
}