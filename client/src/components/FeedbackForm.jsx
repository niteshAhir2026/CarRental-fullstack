import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function FeedbackForm({ bookingId, carId, onSubmitted }) {
  const { submitFeedback } = useAppContext();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitFeedback({ bookingId, rating, comment });
      setComment('');
      onSubmitted && onSubmitted();        // notify parent to refresh list
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '1em 0', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1em', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', marginBottom: '0.5em' }}>
        <label style={{ fontWeight: 'bold', marginRight: '0.5em' }}>Rating: </label>
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            style={{ 
              fontSize: '2em',
              color: n <= rating ? '#fbbf24' : '#e5e7eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginRight: '2px',
              textShadow: n <= rating ? '0 1px 4px #fbbf24' : 'none'
            }}
          >
            ★
          </button>
        ))}
      </div>
      <div>
        <textarea
          rows={3}
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ width: '100%', marginTop: '.5em', fontSize: '1.1em', borderRadius: '6px', border: '1px solid #e5e7eb', padding: '0.5em' }}
        />
      </div>
      <button type="submit" disabled={submitting}
        style={{
          marginTop: '1em',
          padding: '0.5em 1.5em',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '1em',
          cursor: submitting ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px rgba(37,99,235,0.08)'
        }}
      >
        {submitting ? 'Submitting…' : 'Submit Feedback'}
      </button>
    </form>
  );
}
