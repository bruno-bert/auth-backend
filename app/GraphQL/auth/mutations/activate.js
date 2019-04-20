//const ForbiddenError = require('../../../errors/forbiddenError')

const AuthService = use('App/Services/AuthService')
const schema = `
  activate (token: String!): User
`
const resolver = {

  async activate(_, {
    token
  }) {

    return await AuthService.activate({
      token
    })


  }

}



exports.schema = schema
exports.resolver = resolver
