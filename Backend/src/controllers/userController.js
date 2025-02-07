const { getConnection, sql } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { name, email, password, userRole } = req.body;
    const pool = await getConnection();


    // Execute the stored procedure for user registration
    const result = await pool.request()
      .input('TypeControl', sql.Int, 1) // 1 for Insert
      .input('Name', sql.VarChar, name)
      .input('Email', sql.VarChar, email)
      .input('Password', sql.VarChar, password)
      .input('UserRole', sql.VarChar, userRole || 'user') // Default role: 'user'
      .execute('sp_ManageUsers');

    const { IsSuccess, Message } = result.recordsets[0][0];

    res.status(200).json({
      success: IsSuccess,
      message: Message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getalluser = async (req, res) => {
    try {
      const pool = await getConnection();
  
  
      // Execute the stored procedure for user registration
      const result = await pool.request()
        .input('TypeControl', sql.Int, 5) 
        .execute('sp_ManageUsers');
  
        const { IsSuccess, Message } = result.recordsets[0];
        const todos = result.recordsets[1];
    
        res.status(200).json({ success: IsSuccess, message: Message, data: todos });
    
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  };

module.exports = { registerUser , getalluser };
