const {
  GraphQLError
} = require('graphql')

const AuthService = use('App/Services/AuthService')


const schema = `
registerUser (email: String!,
    password: String!,
    password_confirmation: String!,
    fullName: String,
    firstName: String,
    lastName: String,
    phoneNumber: String ): User
`

const resolver = {


  // Register new user
  async registerUser(_, {
    email,
    password,
    password_confirmation,
    fullName,
    firstName,
    lastName,
    phoneNumber
  }, {
    auth
  }) {

    const loggedUser = auth.current ? auth.current.user : null

    try {


      return await AuthService.register({
        email,
        importHash: password,
        importHash_confirmation: password_confirmation,
        fullName,
        firstName,
        lastName,
        phoneNumber
      }, loggedUser)

    } catch (error) {

      throw new GraphQLError(error.messages || error.message)

    }


  },

}

exports.schema = schema
exports.resolver = resolver
