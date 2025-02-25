/**
 * Exibe as pechinchas feitas e recebidas pelo comprador.
 * @module menu/Pechincha
 */
import { useEffect, React } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PechinchaCard from '../main/PechinchaCard';
import PechinchaCardOwn from '../main/PechinchaCardOwn';
import { selectAllPechinchas, fetchPechinchas } from '../slices/PechinchaSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

/**
 * Componente que renderiza as pechinchas feitas e recebidas pelo comprador logado.
 * As pechinchas feitas pelo comprador são listadas em uma seção, e as recebidas são listadas em outra.
 * 
 * @component
 * @returns {JSX.Element} O componente que exibe as pechinchas do comprador.
 */
export default function Pechincha() {

  const pechinchas = useSelector(selectAllPechinchas);
  const status = useSelector(state => state.pechinchas.status);
  const error = useSelector(state => state.pechinchas.error);
  const buyer = useSelector(state => state.logins.username);

  const dispatch = useDispatch();

  useEffect(() => {
          dispatch(fetchPechinchas());
      }, [dispatch]);

  /**
   * Realiza a busca pelas pechinchas sempre que o status mudar.
   * 
   * @effect
   */
  useEffect(() => {
      if (status === "not_loaded") {
          dispatch(fetchPechinchas());
      } else if (status === "failed") {
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

  /**
   * Filtra as pechinchas feitas pelo comprador e que ainda não foram aceitas.
   * 
   * @returns {Array} Lista de pechinchas feitas pelo comprador.
   */
  const filteredPechinchas = pechinchas.filter(pechincha => {
    return pechincha.buyer === buyer; // Exclui as pechinchas aceitas
  });

  /**
   * Filtra as pechinchas recebidas pelo vendedor e que ainda não foram aceitas.
   * 
   * @returns {Array} Lista de pechinchas recebidas pelo comprador.
   */
  const filteredPechinchasOwn = pechinchas.filter(pechincha => {
    return pechincha.seller === buyer; // Exclui as pechinchas aceitas
  });

  let pechinchasShow = null;
  let pechinchasOwnShow = null;

  /**
   * Condicionalmente exibe o conteúdo com base no status das pechinchas.
   * - Se "loaded", exibe as pechinchas feitas e recebidas.
   * - Se "loading", exibe uma mensagem de carregamento.
   * - Se "failed", exibe uma mensagem de erro.
   */
  if (status === "loaded") {
    pechinchasShow = filteredPechinchas.length > 0 ? filteredPechinchas.map(pechincha => (
      <PechinchaCard key={pechincha.id} pechincha={pechincha} />
    )) : <div>Nenhuma pechincha encontrada.</div>;

    pechinchasOwnShow = filteredPechinchasOwn.length > 0 ? filteredPechinchasOwn.map(pechincha => (
      <PechinchaCardOwn key={pechincha.id} id={pechincha.id} />
    )) : <div>Nenhuma pechincha encontrada.</div>;
  } else if (status === "loading") {
    pechinchasShow = <div>Carregando as pechinchas...</div>;
    pechinchasOwnShow = <div>Carregando as pechinchas...</div>;
  } else if (status === "failed") {
    pechinchasShow = <div>Erro: {error}</div>;
    pechinchasOwnShow = <div>Erro: {error}</div>;
  }

  /**
   * Retorna o JSX que exibe as pechinchas feitas e recebidas, incluindo o título das seções.
   * 
   * @returns {JSX.Element} O JSX que renderiza as seções de pechinchas feitas e recebidas.
   */
  return (
    <div>
      <br />
      <h2 className="text-center">Pechinchas</h2>
      <br />
      <br />
      <h2>Feitas</h2>
      <br />
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {pechinchasShow}
      </div>
      <br />
      <h2>Recebidas</h2>
      <br />
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {pechinchasOwnShow}
      </div>
    </div>
  );
}
