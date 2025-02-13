import React, { useState, useEffect } from 'react';
import BookItem from '../BookItem/BookItem';
import styles from './BestRatedBooks.module.css';

function BestRatedBooks() {
  const [bestRatedBooks, setBestRatedBooks] = useState([]);

  useEffect(() => {
    async function fetchBestRatedBooks() {
      try {
        const response = await fetch('http://localhost:3000/api/books');
        const data = await response.json();
        setBestRatedBooks(data);
      } catch (error) {
        console.error('Erreur lors de la récupération :', error);
      }
    }
    fetchBestRatedBooks();
  }, []);
  function compareNumbers(a, b) {
    return b.averageRating - a.averageRating;
  }
  const bestRatedBooksContent = bestRatedBooks.length > 0 ? (
    bestRatedBooks.sort(compareNumbers).slice(0, 3).map((elt, index) => (
      <BookItem key={`book-${elt.id || index}`} book={elt} size={3} />
    ))
  ) : (
    <h3>Aucune recommandation</h3>
  );
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
