'use strict'

const AuthService = use('App/Services/AuthService')

class AuthController {

  async activate({
    request,
    response
  }) {

    const result = await AuthService.activate({
      token: request.input('token')
    })

    return response.status(200).json({
      user: result.email,
      message: 'User account activated'
    })

  }


}

module.exports = AuthController
