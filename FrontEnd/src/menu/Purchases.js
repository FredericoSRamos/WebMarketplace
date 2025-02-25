/**
 * Exibe as compras do vendedor logado, com a possibilidade de visualizar as avaliações associadas.
 * @module menu/Purchases
 */
import { useDispatch, useSelector } from "react-redux"
import { fetchPedidos, selectAllPedidos } from "../slices/PedidoSlice"
import PurchaseCard from "./PurchaseCard";
import { fetchReviews } from "../slices/ReviewsSlice";
import { useEffect } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

/**
 * Utiliza o Redux para gerenciar o estado das compras do vendedor logado e exibe essas compras
 * juntamente com as avaliações associadas.
 *
 * @component
 * @returns {JSX.Element} O componente que renderiza as compras do vendedor logado.
 */
export default function Purchases() {
    const orders = useSelector(selectAllPedidos);
    const dispatch = useDispatch();

    const status = useSelector(state => state.reviews.status);
    const error = useSelector(state => state.reviews.error);
    const seller = useSelector(state => state.logins.username);

    useEffect(() => {
        dispatch(fetchPedidos());
        dispatch(fetchReviews());
    }, [dispatch]);

    /**
     * Utiliza o hook useEffect para buscar as avaliações sempre que o status mudar para "not_loaded",
     * "saved", "deleted" ou "failed". Em caso de falha, a requisição é repetida após 5 segundos.
     *
     * @effect
     */
    useEffect(() => {
        if (status === "not_loaded") {
            dispatch(fetchPedidos());
            dispatch(fetchReviews());
        } else if (status === "failed") {
            setTimeout(() => dispatch(fetchPedidos()), 1000);
            setTimeout(() => dispatch(fetchReviews()), 1000);
        }
    }, [status, dispatch]);

    useEffect(() => {
            socket.on('pedidoUpdated', (data) => {
                dispatch(fetchPedidos());
                dispatch(fetchReviews());
                });
        
                return () => {
                    socket.off('pedidoUpdated');
                };
        }, [dispatch]);

    /**
     * Filtra as compras para exibir apenas aquelas feitas pelo vendedor logado.
     * 
     * @returns {Array} Lista de compras filtradas.
     */
    const filteredOrders = orders.filter(order => {
        return order.comprador === seller;
    });

    let purchases = null;
    
    /**
     * Condicionalmente exibe o conteúdo com base no status das avaliações.
     * - Se "loaded", exibe as compras filtradas.
     * - Se "loading", exibe uma mensagem de carregamento.
     * - Se "failed", exibe uma mensagem de erro.
     * 
     * @returns {JSX.Element} Elemento que representa o conteúdo das compras.
     */
    if (status === "loaded") {
        purchases = filteredOrders.map(order => (<PurchaseCard key={order.id} order={order}/>));
        if (purchases.length <= 0) {
            purchases = <div>Nenhuma compra encontrada</div>
        }
    } else if (status === "loading") {
        purchases = <div>Carregando as compras...</div>;
    } else if (status === "failed") {
        purchases = <div>Erro: {error}</div>
    }

    /**
     * Retorna o componente principal com a estrutura das compras do vendedor logado.
     * 
     * @returns {JSX.Element} O JSX que renderiza a tela com as compras.
     */
    return (
        <div>
            <br/>
            <h2>Suas Compras</h2>
            <br/>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {purchases}
            </div>
        </div>
    )
}
