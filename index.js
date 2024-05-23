const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Sample data
let tasks = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true },
];

// Type definitions
const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    tasks: [Task]
    task(id: ID!): Task
  }

  type Mutation {
    addTask(title: String!): Task
    updateTask(id: ID!, completed: Boolean!): Task
  }
`;

// Resolvers
const resolvers = {
  Query: {
    tasks: () => tasks,
    task: (parent, args) => tasks.find(task => task.id === parseInt(args.id)),
  },
  Mutation: {
    addTask: (parent, args) => {
      const newTask = { id: tasks.length + 1, title: args.title, completed: false };
      tasks.push(newTask);
      return newTask;
    },
    updateTask: (parent, args) => {
      const task = tasks.find(task => task.id === parseInt(args.id));
      if (task) {
        task.completed = args.completed;
        return task;
      }
      return null;
    },
  },
};

// Create an Express application
const app = express();

// Create an Apollo server
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /graphql
server.applyMiddleware({ app, path: '/graphql' });

// Start the server
app.listen({ port: 4000 }, () => {
  console.log('Server is running at http://localhost:4000/graphql');
});
