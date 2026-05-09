import { useState } from 'react';

export default function StarRating({ rating = 0, count = 0, interactive = false, onRate, userScore }) {
  const [hover, setHover] = useState(0);
  const active = hover || userScore || Math.round(rating);
  return (
    <div>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            onClick={() => interactive && onRate?.(star)}
          >
            {star <= active ? '★' : '☆'}
          </button>
        ))}
      </div>
      <small>
        {Number(rating).toFixed(1)} · {count} ratings
      </small>
      {userScore ? <small>Your rating: {userScore}/5</small> : null}
    </div>
  );
}
