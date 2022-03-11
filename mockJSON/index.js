const app = require("express")();
const PORT = 8000;
const theData = require("./mockData.json")
const graphql = require("graphql");
const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");
const { graphqlHTTP } = require("express-graphql");

const CastingType = new GraphQLObjectType({
    name: "Casting",
    fields: () => ({
        actors: new GraphQLList(GraphQLString),
        director: new GraphQLList(GraphQLString)
    })
});

const SeriesType = new GraphQLObjectType({
    name: "Series",
    fields: {
        id: GraphQLInt,
        name: GraphQLString,
        rating: graphql.GraphQLFloat,
        description: GraphQLString,
        category: new GraphQLList(GraphQLString),
        platform: GraphQLString,
        casting: CastingType,
        poster: GraphQLString,
        episodeCount: GraphQLInt,
        seasons: GraphQLInt,
        releaseDate: GraphQLString,
    }
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields:{
        getAllSeries: {
            type: new GraphQLList(SeriesType),
            args: {id: {type: GraphQLInt}},
            resolve(parent, args) {
                console.log("Hello");
                return theData
            }
        }
    }
})


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addSeries: {
            type: SeriesType,
            args: {
                name: {type: GraphQLString},
                rating: {type: graphql.GraphQLFloat},
                description: {type: GraphQLString},
                category: {type: new GraphQLList(GraphQLString)},
                platform: {type: GraphQLString},
                casting: {type: CastingType},
                poster: {type: GraphQLString},
                episodeCount: {type: GraphQLInt},
                seasons: {type: GraphQLInt},
                releaseDate: {type: GraphQLString}
            },
            resolve(parent, args){
                let newInstance = {
                    id: theData.length+100,
                    name: args.name,
                    rating: args.rating,
                    description: args.description,
                    category: args.category,
                    platform: args.platform,
                    casting: args.casting,
                    poster: args.poster,
                    episodeCount: args.episodeCount,
                    seasons: args.seasons,
                    releaseDate: args.releaseDate   
                }
                theData.push(newInstance);
                return newInstance;
            }
        }
    }
})


const schema = new GraphQLSchema({query: RootQuery, mutation: Mutation});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true //UI types
}));


app.listen(PORT, ()=> {
    console.log("Server running on Port "+PORT);
})