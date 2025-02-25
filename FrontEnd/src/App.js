/**
 * Componente principal da aplicação CargoShop.
 * Este componente organiza a aplicação como um todo, incluindo rotas,
 * navegação e conexão com o estado global usando Redux.
 *
 * @component
 * @example
 * <App />
 *
 * @returns {JSX.Element} O componente raiz da aplicação.
 */

// Importações necessárias
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';

// Importação de componentes
import MainPage from './main/mainPage';
import UserMain from './menu/UserMain';
import ProductDetails from './purchase/ProductDetails';
import Sidebar from './main/Sidebar';
import SobreNos from './sidebar/SobreNos';
import Contato from './sidebar/Contatos';
import Pechincha from './menu/Pechincha';
import MyProducts from './menu/MyProducts';
import ProductForm from './menu/AddProduct';
import Pedidos from './Pedidos/Pedidos';
import PagamentosCard from "./Pedidos/PagamentosCard";
import Sales from './menu/Sales';
import Purchases from './menu/Purchases';
import Review from './menu/Review';
import Reviews from './menu/Reviews';
import LoginForm from './users/LoginForm';

// Definição do componente App
const App = () => {
  /**
   * Estado global que determina o status de login do usuário.
   * @type {string}
   */
  const status = useSelector(state => state.logins.status);

  /**
   * Estado local que controla a exibição de opções no cabeçalho,
   * dependendo do status de login do usuário.
   * @type {JSX.Element|null}
   */
  const [showScreen, setShowScreen] = useState(null);

  /**
   * Efeito que atualiza o conteúdo exibido no cabeçalho com base no status de login do usuário.
   */
  useEffect(() => {
    if (status === "logged_in") {
      setShowScreen(
        <div className="d-flex">
          <h3 className="mx-2">
            <Link to="/pechinchas" className="text-decoration-none">💲</Link>
          </h3>
          <h3 className="mx-2">
            <Link to="/pedidos" className="text-decoration-none">🛍️</Link>
          </h3>
          <h3 className="mx-2">
            <Link to="/usuario" className="text-decoration-none">👤</Link>
          </h3>
        </div>
      );
    } else {
      setShowScreen(
        <div className="d-flex">
          <h3 className="mx-2">
            <Link to="/login" className="text-decoration-none">👤</Link>
          </h3>
        </div>
      );
    }
  }, [status]);

  /**
   * Renderiza o componente principal da aplicação, incluindo cabeçalho,
   * rotas e rodapé.
   */
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="container">
          {/* Cabeçalho com barra lateral e opções de navegação */}
          <header className="d-flex justify-content-between align-items-center py-3 position-relative">
            <Sidebar />
            <h1 className="position-absolute start-50 translate-middle-x">
              <Link to="/" className="text-decoration-none text-body">CargoShop</Link>
            </h1>
            {showScreen}
          </header>

          {/* Definição de rotas da aplicação */}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/usuario" element={<UserMain />} />
            <Route path="/produtos/:id" element={<ProductDetails />} />
            <Route path="/sobrenos" element={<SobreNos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/pechinchas" element={<Pechincha />} />
            <Route path="/meusprodutos" element={<MyProducts />} />
            <Route path="/vender" element={<ProductForm />} />
            <Route path="/vender/:id" element={<ProductForm />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/pagamentosCard/:id" element={<PagamentosCard />} />
            <Route path="/vendas" element={<Sales />} />
            <Route path="/compras" element={<Purchases />} />
            <Route path="/avaliacoes" element={<Reviews />} />
            <Route path="/avaliar/:orderId" element={<Review />} />
            <Route path="/avaliar/:orderId/:reviewId" element={<Review />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>

          {/* Rodapé da aplicação */}
          <footer className="py-3 text-center">&copy; 2024 CargoShop </footer>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
