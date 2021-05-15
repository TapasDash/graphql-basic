import express from "express";
import axios from "axios";
import asyncHandler from "express-async-handler";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";

const app = express();

const port = process.env.PORT || 5000;

/*
To define data types in GraphQl

ID
String
Int 
Float
List - []

*/
// ! in schema means that field is required and cannot be null
//here we defining a schema in which we are telling how the query schema would i.e how it will be queried in the frontend

// type Mutation is used to write data to server i.e
//In terms of RESt with help of Mutation you can use POST PATCH DELETE operation on databse
let message;
const DemoSchema = buildSchema(`
    type Post {
      userId: Int
      id: Int
      title: String
      body: String
    }

    type User {
      name: String
      age: Int
      college: String
    }

    type Query {
        hello: String!
        welcomeMessage(name: String, dayOfWeek: String): String
        getUser: User
        getAllUsers: [User]
        getAllPosts: [Post]
        getMessage: String
    }

    type Mutation {
        setMessage(newMessage: String): String
        createUser(name: String!, age: Int!, college: String!)
    }


`);

//below are the resolvers which will tell what data is gonna be shown in taht schema with that particular field
const root = {
  hello: () => "Hello World",

  welcomeMessage: (args) => {
    //args is similar to req.body in REST terms
    console.log({ args });
    const { name, dayOfWeek } = args;
    return `Hey ${name}, Welcome! Today is ${dayOfWeek}`;
  },

  getUser: () => {
    const dummyUser = {
      name: "Tapas Dash",
      age: 24,
      college: "LPU",
    };
    return dummyUser;
  },

  getAllUsers: () => {
    const users = [
      {
        name: "Tapas Dash",
        age: 24,
        college: "LPU",
      },
      {
        name: "John Doe",
        age: 34,
        college: "Stanford",
      },
    ];
    return users;
  },

  getAllPosts: asyncHandler(async () => {
    const posts = await axios.get("https://jsonplaceholder.typicode.com/posts");
    const { data } = posts;
    return data;
  }),

  setMessage: ({ newMessage }) => {
    // const { message } = args;
    message = newMessage;
    return newMessage;
  },

  getMessage: () => message,

  createUser: ({ name, age, college }) => {},
};

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: DemoSchema,
    rootValue: root,
  })
);

app.listen(port, () => console.log(`App is listening on the port ${port}`));

/* 
This would be the GET queries in the frontend

{
  hello
  welcomeMessage(name: "Tapas Dash", dayOfWeek: "Wednesday")
  getUser {
    name
    age
  }
  getAllUsers {
    name
    college
  }
  getAllPosts {
    id
    title
    body
  }
}

*/
