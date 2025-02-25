/**
 * Exibe os pedidos do usuário logado.
 * @module Pedidos/Pedidos
 */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PedidosCard from './PedidosCard';
import { fetchPedidos, selectAllPedidos } from "../slices/PedidoSlice";
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

/**
 * Utiliza o Redux para gerenciar o estado dos pedidos,
 * filtrando e exibindo apenas aqueles pertencentes ao comprador logado.
 *
 * @component
 * @returns {JSX.Element} O componente que renderiza os pedidos do usuário.
 */

export default function Pedidos() {
  const dispatch = useDispatch();
  const pedidos = useSelector(selectAllPedidos);
  const status = useSelector((state) => state.pedidos.status);
  const error = useSelector((state) => state.pedidos.error);
  const buyer = useSelector(state => state.logins.username);

  useEffect(() => {
    dispatch(fetchPedidos());
}, [dispatch]);

  useEffect(() => {
    if (status === "not_loaded") {
      dispatch(fetchPedidos());
    } else if (status === 'failed') {
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

  const filteredPedidos = pedidos.filter(pedido => {
    return pedido.comprador === buyer;
  });

  let pedidosShow = null;

  if (status === "succeeded") {
    pedidosShow = filteredPedidos.map((pedido) => (<PedidosCard key={pedido.id} pedido={pedido} />));
    if (pedidosShow.length <= 0) {
      pedidosShow = <div>Nenhum pedido encontrado.</div>;
    }
  } else if (status === "loading") {
    pedidosShow = <div>Carregando os pedidos...</div>;
  } else if (status === "failed") {
    pedidosShow = <div>Erro: {error}</div>;
  }

  return (
    <div className="container">
      <br />
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Meus Pedidos</h1>
      {status === 'loading' && <p>Carregando...</p>}
      <div className="row g-4">
        {pedidosShow}
      </div>
    </div>
  );
}
