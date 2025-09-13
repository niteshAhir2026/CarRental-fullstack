import React from 'react';

export default function PaymentMethodModal({ open, onClose, onCash }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Choose Payment Method</h2>
        <button
          className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          onClick={onCash}
        >
          Pay Cash on Pickup
        </button>
        <button
          className="mt-4 w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
