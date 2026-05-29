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

      // join socket room for this store
      const socket = getSocket();
      joinStore(parseInt(storeId));
      socket.on('new_order', (newOrder) => {
        console.log('New order received:', newOrder);
      });

      setMessage(`Order #${order.id} created successfully!`);
      setStoreId('');
      setItems([{ item_id: '', qty: '' }]);
      setTotalAmount('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Order</h1>

      {message && (
        <div className={`p-3 rounded mb-4 text-sm ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Store ID</label>
          <input
            type="number"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter store ID"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="number"
                value={item.item_id}
                onChange={(e) => updateItem(index, 'item_id', e.target.value)}
                className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Item ID"
                required
              />
              <input
                type="number"
                value={item.qty}
                onChange={(e) => updateItem(index, 'qty', e.target.value)}
                className="w-1/3 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Qty"
                required
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 text-sm px-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-500 text-sm mt-1 hover:underline"
          >
            + Add Item
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter total amount"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>
    </div>
  );
}