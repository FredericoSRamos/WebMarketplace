/**
 * Componente funcional que exibe as vendas realizadas por um vendedor.
 * 
 * Este componente utiliza os dados de pedidos (vendas) filtrados pelo vendedor logado
 * e exibe um cartão com as informações de cada venda. O componente também faz a requisição
 * das avaliações feitas pelos compradores para garantir que as avaliações estão atualizadas.
 * 
 * @module menu/Sales
 * @returns {JSX.Element} - Retorna o JSX para exibir as vendas realizadas pelo vendedor.
 */
import { useDispatch, useSelector } from "react-redux";
import { fetchPedidos, selectAllPedidos } from "../slices/PedidoSlice";
import SaleCard from "./SaleCard";
import { useEffect } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Sales() {
    const orders = useSelector(selectAllPedidos); // Obtém todos os pedidos (vendas) do estado global.

    const dispatch = useDispatch(); // Função de despacho para disparar ações Redux.
    const status = useSelector(state => state.pedidos.status); // Status da requisição de avaliações.
    const error = useSelector(state => state.pedidos.error); // Erro, caso a requisição falhe.
    const seller = useSelector(state => state.logins.username); // Nome do vendedor logado.

    useEffect(() => {
        dispatch(fetchPedidos());
    }, [dispatch]);

    useEffect(() => {
        // Quando as avaliações não foram carregadas, estão salvas ou foram excluídas, realiza o fetch.
        if (status === "not_loaded") {
            dispatch(fetchPedidos());
        } else if (status === "failed") {
            // Se a requisição falhou, tenta novamente após 1 segundo.
            setTimeout(() => dispatch(fetchPedidos()), 1000);
        }
    }, [status, dispatch]);

    useEffect(() => {
            socket.on('pedidoUpdated', (data) => {
                dispatch(fetchPedidos());
                });
        
                return () => {
                    socket.off('pedidoUpdated');
                };
        }, [dispatch]);

    // Filtra os pedidos para exibir apenas os realizados pelo vendedor logado.
    const filteredOrders = orders.filter(order => {
        return order.NomeVendedor === seller;
    });

    let sales = null;
    if (status === "succeeded") {
        // Se as avaliações foram carregadas com sucesso, exibe os cartões de venda.
        sales = filteredOrders.map(order => (<SaleCard key={order.id} order={order}/>));
        if (sales.length <= 0) {
            // Caso não haja vendas para exibir.
            sales = <div>Nenhuma venda encontrada</div>
        }
    } else if (status === "loading") {
        // Caso as avaliações ainda estejam sendo carregadas.
        sales = <div>Carregando as vendas...</div>;
    } else if (status === "failed") {
        // Caso haja um erro ao carregar as avaliações.
        sales = <div>Erro: {error}</div>
    }

    return (
        <div>
            <br/>
            <h2>Suas Vendas</h2>
            <br/>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {sales}
            </div>
        </div>
    )
}
