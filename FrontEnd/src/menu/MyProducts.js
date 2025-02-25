/**
 * Componente funcional que exibe os produtos listados pelo vendedor logado.
 * 
 * O componente `MyProducts` é responsável por buscar e exibir os produtos do usuário logado 
 * (vendedor). Ele faz uma consulta ao estado global para pegar os produtos cadastrados e 
 * filtra os que pertencem ao vendedor atual. Além disso, fornece um botão para o usuário 
 * listar um novo produto.
 * 
 * @module menu/MyProducts
 * @returns {JSX.Element} - Retorna o JSX que exibe a lista de produtos do vendedor.
 */
import { useEffect } from 'react';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, selectAllProducts } from '../slices/ProductsSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function MyProducts() {
    // Obtenção dos produtos e status do Redux
    const products = useSelector(selectAllProducts);
    const status = useSelector(state => state.products.status);
    const error = useSelector(state => state.products.error);
    const seller = useSelector(state => state.logins.username);

    const dispatch = useDispatch(); // Função para despachar ações do Redux

    useEffect(() => {
            dispatch(fetchProducts());
        }, [dispatch]);

    // Efeito para carregar os produtos
    useEffect(() => {
        if (status === "not_loaded") {
            dispatch(fetchProducts()); // Buscar produtos se necessário
        } else if (status === "failed") {
            setTimeout(() => dispatch(fetchProducts()), 1000); // Tentar novamente após erro
        }
    }, [status, dispatch]);

    useEffect(() => {
            socket.on('productUpdated', (data) => {
                dispatch(fetchProducts());
                });
        
                return () => {
                    socket.off('productUpdated');
                };
        }, [dispatch]);

    // Filtra os produtos do vendedor logado
    const filteredProducts = products.filter(product => {
        return product.seller === seller;
    });

    // Variável para armazenar os produtos ou mensagem de erro
    let produtos = null;
    if (status === "loaded") {
        // Exibe os produtos se carregados com sucesso
        produtos = filteredProducts.map(product => (<ProductCard key={product.id} product={product} />));
        if (produtos.length <= 0) {
            produtos = <div>Nenhum produto encontrado.</div>;
        }
    } else if (status === "loading") {
        // Exibe mensagem de carregamento
        produtos = <div>Carregando os produtos...</div>;
    } else if (status === "failed") {
        // Exibe mensagem de erro
        produtos = <div>Erro: {error}</div>;
    }

    return (
        <div>
            <br />
            <h2>Seus Produtos</h2>
            <br />
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {produtos} {/* Exibe os produtos ou mensagem correspondente */}
            </div>
            <br />
            <div className="text-center">
                {/* Link para a página de listagem de novo produto */}
                <Link to={`/vender`} className="text-decoration-none">
                    <button className="btn btn-success btn-lg">Listar novo produto</button>
                </Link>
            </div>
        </div>
    );
}
