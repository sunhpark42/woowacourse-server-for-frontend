const mongoose = require('mongoose');

const autoIncrement = require('mongoose-auto-increment');
const { Station } = require('./Station');

autoIncrement.initialize(mongoose.connection);

const lineSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 20,
    unique: true,
  },
  color: {
    type: String,
    unique: true,
  },
  stations: {
    type: Array,
    items: {},
  },
  sections: {
    type: Array,
    items: {},
  },
  createdDate: {
    type: Date,
  },
  modifiedDate: {
    type: Date,
  },
});

lineSchema.plugin(autoIncrement.plugin, {
  model: 'Line', // collection or table name in which you want to apply auto increment
  field: '_id', // field of model which you want to auto increment
  startAt: 1, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});

const Line = mongoose.model('Line', lineSchema);

module.exports = { Line };
