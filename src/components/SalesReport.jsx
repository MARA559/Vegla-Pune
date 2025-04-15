// src/components/SalesReport.jsx
import React, { useState, useEffect } from 'react';
import { getSales, getProducts } from '../utils/localStorage';

function SalesReport() {
  const [monthlySales, setMonthlySales] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    const sales = getSales();
    const products = getProducts();
    const productMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    const filteredSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      const saleMonth = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(
        2,
        '0'
      )}`;
      return saleMonth === selectedMonth;
    });

    const aggregatedSales = filteredSales.reduce((acc, sale) => {
      const product = productMap[sale.productId];
      if (!product) return acc;

      const existing = acc.find((item) => item.productId === sale.productId);
      if (existing) {
        existing.quantity += sale.quantity;
        existing.total += sale.quantity * sale.price;
      } else {
        acc.push({
          productId: sale.productId,
          productName: product.name,
          quantity: sale.quantity,
          total: sale.quantity * sale.price,
        });
      }
      return acc;
    }, []);

    setMonthlySales(aggregatedSales);
  }, [selectedMonth]);

  const totalRevenue = monthlySales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <h2 className="text-xl font-bold mb-4">Monthly Sales Report</h2>
      
      <div className="mb-4">
        <strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity Sold
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Revenue
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {monthlySales.map((sale) => (
            <tr key={sale.productId}>
              <td className="px-6 py-4 whitespace-nowrap">{sale.productName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sale.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">${sale.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesReport;