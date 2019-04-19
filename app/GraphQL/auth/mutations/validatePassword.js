const UserService = use('App/Services/UserService')

const schema = `
validatePassword (password: String!): PasswordValidationResult!
`
const resolver = {

  async validatePassword(_, {
    password
  }) {

    return await UserService.validatePassword(password)

  }

}



exports.schema = schema
exports.resolver = resolver
