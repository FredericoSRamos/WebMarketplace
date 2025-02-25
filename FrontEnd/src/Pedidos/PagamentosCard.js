/**
 * Permite que o usuário finalize o pedido e escolha o método de pagamento.
 * Ele exibe as informações do produto e as opções de endereço, envio e pagamento.
 * 
 * @module Pedidos/PagamentosCard
 */
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect} from "react";
import { addPedidoServer } from "../slices/PedidoSlice";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { PagamentoSchema } from "./PagamentoSchema";
import { useForm } from "react-hook-form";
import { removeProductServer } from "../slices/ProductsSlice"
import { removePechinchaServer, selectAllPechinchas } from "../slices/PechinchaSlice";


/**
 * Exibe o cartão de pagamento do pedido.
 *
 * @component
 * @returns {JSX.Element} O componente que renderiza o formulário de pagamento.
 */
export default function PagamentosCard() {
  const location = useLocation();
  const novoPagamento = location.state || null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pechinchas = useSelector(selectAllPechinchas);

  const {register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(PagamentoSchema),
  });
  
  const formaPagamentoSelecionada = watch("formaPagamento");

  /**
   * Função chamada para finalizar o pedido após o preenchimento do formulário de pagamento.
   * Atualiza o pedido com as informações fornecidas pelo usuário e faz a remoção do produto da lista de pechinchas.
   * 
   * @async
   * @function finalizarPedido
   * @param {Object} data - Os dados do formulário preenchidos pelo usuário.
   * @param {string} data.endereco - O novo endereço de entrega.
   * @param {string} data.opcaoEnvio - A opção de envio selecionada.
   * @param {string} data.formaPagamento - A forma de pagamento escolhida.
   */
  const finalizarPedido = async (data) => {
    const pedidoAtualizado = {
      ...novoPagamento,
      endereco: data.endereco,
      opcaoEnvio: data.opcaoEnvio,
      formaPagamento: data.formaPagamento,
    };
    dispatch(addPedidoServer(pedidoAtualizado));
    dispatch(removeProductServer(pedidoAtualizado.idProduto));

    const filteredPechinchas = pechinchas.filter(pechincha => pechincha.idProduct === pedidoAtualizado.idProduto);
    filteredPechinchas.forEach(pechincha => {
      dispatch(removePechinchaServer(pechincha.id));
    })
    navigate("/pedidos");
  };

  /**
   * Verifica se os dados de pagamento estão disponíveis e, em caso negativo, redireciona o usuário de volta à página inicial.
   */
  useEffect(() => {
    if (!novoPagamento) {
      console.log("Erro: Dados de pagamento não encontrados");
      alert("Erro: Dados de pagamento não encontrados.");
      navigate("/");
    }
  }, [novoPagamento, navigate]);

  // Se não houver dados de pagamento, exibe a mensagem de carregamento.
  if (!novoPagamento) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Pagamento</h1>

      <div className="d-flex mt-3">
        <div className="me-3">
          <img
            src={novoPagamento.image}
            alt="Descrição da imagem"
            className="img-fluid rounded"
            style={{ maxWidth: "200px" }}
          />
        </div>

        <div className="flex-grow-1">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{novoPagamento.name}</h5>
              <p>Preço: R$ {novoPagamento.price}</p>
              <p>Vendedor: {novoPagamento.NomeVendedor}</p>

              <form onSubmit={handleSubmit(finalizarPedido)}>
                <label htmlFor="endereco" className="form-label mt-3">
                  Endereço de entrega:
                </label>
                <input
                  type="text"
                  id="endereco"
                  {...register("endereco")}
                  className={`form-control ${errors.endereco ? "is-invalid" : ""}`}
                  placeholder="Digite o endereço"
                />
                <div className="invalid-feedback">{errors.endereco?.message}</div>

                <label htmlFor="opcaoEnvio" className="form-label mt-3">
                  Opção de envio:
                </label>
                <select
                  id="opcaoEnvio"
                  {...register("opcaoEnvio", { required: "Selecione uma opção de envio." })}
                  className={`form-select form-select-lg mt-3 border-primary shadow-sm ${errors.opcaoEnvio ? "is-invalid" : ""}`}
                >
                  <option value="" className="text-muted">Selecione uma opção</option>
                  <option value="Entrega simples">Entrega simples</option>
                  <option value="Entrega rápida">Entrega rápida</option>
                </select>
                <div className="invalid-feedback">{errors.opcaoEnvio?.message}</div>

                <label htmlFor="formaPagamento" className="form-label mt-3">
                  Forma de pagamento:
                </label>
                <select
                  id="formaPagamento"
                  {...register("formaPagamento", { required: "Selecione uma forma de pagamento." })}
                  className={`form-select form-select-lg mt-3 border-primary shadow-sm ${errors.formaPagamento ? "is-invalid" : ""}`}
                >
                  <option value="" className="text-muted">Selecione uma forma de pagamento</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Boleto Bancário">Boleto Bancário</option>
                  <option value="PIX">PIX</option>
                </select>
                <div className="invalid-feedback">{errors.formaPagamento?.message}</div>

                {formaPagamentoSelecionada === "Cartão de Crédito" && (
                  <div className="mb-3">
                    <label htmlFor="numeroCartao" className="form-label">
                      Número do Cartão:
                    </label>
                    <input type="text" id="numeroCartao" {...register("numeroCartao")}
                    minlength="14" maxlength="16" required
                      className={`form-control`}
                      placeholder="Digite o número do cartão"
                    />
                    <label htmlFor="parcelas" className="form-label">
                      Parcelamento:
                    </label>
                    <select id="parcelas" {...register("parcelas")}
                      className={`form-select ${errors.parcelas ? "is-invalid" : ""}`}
                    >
                      <option value="" className="text-muted">Selecione o número de parcelas</option>
                      <option value="1">À vista</option>
                      <option value="2">2x</option>
                      <option value="3">3x</option>
                      <option value="4">4x</option>
                      <option value="5">5x</option>
                      <option value="6">6x</option>
                    </select>
                  </div>
                )}

                {formaPagamentoSelecionada === "Cartão de Débito" && (
                  <div className="mb-3">
                    <label htmlFor="numeroCartao" className="form-label">
                      Número do Cartão:
                    </label>
                    <input type="text" id="numeroCartao" {...register("numeroCartao")}
                    minlength="14" maxlength="16" required
                      className={`form-control`}
                      placeholder="Digite o número do cartão"
                    />
                  </div>
                )}

                {formaPagamentoSelecionada === "Boleto Bancário" && (
                  <div className="mt-3">
                    <p>O boleto será gerado após a confirmação do pedido.</p>
                  </div>
                )}

                {formaPagamentoSelecionada === "PIX" && (
                  <div className="mt-3">
                    <p>Chave PIX: {`pix${Math.random().toString(36).substring(2, 18)}@exemplo.com`}</p>
                    <p>Realize o pagamento e envie o comprovante.</p>
                  </div>
                )}

                <button type="submit" className="btn btn-primary mt-4 w-100">
                  Finalizar Pedido
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
