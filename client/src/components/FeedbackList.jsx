import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function FeedbackList({ carId }) {
  const { fetchFeedback, axios, user } = useAppContext();
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchFeedback(carId).then(fb => {
      if (mounted) setList(fb);
    });
    return () => (mounted = false);
  }, [carId, fetchFeedback]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    await axios.delete(`/api/feedbacks/${id}`);
    setList(list.filter(fb => fb._id !== id));
  };

  const handleEdit = (fb) => {
    setEditId(fb._id);
    setEditRating(fb.rating);
    setEditComment(fb.comment);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`/api/feedbacks/${editId}`, { rating: editRating, comment: editComment });
    setList(list.map(fb => fb._id === editId ? { ...fb, rating: editRating, comment: editComment } : fb));
    setEditId(null);
  };

  if (!list.length) return <p>No feedback yet.</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {list.map(fb => (
        <li key={fb._id} style={{ marginBottom: '1.5em', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1em', background: '#fff' }}>
          {editId === fb._id ? (
            <form onSubmit={handleEditSubmit} style={{ marginBottom: '1em' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', marginBottom: '0.5em' }}>
                <label style={{ fontWeight: 'bold', marginRight: '0.5em' }}>Rating: </label>
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEditRating(n)}
                    style={{ 
                      fontSize: '2em',
                      color: n <= editRating ? '#fbbf24' : '#e5e7eb',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '2px',
                      textShadow: n <= editRating ? '0 1px 4px #fbbf24' : 'none'
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
                  value={editComment}
                  onChange={e => setEditComment(e.target.value)}
                  style={{ width: '100%', marginTop: '.5em', fontSize: '1.1em', borderRadius: '6px', border: '1px solid #e5e7eb', padding: '0.5em' }}
                />
              </div>
              <button type="submit"
                style={{
                  marginTop: '1em',
                  padding: '0.5em 1.5em',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '1em',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.08)'
                }}
              >
                Save
              </button>
              <button type="button" onClick={() => setEditId(null)}
                style={{
                  marginLeft: '1em',
                  padding: '0.5em 1.5em',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '1em',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(239,68,68,0.08)'
                }}
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', marginBottom: '0.5em' }}>
                {[...Array(fb.rating)].map((_, i) => (
                  <span key={i} style={{ color: '#fbbf24', fontSize: '2em', marginRight: '2px', verticalAlign: 'middle', textShadow: '0 1px 4px #fbbf24' }}>★</span>
                ))}
                {[...Array(5 - fb.rating)].map((_, i) => (
                  <span key={i} style={{ color: '#e5e7eb', fontSize: '2em', marginRight: '2px', verticalAlign: 'middle' }}>★</span>
                ))}
                <small style={{ marginLeft: '.5em', color: '#666', fontWeight: 'bold' }}>
                  {new Date(fb.createdAt).toLocaleDateString()} by {fb.user.name}
                </small>
              </div>
              {fb.comment && <p style={{ margin: '.5em 0', fontSize: '1.1em', color: '#333', fontWeight: '500' }}>{fb.comment}</p>}
              {user && fb.user._id === user._id && (
                <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em' }}>
                  <button
                    onClick={() => handleEdit(fb)}
                    style={{ padding: '0.3em 1em', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fb._id)}
                    style={{ padding: '0.3em 1em', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
