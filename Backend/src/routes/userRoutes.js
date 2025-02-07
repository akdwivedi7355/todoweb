const express = require('express');
const  registerUser  = require('../controllers/userController');
const auth = require('../middleware/auth')

const router = express.Router();


router.post('/register', registerUser.registerUser);
router.get('/getuser',auth, registerUser.getalluser);


module.exports = router;
