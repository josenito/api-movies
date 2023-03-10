const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, user_id } = request.body

    const checkUserExists = await knex('users').where({ id: user_id }).first()

    if (!checkUserExists) {
      throw new AppError('Usuário não encontrado.')
    }

    await knex('movie_notes').insert({ title, description, rating, user_id })

    return response.status(201).json()
  }

  async index(request, response) {
    const notes = await knex('movie_notes')
      .select(
        'movie_notes.id',
        'movie_notes.description',
        'movie_notes.rating',
        'movie_notes.user_id',
        'users.name',
        'users.email',
      )
      .innerJoin('users', 'users.id', 'movie_notes.user_id')
      .orderBy('title')

    return response.json(notes)
  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex('movie_notes').where({ id }).first()

    if (!note) {
      throw new AppError('Nota não encontrada.')
    }

    const user = await knex('users').where({ id: note.user_id }).first()

    return response.json({
      id: note.id,
      title: note.title,
      description: note.description,
      rating: note.rating,
      created_at: note.created_at,
      updated_at: note.updated_at,
      user: user
    })
  }

  async delete(request, response) {
    const { id } = request.params

    const note = await knex('movie_notes').where({ id }).first()

    if (!note) {
      throw new AppError('Nota não encontrada.')
    }

    await knex('movie_notes').where({ id }).delete()

    return response.json()
  }

  async update(request, response) {
    const { id } = request.params
    const { description, rating } = request.body

    const note = await knex('movie_notes').where({ id }).first()

    if (!note) {
      throw new AppError('Nota não encontrada.')
    }

    note.description = description ?? note.description
    note.rating = rating ?? note.rating

    await knex('movie_notes').update(note).where({ id: note.id })

    return response.json()
  }
}

module.exports = MovieNotesController