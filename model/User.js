const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  files: {
    type: Array,
    required: true
  },
});

module.exports = mongoose.model('User', userSchema);