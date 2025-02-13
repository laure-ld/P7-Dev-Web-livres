const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

const processImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucune image fournie.' });
  }
  try {
    const extension = MIME_TYPES[req.file.mimetype]
    const filename = req.file.originalname.split(' ').join('_') + Date.now() + '.' + extension;
    const outputPath = path.join(__dirname, '../images/', filename);

    await sharp(req.file.buffer)
      .resize(700, 700)
      .toFile(outputPath);

    req.file.filename = filename;
    req.file.path = outputPath;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors du traitement de l\'image.' });
  }
};

module.exports = [upload, processImage];
