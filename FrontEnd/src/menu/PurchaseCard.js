/**
 * Exibe um cartão com informações de um pedido e opções de avaliação.
 * @module menu/PurchaseCard
 */
import React from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { removeReviewServer, selectAllReviews } from '../slices/ReviewsSlice';
import { Link } from 'react-router-dom';

/**
 * Componente que renderiza um cartão de compra, exibindo informações do pedido,
 * como o nome do produto, preço, vendedor e endereço. Também exibe botões para 
 * avaliação, com a possibilidade de adicionar, atualizar ou excluir avaliações.
 *
 * @component
 * @param {Object} order - Objeto contendo as informações do pedido.
 * @param {string} order.id - O ID único do pedido.
 * @param {string} order.name - O nome do produto comprado.
 * @param {number} order.price - O preço total do pedido.
 * @param {string} order.image - O URL da imagem do produto.
 * @param {string} order.NomeVendedor - O nome do vendedor.
 * @param {string} order.endereco - O endereço de entrega do pedido.
 * @returns {JSX.Element} O componente que renderiza o cartão da compra.
 */
export default function PurchaseCard({ order }) {

    const dispatch = useDispatch();

    const reviews = useSelector(selectAllReviews);

    /**
     * Verifica se o pedido já possui uma avaliação associada.
     * @type {Array}
     */
    const reviewAlreadyExists = reviews.filter(review => {
        return review.orderId === order.id;
    });

    let description = null;
    if (reviewAlreadyExists.length > 0) {
        description =
            <>
            <Link to={`/avaliar/${order.id}/${reviewAlreadyExists[0].id}`}>
                <button className="btn btn-warning my-1">Atualizar avaliação</button>
            </Link>
            <button className="btn btn-danger my-1" onClick={() => dispatch(removeReviewServer(reviewAlreadyExists[0].id))}>Excluir avaliação</button>
            </>
    } else {
        description = <Link to={`/avaliar/${order.id}`}><button className="btn btn-warning">Avaliar vendedor</button></Link>
    }

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card shadow-lg">
                <img
                    src={order.image}
                    className="card-img-top"
                    alt={order.name}
                    style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                />
                <div className="card-body">
                    <h5 className="card-title">{order.name}</h5>
                    <p className="card-text">Valor Total: R$ {order.price}</p>
                    <p className="card-text">Vendedor: {order.NomeVendedor}</p>
                    <p className="card-text">Endereço: {order.endereco}</p>
                    {description}
                </div>
            </div>
        </div>
    );
}
