import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../api/axios";

interface CheckoutFormProps {
  orderId: string;
  totalPrice: number;
  onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  orderId,
  totalPrice,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Backend se Client Secret mangwana
      const { data } = await API.post("/payment/process", { orderId });
      const clientSecret = data.client_secret;

      // 2. Stripe SDK ke zariye card confirm karna
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setPaymentError(result.error.message || "Payment Failed");
        setIsProcessing(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          // 🎉 Payment successful!
          setIsProcessing(false);
          onSuccess();
        }
      }
    } catch (error: any) {
      setPaymentError(error.response?.data?.message || error.message);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-xl bg-gray-50 border-gray-200">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      {paymentError && (
        <p className="text-sm text-red-500 font-semibold">{paymentError}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:bg-gray-400"
      >
        {isProcessing ? "Processing Cash... 💸" : `Pay Now ($${totalPrice})`}
      </button>
    </form>
  );
};

export default CheckoutForm;
