const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');
const { MONGODB } = require('./config.js');



// instantiate & pass it to the context
const pubsub = new PubSub();

// setup Apollo server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    // we get anything that is passed from before this apollo server and we get the req & res from express.
    // we just want to forward that req, it will take that request body and will forward it to the context
    // and now we can access that request body in our context.
    context: ({ req }) => ({ req, pubsub })
});

mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: 5000 });
}).then(res => {
    console.log(`Server running at ${res.url}`);
});