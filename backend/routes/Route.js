const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const booksCtrl = require('../controllers/BooksCtrl');

router.get('/', booksCtrl.getAllBook );
router.get('/bestrating', booksCtrl.bestRating );
router.post('/', auth, multer, booksCtrl.createBook);
router.post('/:id/rating', auth, booksCtrl.rating);
router.get('/:id', booksCtrl.getOneBook );
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
 
module.exports = router;