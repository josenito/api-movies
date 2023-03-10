const { Router } = require('express')
const MovieTagsController = require('../controllers/MovieTagsController')

const movieTagsRoutes = Router()
const movieTagsController = new MovieTagsController()

movieTagsRoutes.post('/', movieTagsController.create)
movieTagsRoutes.get('/', movieTagsController.index)
movieTagsRoutes.put('/:id', movieTagsController.update)
movieTagsRoutes.get('/:id', movieTagsController.show)
movieTagsRoutes.delete('/:id', movieTagsController.delete)

module.exports = movieTagsRoutes