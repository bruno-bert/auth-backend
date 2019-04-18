'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



/**
 * Resourceful controller for interacting with fases
 */
class BaseController {


  constructor(service, options) {
    this.service = service
  }

  /**
   * Show a list of all fases.
   * GET fases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({
    response
  }) {

    const data = await this.service.index()
    response.status(200).json(data)

  }


  /**
   * Create/save a new fase.
   * POST fases
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({
    request,
    auth,
    response
  }) {

    const data = this.getFieldsFromBody(request);

    const audit = {
      createdBy: auth.user.id,
      updatedBy: auth.user.id,
    }

    const result = await this.service.store({
      ...data,
      ...audit
    })

    response.status(200).json(result)

  }

  /**
   * Display a single fase.
   * GET fases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({
    params,
    response
  }) {

    const result = await this.service.show(params.id);
    response.status(200).json(result)

  }


  /**
   * Update fase details.
   * PUT or PATCH fases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({
    params,
    request,
    auth,
    response
  }) {

    const audit = {
      updatedBy: auth.user.id
    }

    const data = this.getFieldsFromBody(request)

    const result = await this.service.update(params.id, {
        ...data,
        ...audit
      }

    )

    response.status(200).json(result)

  }

  /**
   * Delete a fase with id.
   * DELETE fases/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({
    params,
    request,
    response
  }) {

    const result = await this.service.destroy(params.id)
    response.status(200).json(result)

  }




}

module.exports = BaseController
