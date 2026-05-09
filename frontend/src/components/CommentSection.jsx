import { useState } from 'react';
import api from '../api/axios';

export default function CommentSection({ photoId, comments, currentUser, onCreated }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/photos/${photoId}/comments`, { body });
      setBody('');
      onCreated?.(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments">
      {currentUser?.role === 'consumer' ? (
        <form onSubmit={submit}>
          <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
          <button className="btn" disabled={loading}>
            {loading ? 'Posting...' : 'Submit'}
          </button>
        </form>
      ) : null}
      {comments.length === 0 ? <p>No comments yet. Be the first!</p> : null}
      {comments.map((comment) => (
        <div key={comment._id} className="comment-item">
          <strong>{comment.userId?.name}</strong>
          <p>{comment.body}</p>
        </div>
      ))}
    </div>
  );
}
