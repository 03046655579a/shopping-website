require("dotenv").config();
const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const cors =require('cors');
const typeDefs = require('./typeDefs');
const  resolvers = require('./resolver');
const auth = require("./middleware/auth");




async function StartServer(){
    app.use(express.urlencoded({extended: true}));
    app.use(express.json())
    app.use(cors());
   
    const  apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        context: ({ req, connection, res }) => {
            
            
           res;
           const tkn = req.headers.authorization || "";

    // Try to retrieve a user with the token
    const user = auth(tkn);
    return user;
          },
    });
    
    await apolloServer.start();
    apolloServer.applyMiddleware({app:app});

    
    app.use(cookieParser());
    app.use((req, res) => {
        res.send("Apollo Server is up and running");
    })

    await mongoose.connect('mongodb://localhost:27017/post_db',{
        useUnifiedTopology: true,
        useNewUrlParser: true 
    });

    console.log("mongoo db server is running");
    app.listen(4000, ()=>{
        console.log("app is runnning at port 4000");
    })


}









StartServer();