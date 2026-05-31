// src/pages/OrderPaymentPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Package, MapPin, CreditCard, ShoppingBag } from "lucide-react"; // Icons for nice details
import API from "../api/axios";
import CheckoutForm from "../components/CheckoutForm";

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
    navigate("/my-orders"); // NEW FIX: Customer orders management screen par redirect synchronize kiya
  };

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-gray-500 animate-pulse">
        Loading Order Summary & Products... 📦
      </div>
    );
  if (!order)
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        Order Not Found
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 mt-4">
      {/* 🚀 NEW FIX: Master Responsive Grid Layout (Left Side Details vs Right Side Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==========================================
            LEFT COLUMN: PRODUCTS & SHIPPING DETAILS (60% Width)
           ========================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 📦 Product Items Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-4 mb-4">
              <Package className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-gray-800">Items in Order</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {order.orderItems?.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  {/* Image container handles fallback safely */}
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={item.image || "https://via.placeholder.com/150"} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  
                  {/* Item Description */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">Product ID: {item.product?._id || item.product}</p>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      {item.qty} x <span className="text-blue-600 font-bold">${item.price}</span>
                    </p>
                  </div>

                  {/* Line Total */}
                  <div className="text-right font-bold text-gray-800 text-sm md:text-base">
                    ${(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 📍 Shipping & Delivery Information */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-4 mb-4">
              <MapPin className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-gray-800">Shipping Destination</h3>
            </div>
            
            {order.shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">{order.user?.name || "Customer"}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-1">{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Address details not synced with this checkout payload object.</p>
            )}
          </div>

        </div>

        {/* ==========================================
            RIGHT COLUMN: STRIPE CHECKOUT FORM CARD (40% Width)
           ========================================== */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center gap-2 border-b pb-4 mb-4">
              <CreditCard className="text-blue-600" size={20} />
              <h2 className="text-xl font-bold text-gray-800">Secure Checkout</h2>
            </div>
            
            <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-50 p-2 rounded-lg break-all">
              ORDER ID: {order._id}
            </p>

            {/* Bill Summary Breakdown */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-2 text-sm text-gray-600 border border-gray-100/60">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-medium">${(order.totalPrice - (order.shippingPrice || 10)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-medium">${(order.shippingPrice || 10).toFixed(2)}</span>
              </div>
              <hr className="border-gray-200 my-2" />
              <div className="flex justify-between font-black text-gray-900 text-lg">
                <span>Total Amount:</span>
                <span className="text-blue-600">${order.totalPrice}</span>
              </div>
            </div>

            {order.isPaid ? (
              <div className="bg-green-50 text-green-700 text-center py-3 px-4 rounded-xl font-bold border border-green-100 flex items-center justify-center gap-2">
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
        </div>

      </div>
    </div>
  );
};

export default OrderPaymentPage;