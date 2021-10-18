const mongoose = require('mongoose');

const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const stationSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 20,
    unique: true,
  },
  createdDate: {
    type: Date,
  },
  modifiedDate: {
    type: Date,
  },
});

stationSchema.plugin(autoIncrement.plugin, {
  model: 'Station', // collection or table name in which you want to apply auto increment
  field: '_id', // field of model which you want to auto increment
  startAt: 1, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});

const Station = mongoose.model('Station', stationSchema);

module.exports = { Station };
