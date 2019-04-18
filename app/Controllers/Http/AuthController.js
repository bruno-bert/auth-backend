'use strict'

const UserService = use('App/Services/UserService')

class AuthController {

  async activate({
    request,
    response
  }) {

    const result = await UserService.activate({
      token: request.input('token')
    })

    return response.status(200).json({
      user: result.email,
      message: 'User account activated'
    })

  }


}

module.exports = AuthController
