const {
  GraphQLError
} = require('graphql')

const AuthService = use('App/Services/AuthService')

const schema = `
  login (email: String!, password: String!): String!
`
const resolver = {


  async login(_, {
    email,
    password
  }, {
    auth
  }) {

    try {
      return await AuthService.login({
        email,
        password
      }, auth)
    } catch (error) {

      if (error.messages)
        throw new GraphQLError(error.messages)

    }

  }

}



exports.schema = schema
exports.resolver = resolver
