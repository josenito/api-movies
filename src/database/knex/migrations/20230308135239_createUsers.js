
exports.up = knex => knex.schema.createTable('users', table => {
  table.increments('id')
  table.text('name').notNullable()
  table.text('email').notNullable()
  table.text('password').notNullable()
  table.text('avatar').nullable()

  table.timestamp('created_at').default(knex.fn.now()).notNullable()
  table.timestamp('updated_at').default(knex.fn.now()).notNullable()
})


exports.down = knex => knex.schema.dropTable('users')
