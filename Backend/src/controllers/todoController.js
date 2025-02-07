// controllers/todosController.js
const { getConnection, sql } = require('../config/database');

const createTodo = async (req, res) => {
  try {
    const { title, description, UserID } = req.body;
    const pool = await getConnection();

    // Call stored procedure to insert a new todo
    console.log(req.body)
    const result = await pool.request()
      .input('TypeControl', 1)  
      .input('Title',  title)
      .input('Description', description)
      .input('Completed',  0)
      .input('UserID',  UserID)
      .execute('sp_ManageTodos');
      console.log(result);
      

    const { IsSuccess, Message } = result.recordsets[0][0];
    res.status(200).json({ success: IsSuccess, message: Message });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getTodo = async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input('TypeControl', sql.Int, 3)  
      .input('userId', sql.Int, userId)
      .execute('sp_ManageTodos');

      const { IsSuccess, Message } = result.recordsets[0];
      const todoData = result.recordsets[1];
  
    if (todoData.length === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.status(200).json({ success: IsSuccess, message: Message, data: todoData });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getAllTodos = async (req, res) => {
  try {
    const pool = await getConnection();

    // Retrieve all todos
    const result = await pool.request()
      .input('TypeControl', sql.Int, 5)  // Retrieve all todos
      .execute('sp_ManageTodos');
      console.log(result.recordsets[0])

    const { IsSuccess, Message } = result.recordsets[0];
    const todos = result.recordsets[1];

    res.status(200).json({ success: IsSuccess, message: Message, data: todos });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { completed } = req.body;
    const { todoID  } = req.params;
    const pool = await getConnection();
    console.log(completed , todoID)


    // Call stored procedure to update an existing todo
    const result = await pool.request()
    .input('TypeControl', sql.Int, 2)  
    .input('TodoID', sql.Int, todoID)
    .input('Completed', sql.Bit,  completed ? 1 : 0)
    .execute('sp_ManageTodos');
    console.log(result)

    const { IsSuccess, Message } = result.recordsets[0][0];
    res.status(200).json({ success: IsSuccess, message: Message });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { todoID } = req.params;
    const pool = await getConnection();

    // Call stored procedure to delete a todo
    const result = await pool.request()
      .input('TypeControl', sql.Int, 4)  // Delete operation
      .input('TodoID', sql.Int, todoID)
      .execute('sp_ManageTodos');

    const { IsSuccess, Message } = result.recordsets[0][0];
    res.status(200).json({ success: IsSuccess, message: Message });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTodo,
  getTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
};
