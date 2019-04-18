'use strict'

const UserService = use('App/Services/UserService');


class UserController {

  async index({
    response
  }) {
    const result = await UserService.index()
    return response.status(200).json(result)
  }


  async switchLang({
    request,
    params,
    response
  }) {


    const {
      lang
    } = request.only(['lang'])

    const result = await UserService.switchLang(params.id, lang)
    response.status(200).json(result)

  }



}

module.exports = UserController
