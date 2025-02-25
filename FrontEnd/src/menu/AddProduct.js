/**
 * Formulário para adicionar ou editar um produto.
 * @module menu/AddProduct
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProductServer, selectProductsById, updateProductServer } from '../slices/ProductsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from './ProductSchema';

/**
 * Componente `ProductForm` permite a adição ou edição de produtos.
 * Exibe um formulário com campos como nome, descrição, preço, categoria e imagem do produto.
 * O comportamento do formulário é alterado dependendo se um produto está sendo editado ou adicionado.
 * 
 * @component
 * 
 * @returns {JSX.Element} O formulário para adicionar ou editar um produto.
 */
function ProductForm() {
    /** ID do produto extraído dos parâmetros da URL */
    let { id } = useParams();

    /** Produto encontrado, obtido do Redux */
    const productFound = useSelector(state => selectProductsById(state, id));

    /** Nome do vendedor, obtido do estado de login */
    const seller = useSelector(state => state.logins.username);

    /** Função para despachar ações do Redux */
    const dispatch = useDispatch();

    /** Função para navegação entre páginas */
    const navigate = useNavigate();

    /** Token de autenticação do usuário, obtido do estado de login */
    const token = useSelector(state => state.logins.token);

    /** Estado para determinar se a ação é de 'adicionar' ou 'editar' */
    const [actionType] = useState(id ? (productFound ? 'update' : 'add') : 'add');

    /** Hook de formulários com validação do Yup */
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(productSchema)
    });

    /** Estado inicial do produto ou valor padrão do schema */
    const [productOnLoad] = useState(
        id ? productFound ?? productSchema.cast({}) : productSchema.cast({})
    );

    /**
     * Função chamada quando o formulário é submetido.
     * Realiza o upload da imagem e despacha a ação de adicionar ou atualizar o produto no servidor.
     * 
     * @param {Object} product - Dados do produto com informações como nome, descrição, preço, categoria e imagem.
     */
    async function onSubmit(product) {
        product.seller = seller;

        let flag = false;
        let uploadData;

        /** Se houver imagem, realiza o upload */
        if (product.image && product.image.length > 0) {
            const formData = new FormData();
            formData.append('imageFile', product.image[0]);
            formData.append('name', product.name);
            formData.append('description', product.description);
            formData.append('price', product.price);
            formData.append('category', product.category);
            formData.append('seller', seller);

            const uploadResponse = await fetch('http://localhost:3004/imageUpload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (uploadResponse.ok) {
                flag = true;
                uploadData = await uploadResponse.json();
            } else {
                console.log("Erro no envio da imagem.");
            }
        }

        /** Se a imagem foi carregada, atualiza a URL da imagem */
        if (flag) {
            product.image = `http://localhost:3004/images/${uploadData.filename}`;
        }

        /** Ação para adicionar ou atualizar o produto */
        if (actionType === "add") {
            if (!flag) {
                product.image = `http://localhost:3004/images/template.png`;
            }
            dispatch(addProductServer(product));
        } else {
            if (!flag) {
                product.image = productFound.image;
            }
            dispatch(updateProductServer({ ...product, id: productFound.id }));
        }

        /** Navega para a página principal após a operação */
        navigate('/');
    };

    return (
        <div className="container">
            <br />
            <div className="text-center"><h1>Produto</h1></div>
            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nome</label>
                    <input 
                        placeholder="Insira o nome do produto"
                        type="text"
                        className="form-control"
                        id="name"
                        autoComplete="off"
                        defaultValue={productOnLoad.name}
                        {...register("name")}
                    />
                    {errors.name && <span>{errors.name.message}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descrição</label>
                    <textarea 
                        placeholder="Insira uma descrição para o produto"
                        className="form-control"
                        id="description"
                        defaultValue={productOnLoad.description}
                        {...register("description")}
                    />
                    {errors.description && <span>{errors.description.message}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Preço</label>
                    <div className="input-group">
                        <span className="input-group-text">R$</span>
                        <input
                            placeholder="Insira o valor do produto"
                            type="number"
                            step="0.01"
                            min={1}
                            className="form-control"
                            id="price"
                            defaultValue={productOnLoad.price}
                            {...register("price")}
                        />
                    </div>
                    {errors.price && <span>{errors.price.message}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Categoria</label>
                    <select
                        className="form-select"
                        id="category"
                        defaultValue={productOnLoad.category}
                        {...register("category")}
                    >
                        <option value="Todas">Geral</option>
                        <option value="Beleza">Beleza</option>
                        <option value="Bicicletas">Bicicletas</option>
                        <option value="Eletrônicos">Eletrônicos</option>
                        <option value="Ferramentas">Ferramentas</option>
                        <option value="Joalheria">Joalheria</option>
                        <option value="Óculos">Óculos</option>
                        <option value="Papelaria">Papelaria</option>
                        <option value="Relógios">Relógios</option>
                    </select>
                    {errors.category && <span>{errors.category.message}</span>}
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Imagem</label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        accept="image/png, image/gif, image/jpeg, image/jpg"
                        {...register("image")}
                    />
                    {errors.image && <span>{errors.image.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary">Adicionar</button>
            </form>
        </div>
    );
}

export default ProductForm;
