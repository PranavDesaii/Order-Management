'use client';

import { useState } from 'react';
import { createOrder } from '../../lib/api';
import { getSocket, joinStore } from '../../lib/socket';

export default function CreateOrder() {
  const [storeId, setStoreId] = useState('');
  const [items, setItems] = useState([{ item_id: '', qty: '' }]);
  const [totalAmount, setTotalAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const addItem = () => {
    setItems([...items, { item_id: '', qty: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const orderData = {
        store_id: parseInt(storeId),
        items: items.map((item) => ({
          item_id: parseInt(item.item_id),
          qty: parseInt(item.qty),
        })),
        total_amount: parseFloat(totalAmount),
      };

      const order = await createOrder(orderData);
      const socket = getSocket();
      joinStore(parseInt(storeId));
      socket.on('new_order', (newOrder) => {
        console.log('New order received:', newOrder);
      });

      setIsSuccess(true);
      setMessage(`Order #${order.id} created successfully!`);
      setStoreId('');
      setItems([{ item_id: '', qty: '' }]);
      setTotalAmount('');
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Order</h1>
          <p className="text-gray-500 mt-1">Fill in the details to place a new order</p>
        </div>

        {/* Alert */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <span className="text-xl">{isSuccess ? '✅' : '❌'}</span>
            <p className={`text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
              {message}
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          {/* Store ID */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Store ID
            </label>
            <input
              type="number"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter store ID (e.g. 1)"
              required
            />
          </div>

          {/* Items */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Order Items
            </label>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="number"
                    value={item.item_id}
                    onChange={(e) => updateItem(index, 'item_id', e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Item ID"
                    required
                  />
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', e.target.value)}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Qty"
                    required
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-200 transition flex-shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
            >
              <span className="text-lg">+</span> Add Another Item
            </button>
          </div>

          {/* Total Amount */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Order...
              </>
            ) : (
              'Create Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}