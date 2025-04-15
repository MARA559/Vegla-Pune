// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import SalesReport from './SalesReport';

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Inventory Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-2 rounded-md ${
                  activeTab === 'products' ? 'bg-gray-200' : ''
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-3 py-2 rounded-md ${
                  activeTab === 'sales' ? 'bg-gray-200' : ''
                }`}
              >
                Sales Report
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'products' ? (
          <>
            <div className="mb-4">
              <button
                onClick={handleAddNew}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add New Product
              </button>
            </div>
            <ProductList onEdit={handleEdit} />
          </>
        ) : (
          <SalesReport />
        )}

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <ProductForm product={editingProduct} onClose={closeForm} />
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;