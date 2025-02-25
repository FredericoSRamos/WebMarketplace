/**
 * Componente `PechinchaCard` exibe um card com as informações de uma pechincha.
 * @module main/PechinchaCardOwn
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPechinchasById, updatePechinchaServer, removePechinchaServer } from '../slices/PechinchaSlice';
import { selectProductsById} from '../slices/ProductsSlice';
import '../PechinchaCard.css';

/**
 * 
 * O card mostra o nome, preço original e o preço negociado do produto. Dependendo do status da pechincha, o usuário pode confirmá-la ou recusá-la.
 * 
 * @component
 * 
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.id - ID da pechincha a ser exibida.
 * 
 * @returns {JSX.Element} Um card contendo as informações da pechincha e botões de ação.
 */
export default function PechinchaCard({ id }) {
  /** Detalhes da pechincha selecionada, obtido pelo ID */
  const pechincha = useSelector(state => selectPechinchasById(state, id));
  /** Detalhes do produto associado à pechincha */
  const productFound = useSelector(state => selectProductsById(state, pechincha.idProduct));
  /** Função para despachar ações do Redux */
  const dispatch = useDispatch();

  /**
   * Função chamada quando o usuário clica para confirmar a pechincha.
   * Atualiza o status da pechincha para "aceito" e pode atualizar o preço do produto.
   */
  const handleConfirm = () => {
    dispatch(updatePechinchaServer({ ...pechincha, status: 'aceito' }));
    // Atualizar o preço do produto (comentado, pois não está em uso)
    // dispatch(updateProductServer({ ...productFound, price: pechincha.descount }));
  };

  /**
   * Função chamada quando o usuário clica para recusar a pechincha.
   * Remove a pechincha do servidor.
   */
  const handleCancel = () => {
    dispatch(removePechinchaServer(pechincha.id));
  };

  return (
    <div className="col-md-3 mb-4">
      <div className="card pechincha" style={{ position: 'relative' }}>
        <img
          src={pechincha.image}
          className="card-img-top"
          alt={productFound.name}
          style={{ objectFit: 'cover', height: '200px' }}
        />

        <div className="card-body">
          <h5 className="card-title">{pechincha.name}</h5>
          <p className="card-text">Valor Total: R$ {productFound.price}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="card-text">Valor Pechinchado: R$ {pechincha.descount}</p>
          </div>

          {pechincha.status === 'pendente' && (
            <div className="button-container">
              <button className="btn btn-success" onClick={handleConfirm}>
                Confirmar
              </button>
              <button className="btn btn-danger" onClick={handleCancel}>
                Recusar
              </button>
            </div>
          )}

          {pechincha.status === 'aceito' && (
            <div className="alert alert-success">Pechincha confirmada!</div>
          )}
        </div>
      </div>
    </div>
  );
}
