import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ bookingId, amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function fetchClientSecret() {
      try {
        const res = await axios.post(`/api/bookings/${bookingId}/pay`, { amount });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment.');
      }
    }
    fetchClientSecret();
  }, [bookingId, amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });
    setLoading(false);
    if (stripeError) {
      setError(stripeError.message);
    } else if (paymentIntent.status === 'succeeded') {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 1800);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
            <h3 className="text-lg font-bold mb-2 text-green-600">Payment Successful!</h3>
            <p className="text-gray-700">Thank you for your payment.</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement className="p-2 border rounded" />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" disabled={!stripe || loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Processing...' : 'Pay'}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Cancel</button>
        </div>
      </form>
    </>
  );
}

export default CheckoutForm;
