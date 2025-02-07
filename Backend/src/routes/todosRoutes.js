// routes/todosRoutes.js
const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todoController');
const auth = require('../middleware/auth')

// Create a new Todo (POST)
router.post('/',auth, todosController.createTodo);

// Get a single Todo by ID (GET)
router.get('/:todoID', auth ,todosController.getTodo);

// Get all Todos (GET)
router.get('/',auth, todosController.getAllTodos);

// Update a Todo (PUT)
router.put('/:todoID',auth, todosController.updateTodo);

// Delete a Todo (DELETE)
router.delete('/:todoID', auth , todosController.deleteTodo);

module.exports = router;
