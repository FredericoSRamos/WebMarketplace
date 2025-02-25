/**
 * Exibe a página principal com uma lista de produtos filtráveis por nome e categoria.
 * @module main/mainPage
 */
import { useEffect, useState, useRef } from 'react';
import ProductCard from './ProductCard';
import ProductCardAdmin from './ProductCardAdmin';
import CategoryCard from './CategoryCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectAllProducts } from '../slices/ProductsSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

/**
 * Componente `MainPage` exibe a página principal com uma lista de produtos filtráveis por nome e categoria.
 * Também permite alternar entre categorias e realizar uma busca por nome de produto.
 * 
 * @component
 * 
 * @returns {JSX.Element} A página principal com barra de pesquisa e lista de categorias e produtos.
 */
export default function MainPage() {
    /** Estado que controla se as categorias estão visíveis ou não */
    const [showCategories, setShowCategories] = useState(false);

    /** Estado que armazena o termo de pesquisa */
    const [searchTerm, setSearchTerm] = useState('');

    /** Estado que armazena a categoria selecionada */
    const [selectedCategory, setSelectedCategory] = useState('Todas');

    /** Lista de categorias disponíveis para o filtro */
    const [categories] = useState([
        '💄 Beleza',
        '🚲 Bicicletas',
        '💻 Eletrônicos',
        '🔧 Ferramentas',
        '💎 Joalheria',
        '👓 Óculos',
        '✏️ Papelaria',
        '⌚ Relógios',
        '🛒 Todas'
    ]);

    /** Referência para a seção de produtos, usada para rolar para a lista de produtos */
    const productsSectionRef = useRef(null);

    /** Lista de produtos obtidos do Redux */
    const products = useSelector(selectAllProducts);
    
    /** Status do carregamento dos produtos */
    const status = useSelector(state => state.products.status);

    /** Erro de carregamento, se houver */
    const error = useSelector(state => state.products.error);

    /** Nome do vendedor, para evitar que o vendedor veja seus próprios produtos */
    const seller = useSelector(state => state.logins.username);
    const admin = useSelector(state => state.logins.admin);

    /** Função para despachar ações do Redux */
    const dispatch = useDispatch();

    useEffect(() => {
            dispatch(fetchProducts());
        }, [dispatch]);

    /**
     * Efeito colateral que realiza o fetch dos produtos dependendo do status.
     * Tenta novamente em 5 segundos se o status for 'failed'.
     */
    useEffect(() => {
        if (status === "not_loaded") {
            dispatch(fetchProducts());
        } else if (status === "failed") {
            setTimeout(() => dispatch(fetchProducts()), 1000);
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

    /** Filtra os produtos com base no termo de busca e na categoria selecionada */
    const filteredProducts = products.filter(product => {
        return (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === 'Todas' || product.category === selectedCategory) &&
            product.seller !== seller
        );
    });

    let produtos = null;
    if (status === "loaded") {
        if (admin) {
            produtos = filteredProducts.map(product => (<ProductCardAdmin key={product.id} product={product} />));
        } else {
            produtos = filteredProducts.map(product => (<ProductCard key={product.id} product={product} />));
        }
        if (produtos.length <= 0) {
            produtos = <div>Nenhum produto encontrado.</div>;
        }
    } else if (status === "loading") {
        produtos = <div>Carregando os produtos...</div>;
    } else if (status === "failed") {
        produtos = <div>Erro: {error}</div>;
    }

    /** Texto do botão de categorias, que muda de acordo com o estado de visibilidade */
    let categoriesShow = showCategories ? "▼ Categorias " : "▷ Categorias ";

    /**
     * Função chamada quando uma categoria é clicada.
     * Define a categoria selecionada e rola para a seção de produtos.
     * 
     * @param {string} category - A categoria clicada.
     */
    const handleCategoryClick = (category) => {
        setSelectedCategory(category.split(' ')[1]);
        if (productsSectionRef.current) {
            productsSectionRef.current.scrollIntoView({ behavior: 'smooth' }); // Rola para a seção de produtos
        }
    };

    return (
        <div>
            <input
                type="text"
                className="form-control mb-3"
                id="search-bar"
                placeholder="O que deseja comprar hoje?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <h2 onClick={() => setShowCategories(!showCategories)}>
                {categoriesShow}
            </h2>

            {showCategories && (
                <div className="categories d-flex flex-wrap justify-content-center">
                    {categories.map(category => (
                        <CategoryCard
                            key={category}
                            categoryName={category}
                            onClick={() => handleCategoryClick(category)}
                        />
                    ))}
                </div>
            )}

            <br />
            <h2>Produtos</h2>
            <br />
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" ref={productsSectionRef}>
                {produtos}
            </div>
        </div>
    );
}