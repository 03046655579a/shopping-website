const {gql} = require('apollo-server-express');
const { GraphQLJSON } = require("graphql-scalars");


const typeDefs =`
scalar JSON
scalar Upload

type authRecieve {
id: ID,
name: String,
lastname: String,
email: String,
userinfo: String,
encry_password: String,
salt: String,
role: Int

}

type tokens {
  token: String
}


type user {
  id: ID,
  name: String,
  email: String,
  role: String,
}
input Category {
  name: String,
  id: ID
}
input userid {
  id: ID
}
type getSignin {
  token: String
  user: user
}
input SignupCreate {
  name: String,
  lastname: String,
  email: String,
  password: String,
  userinfo: String,
  role: Int
}

input SignupUpdate {
  id: ID,
  name: String,
  lastname: String,
  email: String,
  password: String,
  userinfo: String,
  role: Int
}
input SigninCreate {
  email:String,
  password:String
}

input updateCreate{
  name: String,
  id: ID,
  id_Cat: ID
}

input uploadFile {
  picture: Upload,
  id: ID,
  name: String,
  description:String,
  price:Int,
  category:ID,
  stock:Int
}
input updateFile {
  prod_id: ID,
  id: ID,
  name: String,
  description:String,
  price:Int,
  category:ID,
  stock:Int
}
input findproduct {
  id: ID
}
input Prod {
  id: ID,
  prod_id: ID
}
input productcart {
  product:ID,
  name: String,
  count:Int,
  Price: Int
}
input OrderC {
  id: ID,
  products:[productcart],
  amount: Int,
  address: String
}
input updateorder {
  id: ID,
  orderId: ID,
  status: String,
}

type Query {
  getAllCategory:JSON 
  getAllProducts: JSON
  getAllUniqueCategories:JSON
}



type Mutation {
Signup(post: SignupCreate): authRecieve,
Signin(post: SigninCreate): getSignin,
getUser(post: userid): JSON
updateUser(post: SignupUpdate): JSON
createCategory(post:Category ):JSON
getCategory(post:userid):JSON
updateCategory(post: updateCreate):JSON
removeCategory(post: updateCreate): JSON 
createProduct(name: String,description:String,price:Int,category:ID,stock:Int, id: ID,picture: Upload): JSON
getProduct(post: findproduct ):JSON,
deleteProduct(post:Prod):JSON,
updateProduct(post:updateFile ):JSON,
createOrder(post:OrderC):JSON,
getAllOrders(post:findproduct):JSON,
getOrderStatus(post:findproduct):JSON,
updateStatus(post:updateorder):JSON,
userPurchaseList(post:userid):JSON
}



`;


module.exports = typeDefs;