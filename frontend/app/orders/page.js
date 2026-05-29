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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchOrders(newPage);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Orders List</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="number"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter store ID"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}

      {!loading && searched && orders.length === 0 && (
        <p className="text-gray-500 text-sm">No orders found for this store.</p>
      )}

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.pages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}