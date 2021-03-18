const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://jyoti:jyoti@cluster0.ehdqg.mongodb.net/ProductDB?retryWrites=true&w=majority';

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

let db;

const resolvers = {
    Query: {
        productList,
    },
    Mutation: {
        addProduct,
    },
};

async function productList() {
    const products = await db.collection('products').find({}).toArray();
    return products;
}

async function getNextSequence(name) {
    const result = await db.collection('counters').findOneAndUpdate(
      { _id: name },
      { $inc: { current: 1 } },
      { returnOriginal: false },
    );
    return result.value.current;
}

async function addProduct(_, { product }) {
    product.id = await getNextSequence('products');
    const result = await db.collection('products').insertOne(product);
    const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
    return savedProduct;
}
async function connectToDb() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
  }

const server = new ApolloServer({
    typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
    resolvers,
});

const app = express();

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
    try {
      await connectToDb();
      app.listen(3000, function () {
        console.log('Api server started on port 3000');
      });
    } catch (err) {
      console.log('ERROR:', err);
    }
  })();