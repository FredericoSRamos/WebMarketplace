import React from 'react';
import { useDispatch } from 'react-redux';
import { removeProductServer } from '../slices/ProductsSlice';

export default function ProductCard({ product }) {

    const dispatch = useDispatch();

    const handleClick = (id) => {
        dispatch(removeProductServer(id))
    };

    return (
        <div className="col-md-4 mb-3">
            <div className="card product h-100">
                <img 
                    src={product.image} 
                    className="card-img-top" 
                    alt={product.name} 
                    style={{ objectFit: "cover", height: "200px" }} 
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">R$ {product.price.toFixed(2)}</p>
                    <button className="btn btn-danger" onClick={() => handleClick(product.id)}>Remover</button>
                </div>
            </div>
        </div>
    );
}