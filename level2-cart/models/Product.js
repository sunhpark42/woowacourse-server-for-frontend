const mongoose = require('mongoose');

const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

const productSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  imageUrl: String,
  price: Number,
  description: String,
});

productSchema.plugin(autoIncrement.plugin, {
  model: 'Line', // collection or table name in which you want to apply auto increment
  field: '_id', // field of model which you want to auto increment
  startAt: 1, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
