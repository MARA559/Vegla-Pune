// src/utils/localStorage.js
// Products
export const getProducts = () => {
  const products = localStorage.getItem('products');
  return products ? JSON.parse(products) : [];
};

export const addProduct = (product) => {
  const products = getProducts();
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
};

export const updateProduct = (updatedProduct) => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    localStorage.setItem('products', JSON.stringify(products));
  }
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter((product) => product.id !== id);
  localStorage.setItem('products', JSON.stringify(filtered));
};

// Sales
export const getSales = () => {
  const sales = localStorage.getItem('sales');
  return sales ? JSON.parse(sales) : [];
};

export const addSale = (sale) => {
  const sales = getSales();
  sales.push(sale);
  localStorage.setItem('sales', JSON.stringify(sales));
};