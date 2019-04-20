'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.string('id', 255).primary()
      table.string('email', 255).notNullable().unique()
      table.string('fullName', 255)
      table.string('firstName', 80)
      table.string('lastName', 175)
      table.string('phoneNumber', 24)
      table.string('importHash', 255).notNullable().unique()
      table.string('authenticationUid', 255)
      table.boolean('disabled')
      table.string('account_status', 20)
      table.timestamps()
      table.timestamp('deletedAt', true)
      table.string('createdById', 255)
      table.string('updatedById', 255)
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
