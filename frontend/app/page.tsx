import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
            Multi-Store Management
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mt-4 mb-4">
            Order Management
            <span className="text-blue-600"> System</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Manage orders across multiple stores with real-time updates and powerful analytics.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/create-order"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Create Order
            </Link>
            <Link href="/orders"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Create Orders</h3>
            <p className="text-gray-500 text-sm">Create new orders with multiple items for any store instantly.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-green-600 text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Real-time Updates</h3>
            <p className="text-gray-500 text-sm">Get instant notifications when orders are created or updated.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Analytics</h3>
            <p className="text-gray-500 text-sm">Track revenue, top items and daily orders across all stores.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/create-order"
            className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl">
              +
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Create New Order</h3>
              <p className="text-gray-500 text-sm">Add items and place a new order</p>
            </div>
          </Link>
          <Link href="/orders"
            className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-2xl">
              ☰
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">View Orders</h3>
              <p className="text-gray-500 text-sm">Filter and manage orders by store</p>
            </div>
          </Link>
          <Link href="/update-status"
            className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-2xl">
              ✎
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Update Status</h3>
              <p className="text-gray-500 text-sm">Change order status in real-time</p>
            </div>
          </Link>
          <Link href="/orders"
            className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white text-2xl">
              📈
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Analytics</h3>
              <p className="text-gray-500 text-sm">View revenue and top selling items</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}