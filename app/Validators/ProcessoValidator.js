'use strict'

const GlobalValidator = use('App/Validators/GlobalValidator')

class ProcessoValidator extends GlobalValidator {

  get rules() {
    return {
      ano: 'required|integer|range:1900,2100',
      numero: 'required'
    }
  }

  get messages() {
    return {
      'ano.required': 'Field Year is required',
      'numero.required': 'Process number is required',
      'ano.integer': 'Field Year must be an integer',
      'ano.range': 'Field Year must be between 1900 and 2100'
    }
  }


}

module.exports = ProcessoValidator
