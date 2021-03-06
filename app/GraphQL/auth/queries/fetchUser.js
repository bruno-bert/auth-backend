//const ForbiddenError = require('../../../errors/forbiddenError')

const AuthService = use('App/Services/AuthService')

const schema = `
 allUsers: [User]
`
const resolver = {

  // Get a user by its ID
  async fetchUser(_, {
    id
  }) {
    const user = await AuthService.find(id)
    return user.toJSON()
  },


}


exports.schema = schema
exports.resolver = resolver
