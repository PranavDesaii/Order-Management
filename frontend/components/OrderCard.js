'use client';

export default function OrderCard({ order }) {
  const statusColors = {
    PLACED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Order #{order.id}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>
      <div className="text-gray-600 text-sm mb-2">
        <p>Store ID: {order.store_id}</p>
        <p>Total: ₹{order.total_amount}</p>
        <p>Date: {new Date(order.created_at).toLocaleString()}</p>
      </div>
      {order.items && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700">Items:</p>
          <ul className="text-sm text-gray-600">
            {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item, index) => (
              <li key={index}>Item {item.item_id} — Qty: {item.qty}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}