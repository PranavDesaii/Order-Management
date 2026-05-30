'use client';

import { useState } from 'react';
import { updateOrderStatus } from '../../lib/api';

export default function UpdateStatus() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('PREPARING');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const statuses = [
    { value: 'PLACED', label: 'Placed', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'PREPARING', label: 'Preparing', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const order = await updateOrderStatus(parseInt(orderId), status);
      setIsSuccess(true);
      setMessage(`Order #${order.id} status updated to ${order.status}!`);
      setOrderId('');
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
          <h1 className="text-3xl font-bold text-gray-900">Update Status</h1>
          <p className="text-gray-500 mt-1">Change the status of an existing order</p>
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

          {/* Order ID */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Order ID
            </label>
            <input
              type="number"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter order ID (e.g. 1)"
              required
            />
          </div>

          {/* Status Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select New Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    status === s.value
                      ? s.color + ' border-current scale-105'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
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
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}