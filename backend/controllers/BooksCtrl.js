const Book = require('../models/Books');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete bookObject._userId;
  
  Book.findOne({_id: req.params.id})
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllBook = (req, res, next) => {
  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.bestRating = async (req, res) => {
  try {
    const bestBooks = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3);

    res.status(200).json(bestBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rating = async (req, res) => {
  try {
    const { userId, rating } = req.body;
    const bookId = req.params.id;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "La note doit être comprise entre 0 et 5." });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }
    if (!Array.isArray(book.rating)) {
      book.rating = [];
    }

    const alreadyRated = book.rating.some(r => r.userId === userId);
    if (alreadyRated) {
      return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
    }

    book.rating.push({ userId, grade: rating });
    const totalRatings = book.rating.length;
    const sumRatings = book.rating.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = sumRatings / totalRatings;
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};