const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Введен неверный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
