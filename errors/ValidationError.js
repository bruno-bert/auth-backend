//const { i18n, i18nExists } = require('..//i18n');

module.exports = class ValidationError extends Error {

  constructor({
    language = 'pt-br',
    messageCode = 0,
    messages = []
  }) {
    let message

    /*
    if (messageCode && i18nExists(language, messageCode)) {
      message = i18n(language, messageCode);
    }

    message =
      message ||
      i18n(language, 'errors.validation.message');
    */

    message = 'Validation Error'

    super(message)
    this.code = 400
    this.messages = messages

  }
}
