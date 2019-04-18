'use strict'

const {
  makeExecutableSchema
} = require('graphql-tools')

const sharedTypes = require('./shared/types')
const resolvers = require('./resolvers')

const authQueries = require('./auth/queries');
const authMutations = require('./auth/mutations');
const authTypes = require('./auth/types')

const types = [
  ...sharedTypes,
  ...authTypes
].map((type) => type.schema);

const mutations = [
  ...authMutations,
].map((mutation) => mutation.schema);

const queries = [
  ...authQueries,
].map((query) => query.schema);

const query = `
  type Query {
    ${queries.join('\n')}
  }
`;

const mutation = `
  type Mutation {
    ${mutations.join('\n')}
  }
`;

const schemaDefinition = `
  type Schema {
    query: Query
    mutation: Mutation
  }
`;



module.exports = makeExecutableSchema({
  typeDefs: [schemaDefinition, query, mutation, ...types],
  resolvers
})
