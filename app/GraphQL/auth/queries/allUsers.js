  //const ForbiddenError = require('../../../errors/forbiddenError')
  const UserService = use('App/Services/UserService')

  const schema = `
  fetchUser(id: Int!): User
`
  const resolver = {

    // Fetch all users
    async allUsers() {
      const users = await UserService.index()
      return users.toJSON()
    },


  }


  exports.schema = schema
  exports.resolver = resolver
