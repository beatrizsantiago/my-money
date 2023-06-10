const mongooseInTags = require('mongoose');

const tagsSchema = new mongooseInTags.Schema({
  name: {
    required: true,
    type: String,
  },
}, { versionKey: false })

module.exports = mongooseInTags.model('Tags', tagsSchema);
