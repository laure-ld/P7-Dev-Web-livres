const express = require('express');

const app = express();
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://laure:0808@cluster0.3vj1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
).then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/books', (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: 'Objet créé !' });
});

app.get('/api/books', (req, res) => {
  const books = [{
    _id: 'oeihfzeoi',
    title: 'Mon premier objet',
    description: 'Les infos de mon premier objet',
    imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
    userId: 'qsomihvqios',
  },
  {
    _id: 'oeihfzeomoihi',
    title: 'Mon deuxième objet',
    description: 'Les infos de mon deuxième objet',
    imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
    userId: 'qsomihvqios',
  },
  ];
  res.status(200).json(books);
});

module.exports = app;
