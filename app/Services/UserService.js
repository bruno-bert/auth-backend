const ValidationError = require('../../errors/ValidationError')
const User = use("App/Models/User")
const Persona = use("Persona")
const Config = use('Config')
const owasp = require('owasp-password-strength-test')

const uuidv1 = require("uuid/v1")


class UserService {
  async find(id) {
    const user = await User.find(id)
    return user.toJSON()
  }

  async index() {
    return await User.all()
  }


  async activate({
    token
  }) {

    const decodedToken = decodeURIComponent(token)
    return await Persona.verifyEmail(decodedToken)

  }

  registerPasswordRules() {
    owasp.config(Config.get('auth.passwordRules'))
  }

  async validatePassword(password) {
    this.registerPasswordRules()
    return owasp.test(password)
  }

  async register(data, loggedUser) {

    const activationRequired = Config.get('auth.activationRequired')
    Persona.config.newAccountState = activationRequired ? Persona.config.newAccountState : Config.get('persona.verifiedAccountState')


    const payload = {
      id: uuidv1(),
      ...data,
      disabled: activationRequired,
      createdById: loggedUser,
      updatedById: loggedUser
    }

    /** This validates password */
    const requiresStrongPassword = Config.get('auth.requiresStrongPassword')

    if (requiresStrongPassword) {

      const passwordValidationResult = await this.validatePassword(data.importHash)

      if (!passwordValidationResult.strong)
        throw new ValidationError({
          messages: passwordValidationResult.errors
        })

    }


    /* This triggers the Adonis Event userCreatedEvent - check the start/userCreatedEvent.js */
    const user = await Persona.register(payload)

    return user
  }
}

module.exports = new UserService()
