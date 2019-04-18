/*
module.exports = [
  require('./authSendPasswordResetEmail'),
  require('./authSendEmailAddressVerificationEmail'),
  require('./authUpdateProfile'),
]*/

module.exports = [
  require('./login'),
  require('./registerUser'),
  require('./validatePassword'),
]
