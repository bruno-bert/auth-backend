class GlobalValidator {
  get validateAll() {
    return true
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json({
      validate: false,
      errorMessages
    });
  }
}

module.exports = GlobalValidator
