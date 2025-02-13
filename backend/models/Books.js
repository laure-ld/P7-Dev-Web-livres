const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId : { type: String, required: true },
  title: { type: String, required: true },
  author : { type: String, required: true },
  year: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  genre: { type: String, required: true },
  rating : [
    {
        userId : { type: String, required: true},
        grade : { type: Number, required: true},
    }
  ],
  averageRating : { type: Number, default: 0 },
});

module.exports = mongoose.model('Book', bookSchema);