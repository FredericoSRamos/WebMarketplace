/**
 * Exibe as informações de uma pechincha e oferece ações de cancelar ou editar.
 * @module main/PechinchaCard
 */
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { removePechinchaServer, updatePechinchaServer, selectPechinchasById } from '../slices/PechinchaSlice';
import { selectProductsById } from '../slices/ProductsSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import { pechinchaSchema } from '../menu/PechinchaSchema';
import { useForm } from 'react-hook-form';
import '../PechinchaCard.css';

/**
 * Componente `PechinchaCard` exibe as informações de uma pechincha e oferece ações de cancelar ou editar.
 * Se a pechincha foi aceita, exibe a opção de pagamento.
 * 
 * @component
 * 
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.pechincha - Objeto contendo as informações da pechincha.
 * 
 * @returns {JSX.Element} O card com as opções de interação com a pechincha.
 */
export default function PechinchaCard({ pechincha }) {
  /** ID da pechincha extraído dos parâmetros da URL */
  let { id } = useParams();
  
  /** Detalhes da pechincha encontrada pelo ID */
  const pechinchaFound = useSelector(state => selectPechinchasById(state, id));
  
  /** Detalhes do produto associado à pechincha */
  const productFound = useSelector(state => selectProductsById(state, pechincha.idProduct));

  /** Nome do comprador, obtido do estado de login */
  const buyer = useSelector(state => state.logins.username);

  /** Função para navegar entre as páginas */
  const navigate = useNavigate();

  /** Função para despachar ações do Redux */
  const dispatch = useDispatch();

  /** Controle de exibição de modais */
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState('');

  /** Hook de formulários com validação do Yup */
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(pechinchaSchema)
  });

  /** Estado inicial de pechincha ou valor padrão do schema */
  const [pechinchaOnLoad] = useState(
    id ? pechinchaFound ?? pechinchaSchema.cast({}) : pechinchaSchema.cast({})
  );

  /**
   * Função chamada quando o usuário clica em "Cancelar Pechincha".
   * Exibe o modal de confirmação para cancelar.
   */
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  /**
   * Função chamada quando o usuário clica em "Editar Pechincha".
   * Exibe o modal para editar o valor da pechincha.
   */
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  /**
   * Função chamada para confirmar a edição da pechincha com o novo valor.
   * Despacha a atualização para o servidor.
   * 
   * @param {Object} data - Dados do formulário com o novo valor da pechincha.
   */
  const handleConfirmEdit = async (data) => {
    dispatch(updatePechinchaServer({ ...pechincha, descount: data.descount }));
    setMessage('Pechincha editada com sucesso!');
  };

  /**
   * Função chamada para confirmar o cancelamento da pechincha.
   * Despacha a remoção da pechincha no servidor.
   */
  const handleConfirmCancel = async () => {
    dispatch(removePechinchaServer(pechincha.id));
    setShowCancelModal(false);
  };

  /**
   * Função chamada para fechar o modal de cancelamento sem confirmar.
   */
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  /**
   * Função chamada para fechar o modal de edição sem salvar as mudanças.
   */
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  /**
   * Função chamada quando o usuário clica em "Pagar!".
   * Cria uma nova transação de pagamento e navega para a página de pagamento.
   */
  const handlepayClick = () => {
    const novoPagamento = {
      idProduto: productFound.id,
      name: productFound.name,
      image: productFound.image,
      price: pechincha.descount,
      NomeVendedor: productFound.seller,
      comprador: buyer,
      status: 'Finalizado',
      endereco: '',
    };
    navigate(`/pagamentosCard/${productFound.id}`, { state: novoPagamento });
  };

  return (
    <div className="col-md-3 mb-4">
      <div className="card pechincha" style={{ position: 'relative' }}>
        <img src={productFound.image} className="card-img-top" alt={productFound.name} style={{ objectFit: "cover", height: "200px" }} />
        <div className="card-body">
          <h5 className="card-title">{productFound.name}</h5>
          <p className="card-text">Valor Total: R$ {productFound.price}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="card-text">Valor Pechinchado: R$ {pechincha.descount}</p>
          </div>

          {pechincha.status === 'pendente' && (
            <div className="button-container">
              <button className="btn btn-danger button" onClick={handleCancelClick}>
                Cancelar Pechincha
              </button>
              <button className="btn btn-success" onClick={handleEditClick}>
                Editar Pechincha
              </button>
            </div>
          )}

          {pechincha.status === 'aceito' && (
            <div>
              <button className="btn btn-success my-2" onClick={handlepayClick}>
                Pagar!
              </button>
              <h5 className="card-title text-danger">PECHINCHA ACEITA!</h5>
            </div>
          )}
        </div>
      </div>

      {showCancelModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Tem certeza que deseja cancelar a pechincha?</h4>
            <button className="btn btn-danger my-1" onClick={handleConfirmCancel}>Confirmar</button>
            <button className="btn btn-success my-1" onClick={handleCloseCancelModal}>Cancelar</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleSubmit(handleConfirmEdit)}>
              <h4>Insira Valor novo de Pechincha:</h4>
              <br />
              <div className="input-group">
                <span className="input-group-text">R$</span>
                <input
                  placeholder="Insira o valor do produto"
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="price"
                  max={0.9 * productFound.price}
                  min={0.1 * productFound.price}
                  defaultValue={pechinchaOnLoad.descount}
                  {...register("descount")}
                />
              </div>
              {errors.descount && <span>{errors.descount.message}</span>}
              <br />
              <button className="btn btn-success my-1 mx-1">Confirmar</button>
              {message && (
                <div className="alert alert-success mt-3">
                  {message}
                </div>
              )}
              <button className="btn btn-danger my-1 mx-1" onClick={handleCloseEditModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
