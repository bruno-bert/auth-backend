const ValidationError = require("../../errors/ValidationError")
const User = use("App/Models/User")
const Encryption = use("Encryption")
const Config = use("Config")
const owasp = require("owasp-password-strength-test")

const uuidv1 = require("uuid/v1")

const moment = require("moment")
const randtoken = require("rand-token")
const GE = require("@adonisjs/generic-exceptions")

/**
 * Raised when token is invalid or expired
 *
 * @class InvalidTokenException
 */
class InvalidTokenException extends GE.LogicalException {
  static invalidToken() {
    return new this("The token is invalid or expired", 400)
  }
}

class AuthService {
  constructor() {
    this.config = Config.get("auth")

    this._oldPasswordField = `old_${this.config.password}`
    this._passwordConfirmationField = `${this.config.password}_confirmation`

    this.Hash = use("Hash")
    this.Event = use("Event")
    this.Validator = use("Validator")

    this._encrypter = Encryption.getInstance({
      hmac: false
    })
    this._model = null
  }

  _getModel() {
    if (!this._model) {
      this._model = use(this.config.model)
    }
    return this._model
  }

  _getPassword(payload) {
    return payload[this.config.password]
  }

  _setPassword(payload, password) {
    payload[this.config.password] = password
  }

  _getEmail(payload) {
    return payload[this.config.email]
  }

  _setEmail(payload, email) {
    payload[this.config.email] = email
  }

  _registerPasswordRules() {
    owasp.config(this.config.validationRules.password)
  }

  _makeCustomMessage(key, data, defaultValue) {
    const customMessage = this._getMessages()[key]
    if (!customMessage) {
      return defaultValue
    }

    return customMessage.replace(/{{\s?(\w+)\s?}}/g, (match, group) => {
      return data[group] || ""
    })
  }

  _addTokenConstraints(query, type) {
    query
      .where("type", type)
      .where("is_revoked", false)
      .where(
        "updated_at",
        ">=",
        moment()
        .subtract(24, "hours")
        .format(this.config.dateFormat)
      )
  }

  _registrationRules() {
    return this.config.uids.reduce(
      (result, uid) => {
        const rules = ["required"]
        if (uid === this.config.email) {
          rules.push("email")
        }

        rules.push(`unique:${this._getTable()},${uid}`)

        result[uid] = rules.join("|")

        return result
      }, {
        [this.config.password]: "required|confirmed"
      }
    )
  }

  _getMessages(action) {
    return typeof this.config.validationMessages === "function" ?
      this.config.validationMessages(action) : {}
  }

  _getTable() {
    return this._getModel().table
  }

  async generateToken(user, type) {
    const query = user.tokens()
    this._addTokenConstraints(query, type)

    const row = await query.first()
    if (row) {
      return row.token
    }

    const token = this._encrypter.encrypt(randtoken.generate(16))
    await user.tokens().create({
      type,
      token
    })
    return token
  }

  updateEmailRules(userId) {
    if (!userId) {
      throw new Error(
        "updateEmailRules needs the current user id to generate the validation rules"
      )
    }

    return {
      [this.config.email]: `required|email|unique:${this._getTable()},${
        this.config.email
      },${this._getModel().primaryKey},${userId}`
    }
  }

  updatePasswordRules(enforceOldPassword = true) {
    const rules = {
      [this.config.password]: "required|confirmed"
    }

    /**
     * Enforcing to define old password
     */
    if (enforceOldPassword) {
      rules[this._oldPasswordField] = "required"
    }

    return rules
  }

  async _getUserByUids(value) {
    const userQuery = this._getModel().query()

    /**
     * Search for all uids to allow login with
     * any identifier
     */
    this.config.uids.forEach(uid => userQuery.orWhere(uid, value))

    /**
     * Search for user
     */
    const user = await userQuery.first()
    if (!user) {
      const data = {
        field: "uid",
        validation: "exists",
        value
      }

      throw this.Validator.ValidationException.validationFailed([{
        message: this._makeCustomMessage(
          "uid.exists",
          data,
          "Unable to locate user"
        ),
        field: "uid",
        validation: "exists"
      }])
    }

    return user
  }

  async verifyPassword(newPassword, oldPassword, field = this.config.password) {
    const verified = await this.Hash.verify(newPassword, oldPassword)
    if (!verified) {
      const data = {
        field,
        validation: "mis_match",
        value: newPassword
      }
      throw this.Validator.ValidationException.validationFailed([{
        message: this._makeCustomMessage(
          `${field}.mis_match`,
          data,
          "Invalid password"
        ),
        field: field,
        validation: "mis_match"
      }])
    }
  }

  async verifyEmail(token) {
    const tokenRow = await this.getToken(token, "email")

    if (!tokenRow) {
      throw InvalidTokenException.invalidToken()
    }

    const user = tokenRow.getRelated("user")

    /**
     * Update user account only when in the newAccountState
     */
    if (user.account_status === this.config.newAccountState) {
      user.account_status = this.config.verifiedAccountState
      this.removeToken(token, "email")
      await user.save()
    }

    return user
  }

  async updateEmail(user, newEmail) {
    await this.runValidation({
        [this.config.email]: newEmail
      },
      this.updateEmailRules(user.primaryKeyValue),
      "emailUpdate"
    )

    const oldEmail = this._getEmail(user)

    /**
     * Updating user details
     */
    user.account_status = this.config.newAccountState
    this._setEmail(user, newEmail)
    await user.save()

    /**
     * Getting a new token for verifying the email and firing
     * the event
     */
    const token = await this.generateToken(user, "email")
    this.Event.fire("email::changed", {
      user,
      oldEmail,
      token
    })

    return user
  }

  async updateProfile(user, payload) {
    /**
     * Do not allow changing passwords here. Password flow needs
     * old password to be verified
     */
    if (this._getPassword(payload)) {
      throw new Error(
        "Changing password is not allowed via updateProfile method. Instead use updatePassword"
      )
    }

    const newEmail = this._getEmail(payload)
    const oldEmail = this._getEmail(user)

    /**
     * Update new props with the user attributes
     */
    user.merge(payload)

    if (newEmail !== undefined && oldEmail !== newEmail) {
      /**
       * We need to reset the user email, since we are calling
       * updateEmail and it needs user old email address
       */
      this._setEmail(user, oldEmail)
      await this.updateEmail(user, newEmail)
    } else {
      await user.save()
    }

    return user
  }

  async updatePassword(user, payload) {
    await this.runValidation(
      payload,
      this.updatePasswordRules(),
      "passwordUpdate"
    )

    const oldPassword = payload[this._oldPasswordField]
    const newPassword = this._getPassword(payload)
    const existingOldPassword = this._getPassword(user)

    await this.verifyPassword(
      oldPassword,
      existingOldPassword,
      this._oldPasswordField
    )

    this._setPassword(user, newPassword)
    await user.save()

    this.Event.fire("password::changed", {
      user
    })

    return user
  }

  async forgotPassword(uid) {
    const user = await this.getUserByUids(uid)
    const token = await this.generateToken(user, "password")

    this.Event.fire("forgot::password", {
      user,
      token
    })
  }

  async updatePasswordByToken(token, payload) {
    await this.runValidation(
      payload,
      this.updatePasswordRules(false),
      "passwordUpdate"
    )

    const tokenRow = await this.getToken(token, "password")
    if (!tokenRow) {
      throw InvalidTokenException.invalidToken()
    }

    const user = tokenRow.getRelated("user")
    this._setPassword(user, this._getPassword(payload))

    await user.save()
    await this.removeToken(token, "password")

    this.Event.fire("password::recovered", {
      user
    })
    return user
  }

  async verify(payload, callback) {

    const user = await this._getUserByUids(this._getEmail(payload))
    const enteredPassword = this._getPassword(payload)
    const userPassword = this._getPassword(user)

    if (typeof callback === "function") {
      await callback(user, enteredPassword)
    }

    await this.verifyPassword(enteredPassword, userPassword)

    return user
  }

  async runValidation(payload, rules, action) {
    const validation = await this.Validator.validateAll(
      payload,
      rules,
      this._getMessages(action)
    )

    if (validation.fails()) {
      throw this.Validator.ValidationException.validationFailed(
        validation.messages()
      )
    }
  }

  async login({
    email,
    password
  }, auth) {

    let payload = {
      [this.config.email]: email,
      [this.config.password]: password
    }

    const user = await this.verify(payload)

    payload.password = payload[this.config.password]

    payload = {
      ...payload,
      password: payload[this.config.password],
      [this.config.blocked]: user[this.config.blocked].toString(),
      [this.config.status]: user[this.config.status],
    }

    await this.runValidation(payload, this.config.validationRules.login, "login")

    const {
      token
    } = await auth.withRefreshToken().attempt(email, password)

    return token
  }

  async removeToken(token, type) {
    const query = this._getModel()
      .prototype.tokens()
      .RelatedModel.query()
    await query
      .where("token", token)
      .where("type", type)
      .delete()
  }

  async getToken(token, type) {
    const query = this._getModel()
      .prototype.tokens()
      .RelatedModel.query()
    this._addTokenConstraints(query, type)
    const row = await query
      .where("token", token)
      .with("user")
      .first()
    return row && row.getRelated("user") ? row : null
  }

  async activate({
    token
  }) {
    const decodedToken = decodeURIComponent(token)
    return await this.verifyEmail(decodedToken)
  }

  async validatePassword(password) {
    this._registerPasswordRules()
    return owasp.test(password)
  }

  async register(data, loggedUser) {
    const activationRequired = this.config.activationRequired
    const newAccountState = activationRequired ?
      this.config.newAccountState :
      this.config.verifiedAccountState

    const payload = {
      id: uuidv1(),
      ...data,
      disabled: false,
      createdById: loggedUser,
      updatedById: loggedUser
    }

    /** This validates password */
    if (this.config.requiresStrongPassword) {
      const passwordValidationResult = await this.validatePassword(
        data[this.config.password]
      )

      if (!passwordValidationResult.strong)
        throw new ValidationError({
          messages: passwordValidationResult.errors
        })
    }

    await this.runValidation(payload, this._registrationRules(), "register")

    delete payload[this._passwordConfirmationField]
    payload[this.config.status] = newAccountState

    const user = await this._getModel().create(payload)

    /**
     * Get email verification token for the user
     */
    const token = await this.generateToken(user, "email")

    /**
     * Fire new::user event to app to wire up events
     */
    this.Event.fire("user::created", {
      user,
      token
    })

    return user
  }

  async find(id) {
    const user = await User.find(id)
    return user.toJSON()
  }

  async index() {
    return await User.all()
  }
}

module.exports = new AuthService()
