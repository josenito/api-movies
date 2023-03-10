const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MovieTagsController {
  async create(request, response) {
    const { note_id, user_id, name } = request.body

    const note = await knex('movie_notes').where({ id: note_id }).first()

    if (!note) {
      throw new AppError('Nota não encontrada.')
    }

    const checkUserExists = await knex('users').where({ id: user_id }).first()

    if (!checkUserExists) {
      throw new AppError('Usuário não encontrado.')
    }

    await knex('movie_tags').insert({ note_id, user_id, name })

    return response.status(201).json()
  }

  async show(request, response) {
    const { id } = request.params

    const tag = await knex('movie_tags').where({ id }).first()

    if (!tag) {
      throw new AppError('Tag não encontrada.')
    }

    const user = await knex('users').where({ id: tag.user_id }).first()
    const note = await knex('movie_notes').where({ id: tag.note_id }).first()

    return response.json({
      id: tag.id,
      name: tag.name,
      note: note,
      user: user
    })
  }

  async update(request, response) {
    const { id } = request.params
    const { name } = request.body

    const tag = await knex('movie_tags').where({ id }).first()

    if (!tag) {
      throw new AppError('Tag não encontrada.')
    }

    if (!name) {
      throw new AppError('Nome não é valido.')
    }

    tag.name = name ?? tag.name

    await knex('movie_tags').update(tag).where({ id })

    return response.json()
  }

  async index(request, response) {
    const tags = await knex('movie_tags')
      .select([
        'movie_tags.id',
        'movie_tags.name',
        'movie_notes.id as notes_id',
        'movie_notes.title',
        'movie_notes.description',
        'movie_notes.rating',
        'users.id as user_id',
        'users.name as user_name',
        'users.email',
        'users.avatar',
      ])
      .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
      .innerJoin('users', 'users.id', 'movie_tags.user_id')
      .orderBy('movie_tags.name')

    return response.json(tags)
  }

  async delete(request, response) {
    const { id } = request.params

    const tag = await knex('movie_tags').where({ id }).first()

    if (!tag) {
      throw new AppError('Tag não encontrada.')
    }

    await knex('movie_tags').where({ id }).delete()

    return response.json()
  }
}

module.exports = MovieTagsController