'use client';

import { useState, useEffect } from 'react';
import { getOrders } from '../../lib/api';
import { getSocket, joinStore } from '../../lib/socket';
import OrderCard from '../../components/OrderCard';

export default function OrdersList() {
  const [storeId, setStoreId] = useState('');
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(false);

  const fetchOrders = async (pageNum = 1) => {
    if (!storeId) return;
    setLoading(true);
    try {
      const data = await getOrders(storeId, pageNum);
      setOrders(data.data);
      setPagination(data.pagination);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searched || !storeId) return;
    const socket = getSocket();
    joinStore(parseInt(storeId));

    socket.on('new_order', (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      setNewOrderAlert(true);
      setTimeout(() => setNewOrderAlert(false), 3000);
    });

    socket.on('order_updated', (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    });

    return () => {
      socket.off('new_order');
      socket.off('order_updated');
    };
  }, [searched, storeId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders List</h1>
          <p className="text-gray-500 mt-1">Search and manage orders by store</p>
        </div>

        {/* Real-time alert */}
        {newOrderAlert && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3 animate-pulse">
            <span className="text-green-600">⚡</span>
            <p className="text-green-800 text-sm font-medium">New order received in real-time!</p>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="number"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter store ID to search orders"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading orders...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && searched && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <span className="text-5xl">📭</span>
            <p className="text-gray-500 mt-4 font-medium">No orders found for this store</p>
            <p className="text-gray-400 text-sm mt-1">Try a different store ID</p>
          </div>
        )}

        {/* Orders */}
        {!loading && orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => { setPage(page - 1); fetchOrders(page - 1); }}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-600 bg-white border rounded-xl px-4 py-2">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => { setPage(page + 1); fetchOrders(page + 1); }}
              disabled={page === pagination.pages}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}