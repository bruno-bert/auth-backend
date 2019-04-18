//const ForbiddenError = require('../../../errors/forbiddenError')


const schema = `
  login (email: String!, password: String!): String
`
const resolver = {

  async login(_, {
    email,
    password
  }, {
    auth
  }) {
    const {
      token
    } = await auth
      .withRefreshToken()
      .attempt(email, password)


    return token
  }

}



exports.schema = schema
exports.resolver = resolver
