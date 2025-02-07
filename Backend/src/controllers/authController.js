const { getConnection, sql } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await getConnection();
    console.log("hello")
    
    const result = await pool.request()
      .input('Email', username)
      .input('Password', sql.NVarChar, password)
      .execute('sp_ManageLogin');
    console.log(result);
    const { IsSuccess, Message } =  result?.recordsets[1][0];

    let responseData = [];

    
    responseData =  result?.recordsets[0][0];
    console.log(responseData.UserID)

    const token = jwt.sign(
        { id: responseData.UserID },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

  res.status(200).json({
    success: IsSuccess,
    message: Message,
    data: {...responseData,token},
  })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};



module.exports = {
  login
};