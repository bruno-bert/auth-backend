'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Authenticator
  |--------------------------------------------------------------------------
  |
  | Authentication is a combination of serializer and scheme with extra
  | config to define on how to authenticate a user.
  |
  | Available Schemes - basic, session, jwt, api
  | Available Serializers - lucid, database
  |
  */
  authenticator: 'jwt',

  /*
  |--------------------------------------------------------------------------
  | Session
  |--------------------------------------------------------------------------
  |
  | Session authenticator makes use of sessions to authenticate a user.
  | Session authentication is always persistent.
  |
  */
  session: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'session',
    uid: 'email',
    password: 'importHash'
  },

  /*
  |--------------------------------------------------------------------------
  | Basic Auth
  |--------------------------------------------------------------------------
  |
  | The basic auth authenticator uses basic auth header to authenticate a
  | user.
  |
  | NOTE:
  | This scheme is not persistent and users are supposed to pass
  | login credentials on each request.
  |
  */
  basic: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'basic',
    uid: 'email',
    password: 'importHash'
  },

  /*
  |--------------------------------------------------------------------------
  | Jwt
  |--------------------------------------------------------------------------
  |
  | The jwt authenticator works by passing a jwt token on each HTTP request
  | via HTTP `Authorization` header.
  |
  */
  jwt: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'jwt',
    uid: 'email',
    password: 'importHash',
    options: {
      secret: Env.get('APP_KEY')
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Api
  |--------------------------------------------------------------------------
  |
  | The Api scheme makes use of API personal tokens to authenticate a user.
  |
  */
  api: {
    serializer: 'lucid',
    model: 'App/Models/User',
    scheme: 'api',
    uid: 'email',
    password: 'importHash'
  },

  activationRequired: true,
  accountActivationRoute: 'account/activate',

  requiresStrongPassword: true,

  uids: ['email'],
  email: 'email',
  password: 'importHash',
  newAccountState: 'pending',
  verifiedAccountState: 'active',
  model: 'App/Models/User',
  dateFormat: 'YYYY-MM-DD HH:mm:ss',
  blocked: 'disabled',
  status: 'account_status',



  validationRules: {
    registration: {
      email: "required|email",
      password: "required",
      password_confirmation: "required|same:password"
    },
    login: {
      email: 'required',
      password: 'required',
      account_status: 'required|equals:active',
      disabled: 'required|equals:false'
    },
    password: {
      allowPassphrases: true,
      maxLength: 50,
      minLength: 8,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4,
    },
  },

  validationMessages: () => {
    return {
      "uid.exists": "User does not exists",
      "uid.required": "E-mail must be filled.",
      "email.required": "E-mail must be filled.",
      "email.email": "Please use a valid e-mail address.",
      "password.required": "Password must be filled.",
      "password.mis_match": "Invalid password.",
      "password_confirmation.same": `Password confirmation must be same as password.`,
      "disabled.required": "User status is required",
      "account_status.required": "Account status is required",
      "account_status.equals": "Activation is pending",
      "disabled.equals": "User is blocked"
    }
  },



}
