'use strict'

/*
|--------------------------------------------------------------------------
| Persona
|--------------------------------------------------------------------------
|
| The persona is a simple and opinionated service to register, login and
| manage user account
|
*/

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Uids
  |--------------------------------------------------------------------------
  |
  | An array of fields, that can be used to indetify a user uniquely. During
  | login and reset password, these fields be checked against the user
  | input
  |
  */
  uids: ['email'],

  /*
  |--------------------------------------------------------------------------
  | Email field
  |--------------------------------------------------------------------------
  |
  | The name of the email field inside the database and the user payload.
  |
  */
  email: 'email',

  /*
  |--------------------------------------------------------------------------
  | Password
  |--------------------------------------------------------------------------
  |
  | The password field to be used for verifying and storing user password
  |
  */
  password: 'importHash',

  /*
  |--------------------------------------------------------------------------
  | New account state
  |--------------------------------------------------------------------------
  |
  | State of user when a new account is created
  |
  */
  newAccountState: 'pending',

  /*
  |--------------------------------------------------------------------------
  | Verified account state
  |--------------------------------------------------------------------------
  |
  | State of user after they verify their email address
  |
  */
  verifiedAccountState: 'active',

  /*
  |--------------------------------------------------------------------------
  | Model
  |--------------------------------------------------------------------------
  |
  | The model to be used for verifying and creating users
  |
  */
  model: 'App/Models/User',

  /*
  |--------------------------------------------------------------------------
  | Date Format
  |--------------------------------------------------------------------------
  |
  | The date format for the tokens table. It is required to calculate the
  | expiry of a token.
  |
  */
  dateFormat: 'YYYY-MM-DD HH:mm:ss',

  /*
    |--------------------------------------------------------------------------
  | Validation messages
  |--------------------------------------------------------------------------
  |
  | An object of validation messages to be used when validation fails.
  |

  validationMessages: () => {
    return {}
  }
  */



  validationMessages: () => {
    return {
      "uid.required": "E-mail must be filled.",
      "email.required": "E-mail must be filled.",
      "email.email": "Please use a valid e-mail address.",
      "password.required": "Password must be filled.",
      "password.mis_match": "Invalid password.",
      "password_confirmation.same": `Password confirmation must be same as password.`
    }
  },

  validationRules: {
    registration: {
      email: "required|email",
      password: "required",
      password_confirmation: "required|same:password"
    }
  },

}
