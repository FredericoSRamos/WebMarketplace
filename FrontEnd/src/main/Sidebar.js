/**
 * Componente Sidebar exibe um menu lateral que pode ser aberto e fechado.
 * @module main/sidebar
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../sidebar/SideBar.css';

/** 
 * O componente permite a navegação entre diferentes páginas, como "Home", "Sobre nós" e "Contato", e exibe um menu lateral com opções de navegação. O menu pode ser aberto ou fechado ao clicar no ícone de menu ou ao mover o mouse para fora do menu.
 * 
 * @component
 * 
 * @returns {JSX.Element} Um menu lateral com links para navegação.
 */
function Sidebar() {
  /** Estado que controla a abertura e fechamento do sidebar */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Função que alterna o estado de abertura do sidebar.
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /**
   * Função que fecha o sidebar.
   */
  const hideSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      className="sidebar-container"
      onMouseLeave={hideSidebar}
    >
      <span className="menu-icon" onClick={toggleSidebar}>
        <h3>☰</h3>
      </span>
      <div
        className={`offcanvas offcanvas-start ${isSidebarOpen ? 'show' : ''}`}
        tabIndex="-1"
        id="offcanvasSidebar"
      >
        <div className="offcanvas-header">
          <h1 className="offcanvas-title">Menu</h1>
          <button
            type="button"
            className="btn-close"
            onClick={toggleSidebar}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item">
              <i className="fs-4 bi-house"></i>
              <span className="ms-2">
                <Link to="/" className="text-decoration-none text-body">
                  <h4>- Home</h4>
                </Link>
              </span>
            </li>
            <li className="nav-item">
              <i className="fs-4 bi-person"></i>
              <span className="ms-2">
                <Link to="/sobrenos" className="text-decoration-none text-body">
                  <h4>- Sobre nós</h4>
                </Link>
              </span>
            </li>
            <li className="nav-item">
              <i className="fs-4 bi-envelope"></i>
              <span className="ms-2">
                <Link to="/contato" className="text-decoration-none text-body">
                  <h4>- Contato</h4>
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
