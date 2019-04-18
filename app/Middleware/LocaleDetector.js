'use strict'

const Intl = use('App/Services/Intl')

class LocaleDetector {
  async handle({
    auth,
    antl
  }, next) {

    if (auth.user) {
      antl.switchLocale(auth.user.lang)
      Intl.switchLocale(auth.user.lang)
    }


    await next()
  }
}

module.exports = LocaleDetector
