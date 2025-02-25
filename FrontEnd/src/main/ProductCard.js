/**
 * Componente `ProductCard` exibe informações de um produto em um card.
 * @module main/ProductCard
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

/** 
 * O card exibe a imagem do produto, seu nome, preço e um botão para realizar a compra. Se o usuário não estiver logado, será redirecionado para a página de login ao tentar comprar o produto.
 * 
 * @component
 * 
 * @param {Object} product - O produto a ser exibido no card.
 * @param {number} product.id - ID único do produto.
 * @param {string} product.name - Nome do produto.
 * @param {number} product.price - Preço do produto.
 * @param {string} product.image - URL da imagem do produto.
 * 
 * @returns {JSX.Element} Um card contendo as informações do produto e um botão de compra.
 */
export default function ProductCard({ product }) {
    /** Estado de login do usuário, obtido do Redux */
    const status = useSelector(state => state.logins.status);
    /** Navegação para redirecionar o usuário */
    const navigate = useNavigate();

    /**
     * Função que lida com o clique no botão de compra.
     * Redireciona o usuário para a página de login se não estiver logado,
     * ou para a página de detalhes do produto caso esteja logado.
     * 
     * @param {Object} product - O produto clicado.
     */
    const handleClick = (product) => {
        if (status !== "logged_in") {
            navigate("/login");
        } else {
            navigate(`/produtos/${product.id}`, { state: { product } });
        }
    };

    return (
        <div className="col-md-4 mb-3">
            <div className="card product h-100">
                <img 
                    src={product.image} 
                    className="card-img-top" 
                    alt={product.name} 
                    style={{ objectFit: "cover", height: "200px" }} 
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">R$ {product.price.toFixed(2)}</p>
                    <button className="btn btn-success" onClick={() => handleClick(product)}>Comprar</button>
                </div>
            </div>
        </div>
    );
}
