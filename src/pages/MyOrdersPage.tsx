// src/pages/MyOrdersPage.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
// 🚀 NEW FIX: deleteOrder action thunk ko slice se import kiya
import { listMyOrders, deleteOrder } from "../store/orderSlice"; 
import { ShoppingBag, Trash2 } from "lucide-react"; 
import { Link } from "react-router-dom";

const MyOrdersPage = () => {
  const dispatch = useAppDispatch();
  
  // 🚀 NEW FIX: Ab hum direct global Redux state se 'orders' extract kar rahe hain, local useState ki zaroorat nahi
  const { orders, loading, error } = useAppSelector((state) => state.orders || { orders: [] });
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);

  // 🗑️ Delete/Cancel Order Handler Logic
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Kya aap is unpaid order ko delete/cancel karna chahte hain? 🚨")) {
      // 🚀 NEW FIX: Direct Redux dispatch call chalayi jo backend clean karkay global store filter kar degi
      dispatch(deleteOrder(orderId))
        .unwrap()
        .then(() => {
          alert("Order successfully canceled/deleted! 💥");
        })
        .catch((err: string) => {
          alert(err || "Failed to delete order.");
        });
    }
  };

  if (loading) return <div className="text-center py-10">Loading your orders... 📦</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {userInfo?.name}! Your Orders 🛍️
      </h2>

      {orders && orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No Orders Found</h3>
          <p className="text-gray-400 text-sm mt-1">Aap ne abhi tak koi order place nahi kiya.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid Status</th>
                <th className="p-4">Delivery</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50 text-sm">
                  <td className="p-4 font-mono text-xs">
                    <Link 
                      to={`/order-pay/${order._id}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline font-bold transition break-all"
                      title="Click to Pay / View Details"
                    >
                      {order._id}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-gray-800">${order.totalPrice}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {order.isPaid ? `Paid (${new Date(order.paidAt).toLocaleDateString()})` : "Not Paid"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </td>
                  
                  {/* Actions column rendering conditional guard wrapper */}
                  <td className="p-4 text-center">
                    {!order.isPaid ? (
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition"
                        title="Cancel & Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">Locked</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;