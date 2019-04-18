'use strict'

const mergeResolvers = require('./shared/utils/mergeGraphqlResolvers')

const sharedTypes = require('./shared/types')

const authTypes = require('./auth/types')
const authQueries = require('./auth/queries')
const authMutations = require('./auth/mutations')

const types = [
  ...sharedTypes,
  ...authTypes,
].map((type) => type.resolver)

const queries = [
  ...authQueries,
].map((query) => query.resolver)

const mutations = [
  ...authMutations,
].map((mutation) => mutation.resolver)

module.exports = mergeResolvers(types, queries, mutations)
