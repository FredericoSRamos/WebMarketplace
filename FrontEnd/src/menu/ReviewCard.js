/**
 * Exibe os detalhes de uma avaliação.
 * @module menu/ReviewCard
 */
import React from 'react'; 

/**
 * Componente que renderiza um cartão com os detalhes de uma avaliação.
 * Exibe a nota e a mensagem da avaliação fornecida como prop.
 *
 * @component
 * @param {Object} review - Objeto contendo os dados da avaliação.
 * @param {number} review.rate - A nota dada na avaliação (0-10).
 * @param {string} review.message - A mensagem associada à avaliação.
 * @returns {JSX.Element} O componente que renderiza o cartão de avaliação.
 */
export default function ReviewCard({ review }) {

  return (
    <div className="col"> 
        <div className="card mb-3">
            <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">Nota: {review.rate}</h6>
                <p className="card-text">{review.message}</p>
                <br/>
            </div>
        </div>
    </div>
  );
}
