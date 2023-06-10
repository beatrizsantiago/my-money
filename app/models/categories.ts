const mongooseInCategories = require('mongoose');

const categoriesSchema = new mongooseInCategories.Schema({
  name: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  }
}, { versionKey: false })

module.exports = mongooseInCategories.model('Categories', categoriesSchema);
