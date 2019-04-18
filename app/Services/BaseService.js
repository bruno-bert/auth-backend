const Intl = use('App/Services/Intl')

class BaseService {

  constructor(model, options) {
    this.model = model
    this.modelName = options.modelName
  }

  async index() {

    const data = await this.model.all()

    return {
      message: Intl.formatMessage(`${this.modelName}.index`, {
        count: data.rows.length
      }),
      data
    }


  }

  async store(data) {

    const stored = await this.model.create(data)

    return {
      message: Intl.formatMessage(`${this.modelName}.store`, {
        id: stored.id
      }),
      data: stored
    }

  }


  async update(id, data) {

    const origin = await this.model.findOrFail(id)

    origin.merge(data)

    await origin.save()

    return {
      message: Intl.formatMessage(`${this.modelName}.update`, {
        id: origin.id
      }),
      data: origin
    }

  }

  async show(id) {

    const data = await this.model.findOrFail(id)

    return {
      message: Intl.formatMessage(`${this.modelName}.show`, {
        id: data.id
      }),
      data
    }

  }

  async destroy(id) {


    const data = await this.model.findOrFail(id)

    await data.delete()

    return {
      message: Intl.formatMessage(`${this.modelName}.destroy`, {
        id: data.id
      }),
      data
    }

  }






}

module.exports = BaseService
