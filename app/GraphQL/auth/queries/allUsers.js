  const AuthService = use('App/Services/AuthService')

  const schema = `
  fetchUser(id: Int!): User
`
  const resolver = {

    // Fetch all users
    async allUsers() {
      const users = await AuthService.index()
      return users.toJSON()
    },


  }


  exports.schema = schema
  exports.resolver = resolver
