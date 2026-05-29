import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Order Management System
      </h1>
      <p className="text-gray-500 mb-8">
        Multi-store order management with real-time updates
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/create-order"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
          Create Order
        </Link>
        <Link href="/orders"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50">
          View Orders
        </Link>
      </div>
    </div>
  );
}