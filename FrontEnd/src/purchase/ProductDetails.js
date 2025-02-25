/**
 * Componente React que exibe os detalhes de um produto, permitindo ao usuário fazer uma "pechincha" (oferta de desconto)
 * e redireciona para finalizar o pedido.
 *
 * @module purchase/ProductDetails
 */
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addPechinchaServer, selectAllPechinchas, fetchPechinchas } from "../slices/PechinchaSlice";
import { yupResolver } from '@hookform/resolvers/yup';
import { pechinchaSchema } from '../menu/PechinchaSchema';
import { useForm } from 'react-hook-form';
import io from 'socket.io-client';
import { selectProductsById } from "../slices/ProductsSlice";

const socket = io('http://localhost:5000');

/**
 * Componente que exibe os detalhes de um produto e gerencia a funcionalidade de pechinchar e finalizar compra.
 *
 * @component
 * @returns {JSX.Element} O componente de detalhes do produto.
 */
export default function ProductDetails() {
    const location = useLocation();
    const product = location.state.product; // Produto obtido do estado da localização.

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Status do carregamento das pechinchas.
    const status = useSelector(state => state.pechinchas.status);

    // Nome do usuário logado.
    const buyer = useSelector(state => state.logins.username);

    // Lista de todas as pechinchas obtidas do estado global.
    const pechinchas = useSelector(selectAllPechinchas);

    useEffect(() => {
            dispatch(fetchPechinchas());
        }, [dispatch]);

    useEffect(() => {
        if (status === "not_loaded") {
            dispatch(fetchPechinchas());
        } else if (status === 'failed') {
            setTimeout(() => dispatch(fetchPechinchas()), 1000);    
        }
    }, [status, dispatch]);

    useEffect(() => {
            socket.on('pechinchaUpdated', (data) => {
                dispatch(fetchPechinchas());
                });
        
                return () => {
                    socket.off('pechinchaUpdated');
                };
        }, [dispatch]);

    const [notificacao] = useState(''); // Notificação opcional para o usuário.
    const [message, setMessage] = useState(''); // Mensagem de feedback ao usuário.

    // Configuração do formulário utilizando react-hook-form e validação com Yup.
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(pechinchaSchema) 
    });

    /**
     * Verifica se já existe uma pechincha para o produto pelo comprador atual.
     * @type {Object|undefined}
     */
    const pechinchaFound = pechinchas.find(p => p.idProduct === product.id && p.buyer === buyer);
    const productFound = useSelector(state => selectProductsById(state, pechinchaFound ? pechinchaFound.idProduct : null));

    const handlepayClick = useCallback(() => {
        if (productFound && pechinchaFound) {
            const novoPagamento = {
                idProduto: productFound.id,
                name: productFound.name,
                image: productFound.image,
                price: pechinchaFound.descount,
                NomeVendedor: productFound.seller,
                comprador: buyer,
                status: 'Finalizado',
                endereco: '',
            };
            navigate(`/pagamentosCard/${productFound.id}`, { state: novoPagamento });
        }

    }, [productFound, pechinchaFound, buyer, navigate]);
    
    const [showButton, setShowButton] = useState(null);

    useEffect(() => {
        if (!pechinchaFound) {
            setShowButton(
                <button className="btn btn-danger btn-lg mt-4 w-100" data-bs-toggle="collapse" data-bs-target="#valorOptions">
                    PECHINCHAR!
                </button>
            );
        } else if (pechinchaFound.status === "aceito") {
            setShowButton(       
                <button className="btn btn-success btn-lg mt-4 w-100" onClick={handlepayClick}>
                    Sua pechincha foi aceita! Clique aqui para comprar
                </button>
            );
        } else {
            setShowButton(
                <button className="btn btn-danger btn-lg mt-4 w-100" onClick={() => navigate("/pechinchas")}>
                    Você já possui uma pechincha neste produto!
                </button>
            );
        }
    }, [pechinchaFound, navigate, handlepayClick]);

    /**
     * Função para confirmar o valor da pechincha e enviá-la ao servidor.
     * @param {Object} data Dados do formulário contendo o desconto desejado.
     */
    const confirmarValor = (data) => {
        const pechincha = {
            descount: data.descount,
            idProduct: product.id,
            seller: product.seller,
            image: product.image,
            buyer: buyer,
            status: 'pendente'
        };
        
        setMessage('Pechincha enviada!');
        dispatch(addPechinchaServer(pechincha));
        setTimeout(() => navigate("/pechinchas"), 1000);
    };

    /**
     * Navega para a página de pagamentos com os detalhes do pedido finalizado.
     */
    const ConfirmarPagamento = () => {
        const novoPagamento = {
            idProduto: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            NomeVendedor: product.seller,
            comprador: buyer,
            status: 'Finalizado',
            endereco: '',
        };
        navigate(`/pagamentosCard/${product.id}`, { state: novoPagamento });
    };

    return (
        <div className="row mt-5">
            <div className="col-md-6">
                <img
                    id="product-image"
                    src={product.image}
                    alt=""
                    className="img-fluid"
                />
            </div>
            <div className="col-md-6">
                <h2 id="product-name">{product.name}</h2>
                <div id="product-price" className="h4">
                    R${product.price}
                </div>
                <div id="product-seller">Vendido por: {product.seller}</div>
                <br/>
                <p id="product-description">{product.description}</p>
                {showButton}
                <div className="collapse" id="valorOptions">
                    <div className="card card-body mt-3">
                        <h5>Insira o valor da pechincha (novo valor do produto):</h5>
                        <br/>
                        <form onSubmit={handleSubmit(confirmarValor)}>
                            <div className="input-group">
                                <span className="input-group-text">R$</span>
                                <input
                                    placeholder="Insira o valor do produto"
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="price"
                                    max={0.9 * product.price}
                                    min={0.1 * product.price}
                                    defaultValue={pechinchaFound?.descount || ''}
                                    {...register("descount")}
                                />
                            </div>
                            {errors.descount && <span>{errors.descount.message}</span>}
                            <br/>
                            <button className="btn btn-danger mt-3">
                                Confirmar Pechincha!
                            </button>
                            {message && (
                                <div className="alert alert-success mt-3">
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
        
                <div id="notificacao" className="alert alert-info mt-3" style={{ display: `${notificacao ? 'block' : 'none'}` }}>
                    {notificacao}
                </div>
                
                <button className="btn btn-primary btn-lg mt-4 w-100" onClick={ConfirmarPagamento}>
                    Finalizar pedido
                </button>
            </div>
        </div>
    );
}