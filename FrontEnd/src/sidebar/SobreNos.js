/**
 * Exibe informações sobre a empresa
 * @module sidebar/SobreNos
 */

import React from 'react';

/**
 * Componente funcional que exibe informações sobre a empresa.
 * 
 * Este componente descreve a missão e os valores da plataforma, oferecendo uma visão geral da empresa.
 * 
 * @component
 * @returns {JSX.Element} Um JSX contendo o layout da página "Sobre Nós", com a descrição da plataforma e informações de contato.
 */
function SobreNos() {
  return (
    <div className="container">
      <br/><br/><br/><br/>
      <div className="card mt-4">
        <div className="card-body">
          <h1 className="card-title text-center">Sobre Nós</h1>
          <p className="card-text text-center">
            Somos uma plataforma online que conecta compradores e vendedores. Nossa missão é facilitar a compra e venda de produtos de qualidade.
          </p>
          <p className="card-text text-center">
            Nosso compromisso é oferecer uma experiência de compra segura e conveniente. Nós trabalhamos duro para garantir que nossos usuários tenham acesso a uma ampla variedade de produtos e serviços.
          </p>
          <p className="card-text text-center">
            Tem alguma dúvida? Entre em contato conosco: cargoshop@gmail.com
          </p>
        </div>
      </div>
      <br/><br/><br/><br/>
    </div>
  );
}

export default SobreNos;
