exports.up = knex => knex.schema.createTable('movie_notes', table => {
  table.increments('id')
  table.text('title').notNullable()
  table.text('description').notNullable()
  table.integer('rating').notNullable()

  table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')

  table.timestamp('created_at').default(knex.fn.now()).notNullable()
  table.timestamp('updated_at').default(knex.fn.now()).notNullable()
})

exports.down = knex => knex.schema.dropTable('movie_notes')
