// src/pages/OrderListPage.tsx
import  { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { listOrders, deliverOrder } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";

const OrderListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux store se orders uthana
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const deliverHandler = async (id: string) => {
    if (
      window.confirm("Kya aap is order ko Delivered mark karna chahte hain?")
    ) {
      try {
        await dispatch(deliverOrder(id)).unwrap();
        alert("Order status updated to Delivered! 🚚");
      } catch (err) {
        alert("Status update failed: " + err);
      }
    }
  };

  if (loading)
    return <div className="text-center mt-10 font-bold">Loading Orders...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500 font-bold">{error}</div>
    );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Orders Command Center
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 text-sm uppercase">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Delivered</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm divide-y divide-gray-100">
            {orders.map((order: any) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-xs text-blue-600">
                  {order._id}
                </td>
                <td className="p-4 font-medium text-gray-800">
                  {order.user && order.user.name}
                </td>
                <td className="p-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 font-bold text-gray-800">
                  ${order.totalPrice}
                </td>
                <td className="p-4">
                  {order.isPaid ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Paid ({new Date(order.paidAt).toLocaleDateString()})
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Not Paid
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {order.isDelivered ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Delivered
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Pending
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  {/* Agar order paid nahi hai, to Pay Now ka button dikhao */}
                  {!order.isPaid && (
                    <button
                      onClick={() => navigate(`/order-pay/${order._id}`)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-sm"
                    >
                      Pay Now 💳
                    </button>
                  )}

                  {/* Aapka purana Mark as Delivered wala button */}
                  {order.isPaid && !order.isDelivered && (
                    <button
                      onClick={() => deliverHandler(order._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm"
                    >
                      Mark As Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListPage;
