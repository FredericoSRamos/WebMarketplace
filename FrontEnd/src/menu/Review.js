/**
 * Formulário para adicionar ou atualizar uma avaliação sobre uma compra.
 * @module menu/Review
 */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addReviewServer, selectReviewsById, updateReviewServer } from "../slices/ReviewsSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { reviewSchema } from "./ReviewSchema";
import { selectPedidoById } from "../slices/PedidoSlice";

/**
 * Componente que renderiza um formulário para o usuário adicionar ou editar uma avaliação sobre uma compra.
 * A avaliação pode ser criada ou atualizada com base no ID fornecido na URL.
 *
 * @component
 * @returns {JSX.Element} O componente que renderiza o formulário de avaliação.
 */
export default function ReviewForm() {
    let { orderId, reviewId } = useParams();

    const reviewFound = useSelector(state => selectReviewsById(state, reviewId));
    const order = useSelector(state => selectPedidoById(state, orderId));
    const buyer = useSelector(state => state.logins.username);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /**
     * Define o tipo de ação (adicionar ou atualizar) com base na existência da avaliação e do ID de revisão.
     * Se reviewId for encontrado, verifica se existe uma avaliação; caso contrário, define como "add".
     * 
     * @state {string} actionType - Tipo de ação ('add' ou 'update').
     */
    const [actionType] = useState(
        reviewId ? reviewFound ? 'update' : 'add' : 'add'
    );

    /**
     * Utiliza o hook useForm para gerenciar o formulário de avaliação, integrando com o esquema de validação Yup.
     * 
     * @hook
     */
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(reviewSchema)
    });

    /**
     * Carrega os dados da avaliação existente, se houver, ou define valores iniciais do esquema de validação.
     * 
     * @state {object} reviewOnLoad - Dados da avaliação a ser editada ou valores padrão.
     */
    const [reviewOnLoad] = useState(
        reviewId ? reviewFound ?? reviewSchema.cast({}) : reviewSchema.cast({})
    );

    /**
     * Função chamada quando o formulário é submetido. Envia a avaliação para o servidor
     * para criar uma nova ou atualizar uma existente, e então navega para a página de avaliações.
     *
     * @param {object} review - Dados da avaliação preenchidos no formulário.
     * @function
     */
    function onSubmit(review) {
        review.seller = order.NomeVendedor;
        review.buyer = buyer;
        if (actionType === "add") {
            review.orderId = orderId;
            dispatch(addReviewServer(review));
        } else {
            dispatch(updateReviewServer({ ...review, id: reviewFound.id }));
        }

        navigate('/avaliacoes');
    };

    /**
     * Retorna o JSX do componente, que inclui o formulário para avaliação da compra.
     * O formulário inclui campos para a nota e mensagem da avaliação, com validação de erros.
     * 
     * @returns {JSX.Element} O JSX do formulário de avaliação.
     */
    return (
        <div className="container">
            <br />
            <h5>Conte-nos como foi a sua experiência nessa compra!</h5>
            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="rate" className="form-label">Nota</label>
                    <div className="input-group">
                        <input
                            type="number"
                            step="0.1"
                            min={0}
                            max={10}
                            className="form-control"
                            id="rate"
                            defaultValue={reviewOnLoad.rate}
                            {...register("rate")}
                        />
                        <span className="input-group-text">/10</span>
                    </div>
                    {errors.rate && <span>{errors.rate.message}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">Mensagem</label>
                    <textarea
                        placeholder="Insira uma mensagem expressando como foi a compra"
                        className="form-control"
                        id="message"
                        defaultValue={reviewOnLoad.message}
                        {...register("message")}
                    />
                    {errors.message && <span>{errors.message.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary">Publicar</button>
            </form>
        </div>
    );
}
