const {Signup, Signin, Signout} =require('./controllers/auth');
const {getUser, updateUser} = require('./controllers/user');
const {createCategory, getCategory} = require('./controllers/category')
const { GraphQLJSON } = require("graphql-scalars");

const resolvers = {
    JSON: GraphQLJSON,
    Query : {
       Signout: Signout
    },
    
    
    Mutation : {
        Signup: Signup,
        Signin: Signin,
        getUser: getUser,
        updateUser: updateUser,
        createCategory: createCategory,
        getCategory: getCategory
    }
 

}



module.exports = resolvers;