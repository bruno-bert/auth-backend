"use strict"

const Config = use("Config")

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route")
const accountActivationRoute = Config.get("auth.accountActivationRoute")

Route.get(`${accountActivationRoute}`, "AuthController.activate")
