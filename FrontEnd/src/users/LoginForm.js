/**
 * Componente funcional que exibe o formulário de login e criação de conta.
 * @module users/LoginForm
 */
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginServer, signupServer } from '../slices/LoginSlice';
import { loginSchema } from './LoginSchema';

/**
 * O componente permite que o usuário faça login ou crie uma nova conta, usando validação de formulário e integração com o Redux.
 * 
 * @component
 * @returns {JSX.Element} Um formulário de login com opções para entrar ou criar uma conta.
 */
function LoginForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(state => state.logins.status);
    const error = useSelector(state => state.logins.error);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema)
    });

    /** Referência para armazenar os dados do formulário */
    let data = useRef(null);

    /**
     * Função responsável por enviar os dados de login para o servidor.
     * 
     * @param {Object} login - Dados do usuário para login (nome de usuário e senha).
     */
    function handleLogin(login) {
        data.current = login;
        dispatch(loginServer(login));
    }

    /**
     * Função responsável por enviar os dados de registro para o servidor.
     * 
     * @param {Object} login - Dados do usuário para registro (nome de usuário e senha).
     */
    function handleSignin(login) {
        data.current = login;
        dispatch(signupServer(login));
    }

    useEffect(() => {
        if (data.current) {
            if (status === "logged_in") {
                data.current = null;
                navigate("/"); // Redireciona para a página inicial após login
            }
        }
    }, [status, navigate]);

    useEffect(() => {
        if (data.current) {
            if (error === 1) {
                alert("Já existe um usuário com este nome!");
                data.current = null;
            } else if (error === 2) {
                alert("Usuário ou senha incorretos!");
                data.current = null;
            }
        }
    }, [error]);

    return (
        <div className="container">
            <br/>
            <div className="text-center"><h1>Login</h1></div>
            <br/>
            <form>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Nome de Usuário</label>
                    <input 
                        placeholder="Insira seu nome de usuário"
                        type="text"
                        className="form-control"
                        id="username"
                        autoComplete="off"
                        {...register("username")}
                    />
                    {errors.username && <span>{errors.username.message}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <input 
                        placeholder="Insira sua senha"
                        type="password"
                        className="form-control"
                        id="password"
                        {...register("password")}
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>
                <button type="button" onClick={handleSubmit(handleLogin)} className="btn btn-primary mx-2">Entrar</button>
                <button type="button" onClick={handleSubmit(handleSignin)} className="btn btn-primary mx-2">Criar conta</button>
            </form>
        </div>
    );
}

export default LoginForm;
