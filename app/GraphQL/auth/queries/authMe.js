//const ForbiddenError = require('../../../errors/forbiddenError')

const schema = `
  allUsers: [User]
`
const resolver = {}

/*
const resolver = {
  authMe(root, args, context) {
    if (!context.currentUser || !context.currentUser.id) {
      throw new ForbiddenError(context.language);
    }

    return context.currentUser;
  },
}*/

exports.schema = schema
exports.resolver = resolver
