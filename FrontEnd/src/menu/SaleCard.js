/**
 * Componente funcional que exibe informações sobre uma venda.
 * 
 * Este componente recebe os detalhes de uma venda via `props` e exibe essas informações dentro de um cartão.
 * Ele é usado para representar as vendas realizadas por um usuário no sistema.
 * 
 * @module menu/SaleCard
 * @param {Object} props - As propriedades recebidas pelo componente.
 * @param {Object} props.order - Objeto contendo as informações sobre a venda.
 * @param {string} props.order.image - URL da imagem do produto.
 * @param {string} props.order.name - Nome do produto.
 * @param {number} props.order.price - Preço total do produto.
 * @param {string} props.order.NomeVendedor - Nome do vendedor.
 * @param {string} props.order.endereco - Endereço relacionado à venda.
 * 
 * @returns {JSX.Element} - Retorna o JSX para exibir as informações da venda.
 */
import React from 'react';

export default function SaleCard({ order }) {

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
          <p className="card-text">Comprador: {order.comprador}</p>
          <p className="card-text">Endereço: {order.endereco}</p>
        </div>
      </div>
    </div>
  );
}
