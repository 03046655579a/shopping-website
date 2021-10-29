const {gql} = require('apollo-server-express');
const { GraphQLJSON } = require("graphql-scalars");


const typeDefs =`
scalar JSON


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
  name: String
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
input SigninCreate {
  email:String,
  password:String
}

type Query {
    Signout: String
}

type Mutation {
Signup(post: SignupCreate): authRecieve,
Signin(post: SigninCreate): getSignin,
getUser(post: SigninCreate): JSON
updateUser(post: SignupCreate): JSON
createCategory(post:Category ):JSON
getCategory(post:userid):JSON
}



`;


module.exports = typeDefs;