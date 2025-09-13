import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak'];
const wallets = ['Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay'];

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [wallet, setWallet] = useState(wallets[0]);
  const [bank, setBank] = useState(banks[0]);
  const [popup, setPopup] = useState({ show: false, success: true, message: '' });
  const [cardErrors, setCardErrors] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cardTouched, setCardTouched] = useState({ number: false, name: false, expiry: false, cvv: false });

  function luhnCheck(cardNumber) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  function validateCardFields(card) {
    const errors = { number: '', name: '', expiry: '', cvv: '' };
    // Card Number
    if (!/^[0-9]{16}$/.test(card.number) || !luhnCheck(card.number)) {
      errors.number = 'Please enter a valid 16-digit card number.';
    }
    // Cardholder Name
    if (!/^[A-Za-z ]{2,50}$/.test(card.name)) {
      errors.name = "Please enter the cardholder's name as printed on the card.";
    }
    // Expiry Date
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      errors.expiry = 'Please enter a valid expiry date.';
    } else {
      const [mm, yy] = card.expiry.split('/');
      const month = parseInt(mm);
      const year = parseInt(yy) + 2000;
      const now = new Date();
      if (month < 1 || month > 12) {
        errors.expiry = 'Please enter a valid expiry date.';
      } else {
        const expiryDate = new Date(year, month);
        if (expiryDate <= now) {
          errors.expiry = 'Please enter a valid expiry date.';
        }
      }
    }
    // CVV
    if (!/^\d{3,4}$/.test(card.cvv)) {
      errors.cvv = 'Please enter a valid CVV.';
    }
    return errors;
  }

  const isCardValid = Object.values(cardErrors).every(e => !e) && Object.values(cardTouched).every(t => t);

  if (!booking) return <div className="p-8">Booking not found.</div>;

  const handlePay = () => {
    if (method === 'card') {
      if (card.number.length === 16 && card.name && card.expiry && card.cvv.length === 3) {
        setPopup({ show: true, success: true, message: 'Payment Successful!' });
      } else {
        setPopup({ show: true, success: false, message: 'Invalid card details.' });
        return;
      }
    } else if (method === 'upi') {
      if (upi.length > 5) {
        setPopup({ show: true, success: true, message: 'Payment Successful!' });
      } else {
        setPopup({ show: true, success: false, message: 'Invalid UPI ID.' });
        return;
      }
    } else if (method === 'netbanking') {
      setPopup({ show: true, success: true, message: 'Payment Successful!' });
    } else if (method === 'cod') {
      setPopup({ show: true, success: true, message: 'Order placed. Pay on pickup.' });
    }
  };

  function formatCardNumber(value) {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Order / Payment Summary</h2>
      <div className="mb-6">
        <p><b>Order ID:</b> {booking._id}</p>
        <p><b>Car:</b> {booking.car.brand} {booking.car.model}</p>
        <p><b>Rental Period:</b> {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}</p>
        <p><b>Price:</b> ₹{booking.price}</p>
        <p><b>Taxes:</b> ₹{Math.round(booking.price * 0.18)}</p>
        <p><b>Total:</b> ₹{Math.round(booking.price * 1.18)}</p>
      </div>
      <h3 className="text-lg font-semibold mb-2">Payment Options</h3>
      <div className="mb-4 flex gap-4">
        <button className={`px-3 py-1 rounded ${method==='card'?'bg-blue-600 text-white':'bg-gray-200'}`} onClick={()=>setMethod('card')}>Card</button>
        <button className={`px-3 py-1 rounded ${method==='upi'?'bg-blue-600 text-white':'bg-gray-200'}`} onClick={()=>setMethod('upi')}>UPI / Wallet</button>
        <button className={`px-3 py-1 rounded ${method==='netbanking'?'bg-blue-600 text-white':'bg-gray-200'}`} onClick={()=>setMethod('netbanking')}>Net Banking</button>
        <button className={`px-3 py-1 rounded ${method==='cod'?'bg-blue-600 text-white':'bg-gray-200'}`} onClick={()=>setMethod('cod')}>Cash on Delivery</button>
      </div>
      {method==='card' && (
        <div className="space-y-3">
          <label htmlFor="card-number" className="block font-medium">Card Number</label>
          <input
            id="card-number"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            className={`w-full border p-2 rounded ${cardErrors.number && cardTouched.number ? 'border-red-500' : ''}`}
            placeholder="Card Number"
            value={formatCardNumber(card.number)}
            maxLength={19}
            onChange={e=> {
              const raw = e.target.value.replace(/\D/g,'').slice(0,16);
              setCard({...card,number:raw});
              setCardTouched(t=>({...t,number:true}));
              setCardErrors(validateCardFields({...card,number:raw}));
            }}
            onBlur={()=>setCardTouched(t=>({...t,number:true}))}
            aria-invalid={!!cardErrors.number}
            aria-describedby="card-number-error"
          />
          {cardErrors.number && cardTouched.number && <div id="card-number-error" className="text-red-500 text-sm">{cardErrors.number}</div>}

          <label htmlFor="card-name" className="block font-medium">Cardholder Name</label>
          <input
            id="card-name"
            type="text"
            autoComplete="cc-name"
            className={`w-full border p-2 rounded ${cardErrors.name && cardTouched.name ? 'border-red-500' : ''}`}
            placeholder="Cardholder Name"
            value={card.name}
            onChange={e=> {
              setCard({...card,name:e.target.value});
              setCardTouched(t=>({...t,name:true}));
              setCardErrors(validateCardFields({...card,name:e.target.value}));
            }}
            onBlur={()=>setCardTouched(t=>({...t,name:true}))}
            aria-invalid={!!cardErrors.name}
            aria-describedby="card-name-error"
          />
          {cardErrors.name && cardTouched.name && <div id="card-name-error" className="text-red-500 text-sm">{cardErrors.name}</div>}

          <label htmlFor="card-expiry" className="block font-medium">Expiry Date (MM/YY)</label>
          <input
            id="card-expiry"
            type="text"
            autoComplete="cc-exp"
            className={`w-full border p-2 rounded ${cardErrors.expiry && cardTouched.expiry ? 'border-red-500' : ''}`}
            placeholder="MM/YY"
            value={card.expiry}
            maxLength={5}
            onChange={e=> {
              let val = e.target.value.replace(/[^\d]/g, '');
              if (val.length > 2) val = val.slice(0,2) + '/' + val.slice(2,4);
              val = val.slice(0,5);
              setCard({...card,expiry:val});
              setCardTouched(t=>({...t,expiry:true}));
              setCardErrors(validateCardFields({...card,expiry:val}));
            }}
            onBlur={()=>setCardTouched(t=>({...t,expiry:true}))}
            aria-invalid={!!cardErrors.expiry}
            aria-describedby="card-expiry-error"
          />
          {cardErrors.expiry && cardTouched.expiry && <div id="card-expiry-error" className="text-red-500 text-sm">{cardErrors.expiry}</div>}

          <label htmlFor="card-cvv" className="block font-medium">CVV/CVC</label>
          <input
            id="card-cvv"
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            className={`w-full border p-2 rounded ${cardErrors.cvv && cardTouched.cvv ? 'border-red-500' : ''}`}
            placeholder="CVV/CVC"
            value={card.cvv}
            maxLength={4}
            onChange={e=> {
              const val = e.target.value.replace(/\D/g,'').slice(0,4);
              setCard({...card,cvv:val});
              setCardTouched(t=>({...t,cvv:true}));
              setCardErrors(validateCardFields({...card,cvv:val}));
            }}
            onBlur={()=>setCardTouched(t=>({...t,cvv:true}))}
            aria-invalid={!!cardErrors.cvv}
            aria-describedby="card-cvv-error"
          />
          {cardErrors.cvv && cardTouched.cvv && <div id="card-cvv-error" className="text-red-500 text-sm">{cardErrors.cvv}</div>}
        </div>
      )}
      {method==='upi' && (
        <div className="space-y-3">
          <input type="text" placeholder="UPI ID" className="w-full border p-2 rounded" value={upi} onChange={e=>setUpi(e.target.value)}/>
          <select className="w-full border p-2 rounded" value={wallet} onChange={e=>setWallet(e.target.value)}>
            {wallets.map(w=>(<option key={w} value={w}>{w}</option>))}
          </select>
        </div>
      )}
      {method==='netbanking' && (
        <div className="space-y-3">
          <select className="w-full border p-2 rounded" value={bank} onChange={e=>setBank(e.target.value)}>
            {banks.map(b=>(<option key={b} value={b}>{b}</option>))}
          </select>
        </div>
      )}
      {method==='cod' && (
        <div className="space-y-3">
          <p>Cash will be collected on car pickup.</p>
        </div>
      )}
      <button className="mt-6 w-full bg-green-600 text-white py-2 rounded font-semibold" onClick={handlePay} disabled={method==='card' && !isCardValid}>Pay Now</button>
      <button className="mt-2 w-full bg-gray-200 text-gray-700 py-2 rounded" onClick={()=>navigate(-1)}>Cancel</button>
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center ${popup.success ? 'border-green-500' : 'border-red-500'}`}>
            <h3 className={`text-lg font-bold mb-2 ${popup.success ? 'text-green-600' : 'text-red-600'}`}>{popup.message}</h3>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={()=>setPopup({ show: false, success: true, message: '' })}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
