const {
  GraphQLError
} = require('graphql')

const UserService = use('App/Services/UserService')

const schema = `
validatePassword (password: String!): String
`
const resolver = {

  async validatePassword(_, {
    password
  }) {

    try {
      return await UserService.validatePassword(password)
    } catch (error) {
      throw new GraphQLError(error.messages)
    }

  }

}



exports.schema = schema
exports.resolver = resolver
