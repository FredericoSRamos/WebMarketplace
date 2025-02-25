/**
 * Exibe um cartão com informações de uma avaliação e opções para atualizar ou excluir a avaliação.
 * @module menu/ReviewCardOwn
 */
import React from 'react'; 
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeReviewServer } from '../slices/ReviewsSlice';

/**
 * Componente que renderiza um cartão de avaliação, exibindo informações como a nota e a mensagem da avaliação.
 * Também oferece botões para atualizar ou excluir a avaliação.
 *
 * @component
 * @param {Object} review - Objeto contendo as informações da avaliação.
 * @param {string} review.id - O ID único da avaliação.
 * @param {number} review.rate - A nota atribuída na avaliação (de 0 a 10).
 * @param {string} review.message - A mensagem escrita na avaliação.
 * @param {string} review.orderId - O ID do pedido ao qual a avaliação está associada.
 * @returns {JSX.Element} O componente que renderiza o cartão da avaliação.
 */
export default function ReviewCardOwn({ review }) {

  const dispatch = useDispatch();

  return (
    <div className="col">
        <div className="card mb-3">
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">Nota: {review.rate}</h6>
            <p className="card-text">{review.message}</p>
            <br/>
            <div className="d-flex">
              <Link to={`/avaliar/${review.orderId}/${review.id}`}>
                <button className="btn btn-warning mx-1">Atualizar avaliação</button>
              </Link>
              <button className="btn btn-danger mx-1" onClick={() => dispatch(removeReviewServer(review.id))}>Excluir avaliação</button>
            </div>
          </div>
        </div>
    </div>
  );
}
