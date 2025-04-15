// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, updateProduct, addSale } from '../utils/localStorage';

function ProductList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [sellQuantity, setSellQuantity] = useState({});

  useEffect(() => {
    const loadProducts = () => {
      const productList = getProducts();
      setProducts(productList);
    };
    loadProducts();
    // Set up polling to check for low stock
    const interval = setInterval(loadProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const handleSell = (product) => {
    const quantity = parseInt(sellQuantity[product.id] || 0);
    if (quantity > 0 && quantity <= product.quantity) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity - quantity,
      };
      updateProduct(updatedProduct);
      addSale({
        productId: product.id,
        quantity,
        price: product.price,
        date: new Date().toISOString(),
      });
      setSellQuantity({ ...sellQuantity, [product.id]: '' });
      setProducts(getProducts());
    }
  };

  const handleOrder = (product) => {
    const quantity = parseInt(prompt('Enter quantity to order:', '10'));
    if (quantity > 0) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity + quantity,
      };
      updateProduct(updatedProduct);
      setProducts(getProducts());
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className={product.quantity <= product.minQuantity ? 'bg-red-100' : ''}>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={sellQuantity[product.id] || ''}
                    onChange={(e) =>
                      setSellQuantity({ ...sellQuantity, [product.id]: e.target.value })
                    }
                    className="w-20 p-1 border rounded"
                    placeholder="Qty"
                  />
                  <button
                    onClick={() => handleSell(product)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Sell
                  </button>
                  <button
                    onClick={() => handleOrder(product)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Order
                  </button>
                  <button
                    onClick={() => onEdit(product)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;