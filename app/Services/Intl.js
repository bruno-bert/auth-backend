const Antl = use('Antl')
const prefix = 'messages'
const Env = use('Env')

class Intl {


  constructor() {
    this.locale = Env.get('LANGUAGE', 'en');
  }

  switchLocale(lang) {
    Antl.switchLocale(lang)
    this.locale = lang
  }

  formatMessage(message, args) {
    return Antl
      .forLocale(this.locale)
      .formatMessage(prefix + '.' + message, args)
  }

}

module.exports = new Intl()
