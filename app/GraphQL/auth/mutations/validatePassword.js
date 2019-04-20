const AuthService = use('App/Services/AuthService')

const schema = `
validatePassword (password: String!): PasswordValidationResult!
`
const resolver = {

  async validatePassword(_, {
    password
  }) {

    return await AuthService.validatePassword(password)

  }

}



exports.schema = schema
exports.resolver = resolver
