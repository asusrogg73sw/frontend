import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import API from "../api/axios";
import CheckoutForm from "../components/CheckoutForm";

// 🔐 Apni Stripe Publishable Key yahan dalein (Stripe Dashboard se milegi)
const stripePromise = loadStripe("pk_test_51R5zJMRrJPw2wOndAzU0oSkCwYoOZVNLeXb2G5mFdbpA5RY0CAui80KtijZrCYXnh2mne08XnrEupVZ6cNWgAd8D00SPrIKjp7");

const OrderPaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load order");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  const handlePaymentSuccess = () => {
    alert(
      "Mubarak Ho! Payment Successful 🎉 Webhook background mein database update kar raha hai.",
    );
    navigate("/orders"); // Ya jahan aap redirect karna chahein
  };

  if (loading)
    return (
      <div className="text-center mt-10 font-bold">
        Loading Order Summary...
      </div>
    );
  if (!order)
    return (
      <div className="text-center mt-10 text-red-500 font-bold">
        Order Not Found
      </div>
    );

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-100 mt-12">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Secure Checkout</h2>
      <p className="text-sm text-gray-400 mb-6">
        Order ID: <span className="font-mono text-xs">{order._id}</span>
      </p>

      {/* Bill Summary */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Items Subtotal:</span>
          <span>${order.totalPrice - 10}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>$10.00</span>
        </div>
        <hr className="border-gray-200 my-2" />
        <div className="flex justify-between font-bold text-gray-800 text-base">
          <span>Total Amount:</span>
          <span>${order.totalPrice}</span>
        </div>
      </div>

      {order.isPaid ? (
        <div className="bg-green-100 text-green-800 text-center py-3 rounded-xl font-bold">
          ✓ This order is already Paid!
        </div>
      ) : (
        // 🛡️ Stripe Elements Wrapper
        <Elements stripe={stripePromise}>
          <CheckoutForm
            orderId={order._id}
            totalPrice={order.totalPrice}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}
    </div>
  );
};

export default OrderPaymentPage;
