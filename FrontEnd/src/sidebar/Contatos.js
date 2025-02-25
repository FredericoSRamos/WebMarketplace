/**
 * Exibe as informações de contato
 * @module sidebar/Contatos
 */
import React from 'react';

/**
 * Componente funcional que exibe as informações de contato.
 * 
 * @component
 * @returns {JSX.Element} Um JSX contendo o layout da página de contato com telefone e e-mail.
 */
function Contato() {
  /** Número de telefone exibido na página de contato */
  const number = "(21) 97910-7108";

  return (
    <div className="container">
      <br/><br/><br/><br/>
      <div className="card mt-4">
        <div className="card-body">
          <h1 className="card-title text-center">Contato</h1>
          <p className="card-text text-center">
            Entre em contato conosco pelos meios abaixo:
          </p>
          <p className="card-text text-center">
            Tel.: {`${number}`}
          </p>
          <p className="card-text text-center">
            E-mail: cargoshop@gmail.com
          </p>
        </div>
      </div>
      <br/><br/><br/><br/>
    </div>
  );
}

export default Contato;
