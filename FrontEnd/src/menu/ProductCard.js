/**
 * Exibe um cartão com os detalhes de um produto.
 * @module menu/ProductCard
 */
import { Link } from "react-router-dom";
import { removeProductServer } from "../slices/ProductsSlice";
import { useDispatch } from "react-redux";

/**
 * Componente que renderiza um cartão de produto com informações como imagem, nome e preço.
 * O cartão possui também opções para editar ou remover o produto.
 *
 * @component
 * @param {Object} product - Objeto contendo os dados do produto.
 * @param {string} product.id - O ID único do produto.
 * @param {string} product.name - O nome do produto.
 * @param {number} product.price - O preço do produto.
 * @param {string} product.image - O URL da imagem do produto.
 * @returns {JSX.Element} O componente que renderiza o cartão do produto.
 */
export default function ProductCard({ product }) {
    const dispatch = useDispatch();

    /**
     * Remove o produto do servidor, despachando a ação `removeProductServer`.
     *
     * @param {string} product.id - O ID do produto a ser removido.
     */
    const handleRemove = () => {
        dispatch(removeProductServer(product.id));
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
                    <div>
                        <Link to={`/vender/${product.id}`} className="text-decoration-none" state={{product}}>
                            <button className="btn btn-warning mx-1 text-white">Editar</button>
                        </Link>
                        <button className="btn btn-danger mx-1" onClick={handleRemove}>Remover</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
