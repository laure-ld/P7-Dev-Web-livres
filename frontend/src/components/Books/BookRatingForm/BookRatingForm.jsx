import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './BookRatingForm.module.css';
import { generateStarsInputs, displayStars } from '../../../lib/functions';
import { APP_ROUTES } from '../../../utils/constants';
import { useUser } from '../../../lib/customHooks';
import { rateBook } from '../../../lib/common';

function BookRatingForm({
  rating, setRating, userId, setBook, id,
}) {
  const { connectedUser, auth } = useUser();
  const navigate = useNavigate();
  const { register, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      rating: 0,
    },
  });
  // eslint-disable-next-line no-underscore-dangle
  const [alreadyRated, setAlreadyRated] = useState(false);
  useEffect(() => {
    if (formState.dirtyFields.rating) {
      const rate = document.querySelector('input[name="rating"]:checked').value;
      setRating(parseInt(rate, 10));
      formState.dirtyFields.rating = false;
    }
  }, [formState]);
  const onSubmit = async () => {
    if (!connectedUser || !auth) {
      navigate(APP_ROUTES.SIGN_IN);
      return;
    }
    const { book, alreadyRated: newAlreadyRated } = await rateBook(id, userId, rating);
    if (book) {
      // eslint-disable-next-line no-underscore-dangle
      setBook({ ...book, id: book._id });
      setAlreadyRated(newAlreadyRated);
    } else {
      alert('Vous avez déjà voté pour ce livre');
    }
  };
  return (
    <div className={styles.BookRatingForm}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>{rating > 0 ? 'Votre Note' : 'Notez cet ouvrage'}</p>
        <div className={styles.Stars}>
          {!alreadyRated ? generateStarsInputs(rating, register) : displayStars(rating)}
        </div>
        {!alreadyRated ? <button type="submit">Valider</button> : null}
      </form>
    </div>
  );
}

BookRatingForm.propTypes = {
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  setBook: PropTypes.func.isRequired,
  userRated: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};

export default BookRatingForm;
