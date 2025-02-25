/**
 * Exibe um cartão clicável com o nome de uma categoria.
 * @module main/CategoryCard
 */
import "../sidebar/MainPage.css";

/**
 * Componente `CategoryCard` exibe um cartão clicável com o nome de uma categoria.
 * Este cartão é utilizado para filtrar os produtos exibidos na página principal.
 * 
 * @component
 * 
 * @param {Object} props - As propriedades do componente.
 * @param {string} props.categoryName - O nome da categoria a ser exibido no cartão.
 * @param {Function} props.onClick - Função que será chamada quando o cartão for clicado.
 * 
 * @returns {JSX.Element} Um cartão de categoria que exibe o nome da categoria
 */
export default function CategoryCard({ categoryName, onClick }) {
  return (
      <div className="category-icon card p-3 m-2" style={{ width: '18rem' }}>
          <div className="card-body text-center" onClick={onClick} style={{ cursor: 'pointer' }}>
              <h5 className="card-title">{categoryName}</h5>
          </div>
      </div>
  );
}
