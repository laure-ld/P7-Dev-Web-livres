import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Récupération des paramètres d'URL
import BookItem from '../BookItem/BookItem';
import styles from './BestRatedBooks.module.css';

function BestRatedBooks() {
  const [bestRatedBooks, setBestRatedBooks] = useState([]);
  const { id } = useParams(); // Récupérer l'ID du livre actuel via React Router

  useEffect(() => {
    async function fetchBestRatedBooks() {
      try {
        const response = await fetch(`http://localhost:3000/api/books/bestrating?id=${id}`);
        const data = await response.json();
        setBestRatedBooks(data);
      } catch (error) {
        console.error('Erreur lors de la récupération :', error);
      }
    }
    if (id) { // Vérifier que l'ID est bien défini avant d'appeler l'API
      fetchBestRatedBooks();
    }
  }, [id]);
  const bestRatedBooksContent = bestRatedBooks.length > 0 ? (
    // eslint-disable-next-line no-underscore-dangle
    bestRatedBooks.map((elt) => <BookItem key={`book-${elt._id}`} book={elt} size={3} />)
  ) : <h3>Aucune recommandation</h3>;

  return (
    <section className={`content-container ${styles.BestRatedBooks}`}>
      <h2>Les mieux notés</h2>
      <div className={styles.List}>
        {bestRatedBooksContent}
      </div>
    </section>
  );
}

export default BestRatedBooks;
