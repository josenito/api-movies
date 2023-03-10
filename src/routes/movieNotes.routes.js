const { Router } = require('express')
const MovieNotesController = require('../controllers/MovieNotesController')

const movieNotesRoutes = Router()
const movieNotesController = new MovieNotesController()

movieNotesRoutes.post('/', movieNotesController.create)
movieNotesRoutes.get('/', movieNotesController.index)
movieNotesRoutes.get('/:id', movieNotesController.show)
movieNotesRoutes.delete('/:id', movieNotesController.delete)
movieNotesRoutes.put('/:id', movieNotesController.update)

module.exports = movieNotesRoutes