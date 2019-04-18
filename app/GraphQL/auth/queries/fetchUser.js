//const ForbiddenError = require('../../../errors/forbiddenError')

const UserService = use('App/Services/UserService')

const schema = `
 allUsers: [User]
`
const resolver = {

  // Get a user by its ID
  async fetchUser(_, {
    id
  }) {
    const user = await UserService.find(id)
    return user.toJSON()
  },


}


exports.schema = schema
exports.resolver = resolver
