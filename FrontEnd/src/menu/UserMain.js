/**
 * Componente funcional que exibe o menu principal do usuário logado.
 * 
 * O componente `UserMain` exibe uma série de botões que permitem ao usuário navegar 
 * para diferentes páginas do sistema, como "Produtos", "Pechinchas", "Pedidos", 
 * "Compras", "Vendas" e "Avaliações". Além disso, inclui um botão de logout 
 * que permite ao usuário sair da aplicação.
 * 
 * @module menu/UserMain
 * @returns {JSX.Element} - Retorna o JSX para exibir o menu do usuário com opções de navegação.
 */
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutServer } from '../slices/LoginSlice';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Componente de botão estilizado.
 * 
 * @param {Object} props - Propriedades do componente.
 * @param {React.ReactNode} props.children - Conteúdo a ser exibido no botão.
 * @returns {JSX.Element} - Retorna um botão com a classe `btn btn-primary`.
 */
function Button({ children }) {
  return (
    <button className={`btn btn-primary btn-lg my-2`} style={{ padding: '1rem 2rem' }}>
      {children}
    </button>
  );
}

/**
 * Componente principal do usuário logado.
 * 
 * Este componente gerencia a navegação para várias páginas de funcionalidades do usuário.
 * Se o status do login do usuário for "not_logged_in", o componente redireciona o usuário
 * para a página inicial.
 * 
 * @returns {JSX.Element} - Retorna o JSX que renderiza o menu principal do usuário.
 */
function UserMain() {
  const dispatch = useDispatch(); // Função para despachar ações do Redux.
  const navigate = useNavigate(); // Hook para navegar entre as páginas.

  const status = useSelector(state => state.logins.status); // Status do login do usuário.

  useEffect(() => {
    // Se o usuário não estiver logado, redireciona para a página inicial.
    if (status === "not_logged_in") {
      navigate("/"); // Redireciona para a página inicial.
    }
  }, [status, navigate]); // Re-executa sempre que o status mudar.

  return (
    <div className="d-flex flex-column align-items-center">
      <br />
      <h1>Usuário</h1>
      <br />
      {/* Links para diferentes páginas do sistema */}
      <Link to="/meusprodutos" className="text-decoration-none">
        <Button>Produtos</Button>
      </Link>
      <Link to="/pechinchas" className="text-decoration-none">
        <Button>Pechinchas</Button>
      </Link>
      <Link to="/pedidos" className="text-decoration-none">
        <Button>Pedidos</Button>
      </Link>
      <Link to="/compras" className="text-decoration-none">
        <Button>Compras</Button>
      </Link>
      <Link to="/vendas" className="text-decoration-none">
        <Button>Vendas</Button>
      </Link>
      <Link to="/avaliacoes" className="text-decoration-none">
        <Button>Avaliações</Button>
      </Link>
      {/* Botão de logout */}
      <button 
        className={`btn btn-danger btn-lg my-2`}
        style={{ padding: '1rem 2rem' }}
        onClick={() => dispatch(logoutServer())} // Ação de logout
      >
        Sair
      </button>
    </div>
  );
}

export default UserMain;
