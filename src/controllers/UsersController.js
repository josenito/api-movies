const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const checkEmailUserExists = await knex('users').where({ email }).first()

    if (checkEmailUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({
      name,
      email,
      password: hashedPassword
    })

    return response.status(201).json()
  }

  async update(request, response) {
    const { name, email, password, oldPassword } = request.body
    const { id } = request.params

    const user = await knex('users').where({ id }).first()

    if (!user) {
      throw new AppError(`Usuário de ID ${id}, não encontrado`)
    }

    const userWithUpdatedEmail = await knex('users').where({ email }).first()

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este email já esta em uso.')
    }

    user.name = name
    user.email = email

    if (password && !oldPassword) {
      throw new AppError('Você precisa informar a senha antiga para definir uma nova.')
    }

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password)

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere.')
      }

      user.password = await hash(password, 8)
    }

    await knex('users').update(user).where({ id: user.id })

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const user = await knex('users').where({ id }).first()

    console.log(user)

    if (!user) {
      throw new AppError('Usuário não encontrado.')
    }

    return response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
    })
  }

  async index(request, response) {
    const users = await knex('users')
      .select(
        'id',
        'name',
        'email',
        'avatar',
        'created_at',
        'updated_at',
      )
      .orderBy('name')

    return response.json(users)
  }

  async delete(request, response) {
    const { id } = request.params

    const user = await knex('users').where({ id }).first()

    if (!user) {
      throw new AppError('Usuário não encontrado.')
    }

    await knex('users').where({ id }).delete()

    return response.json()
  }

}

module.exports = UsersController